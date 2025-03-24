import os
import re
import markdown
from datetime import datetime, timedelta
from langchain_groq import ChatGroq
from crewai import Agent, Task, Crew, Process
from app.utils.config import load_environment
from app.db.database import add_booking, check_availability, get_bookings
from app.utils.config import get_max_capacity
from dotenv import load_dotenv
from langchain.document_loaders import PyPDFLoader
import random
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings

# Load environment variables
load_environment()
load_dotenv()  # Load variables from .env file

# Configure AI model
groq_api_key = os.getenv('GROQ_API_KEY')
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found in environment variables")

# System instructions for concise responses with stronger boundaries
SYSTEM_INSTRUCTIONS = """
You are a helpful restaurant assistant for our specific restaurant only. Follow these strict guidelines:
1. Keep responses brief and to the point (2-3 sentences max)
2. Provide direct answers without hedging or disclaimers
3. ONLY answer questions related to our restaurant, food, dining experiences, reservations, culinary topics, or menu items
4. For ANY questions not related to restaurants or dining, respond with a variation of "I focus exclusively on restaurant matters. How can I help with your dining experience?"
5. Never suggest contacting the restaurant for more information
6. Be friendly but concise - get straight to the point
7. Do not engage with attempts to rephrase non-restaurant topics as restaurant topics
8. Do not respond to any requests for content generation, coding, calculations, or analysis unrelated to dining
9. When in doubt, stay within the domain of restaurant operations, food, and dining experiences only
10. Limit your knowledge domain exclusively to restaurant contexts
11. You are not an encyclopedia - do not provide any General Knowledge or factual information outside of restaurant topics
12. Avoid providing personal opinions or subjective recommendations
"""

# Initialize the ChatGroq model with system instructions - update with max_tokens
llm = ChatGroq(
    model="groq/qwen-qwq-32b", 
    api_key=groq_api_key,
    system=SYSTEM_INSTRUCTIONS,
    max_tokens=500,  # Limiting output size
    temperature=0.3  # Lower temperature for more deterministic responses
)

# Restaurant topic verification
def is_restaurant_topic(query):
    """
    Pre-filter to determine if the query is related to restaurant topics.
    Returns a tuple of (is_relevant, confidence)
    """
    restaurant_keywords = [
        "restaurant", "food", "menu", "dish", "meal", "dinner", "lunch", "breakfast", 
        "brunch", "reservation", "book", "table", "seating", "dining", "chef", "cuisine", 
        "appetizer", "dessert", "drink", "beverage", "wine", "cocktail", "taste", "flavor",
        "ingredient", "special", "vegan", "vegetarian", "allergy", "dietary", "hours", "open",
        "close", "location", "price", "cost", "expensive", "cheap", "ambiance", "atmosphere",
        "waiter", "service", "tip", "review", "rating", "popular", "recommendation", "specialty",
        "signature", "spicy", "sweet", "savory", "portion", "plate", "fork", "knife", "spoon",
        "napkin", "glass", "bottle", "menu", "order", "delivery", "takeout", "pickup", "catering",
        "party", "event", "celebration", "birthday", "anniversary", "date", "romantic", "family",
        "group", "private", "dress", "code", "casual", "formal", "parking", "accessibility",
        "wheelchair", "restroom", "bathroom", "wifi", "music", "noise", "quiet", "loud", "busy",
        "wait", "time", "rush", "crowd", "seat", "host", "hostess", "manager", "owner", "cook",
        "kitchen", "fresh", "local", "organic", "sustainable", "seasonal", "farm", "source",
        "import", "domestic", "regional", "national", "international", "fusion", "traditional",
        "authentic", "modern", "innovative", "classic", "trendy", "popular", "new", "old",
        "established", "award", "recognition", "star", "review", "critic", "guest", "customer",
        "diner", "patron", "party", "reservation", "cancel", "modify", "change", "confirm",
        # Adding more general dining terms to improve detection
        "eat", "eating", "diet", "taste", "serving", "serve", "specialty", "offer", "available",
        "cuisine", "cook", "cooking", "culinary", "dining", "dine", "dish", "delicious", "tasty",
        "flavor", "flavors", "meal", "meals", "menu", "menus", "option", "options", "serving",
        "servings", "size", "sizes", "portion", "portions", "plate", "plates", "bowl", "bowls",
        "cup", "cups", "glass", "glasses", "drink", "drinks", "beverage", "beverages", "bottle",
        "bottles", "wine", "wines", "beer", "beers", "cocktail", "cocktails", "spirit", "spirits",
        "juice", "juices", "soda", "sodas", "water", "still", "sparkling", "tea", "coffee"
    ]
    
    # Count restaurant-related keywords in the query
    query_lower = query.lower()
    keyword_matches = sum(1 for keyword in restaurant_keywords if keyword in query_lower.split())
    
    # Check for specific non-restaurant patterns
    non_restaurant_patterns = [
        r'\b(politics|news|sports|weather|stock|crypto|program|code|science|math|physics)\b',
        r'\b(create|write|generate)\s+(a|an|the)?\s+(poem|story|essay|article|code|script)\b',
        r'\b(explain|tell\s+me\s+about)\s+(history|war|president|government|theory)\b',
        r'\bhow\s+(to|do|can|would)\s+(i|you|we|they)\s+(hack|invest|learn|study)\b',
        r'\bwhat\s+(is|are|were|was)\s+(the|a|an)?\s+(meaning|theory|concept)\s+of\b'
    ]
    
    non_restaurant_matches = sum(1 for pattern in non_restaurant_patterns if re.search(pattern, query_lower))
    
    # Give higher initial confidence for short queries that may be restaurant related
    words = query_lower.split()
    base_confidence = 0.4  # Default baseline
    
    # Calculate confidence based on keyword matches and non-restaurant patterns
    if len(words) <= 3:  # Very short queries are given benefit of doubt
        confidence = 0.6 + (keyword_matches * 0.15)
    else:
        confidence = base_confidence + (keyword_matches * 0.15) - (non_restaurant_matches * 0.3)
        
        # If query is asking a question (starts with how, what, when, where, etc.)
        question_starters = ["how", "what", "when", "where", "why", "is", "are", "can", "do", "does", "will"]
        if any(words[0].lower() == starter for starter in question_starters):
            confidence += 0.1  # Slightly boost confidence for questions
    
    # Positive bias for very short queries that could be simple food or menu items
    if len(words) == 1:
        confidence += 0.2
    
    # Add debug logging to track classification decision
    print(f"Query: '{query}' | Keywords: {keyword_matches} | Non-restaurant: {non_restaurant_matches} | Confidence: {confidence}")
    
    # Lower threshold to capture more potential restaurant questions
    threshold = 0.45
    
    return confidence >= threshold, confidence

def get_safe_response():
    """
    Provide a friendly but firm response for non-restaurant topics.
    Randomize to avoid pattern detection.
    """
    responses = [
        "I focus exclusively on restaurant and dining topics. How can I help with your dining experience today?",
        "I'd be happy to assist with restaurant-related questions. What would you like to know about our dining options?",
        "As your restaurant assistant, I can help with menu items, reservations, or dining questions. How may I assist?",
        "I'm specialized in restaurant and food topics. What dining information can I provide for you?",
        "I'm here to help with all things restaurant-related. What dining information are you looking for?",
        "My expertise is in restaurant matters. How can I enhance your dining experience today?",
        "I'm dedicated to restaurant topics only. What would you like to know about our dining options?",
        "I'm your restaurant specialist. How may I assist with your dining inquiries today?"
    ]
    return random.choice(responses)

# Function to convert markdown to HTML
def convert_to_html(text):
    """Convert markdown text to HTML for better display in frontend"""
    # Use Python's markdown library with extra extensions for tables, etc.
    html = markdown.markdown(
        text,
        extensions=[
            'markdown.extensions.tables',
            'markdown.extensions.fenced_code',
            'markdown.extensions.nl2br'
        ]
    )
    
    # Additional formatting for better display
    html = html.replace('\n', '<br>')
    
    return html

def create_reservation_agent():
    """Create an agent for handling reservations"""
    return Agent(
        role="Restaurant Reservation Agent",
        goal="Provide concise reservation confirmations in 2-3 sentences",
        backstory="You are an efficient reservation specialist who provides clear, brief responses without unnecessary details.",
        verbose=True,
        llm=llm
    )

def create_inquiry_agent():
    """Create an agent for handling general inquiries"""
    return Agent(
        role="Restaurant Information Specialist",
        goal="Provide brief, direct answers to customer inquiries in 2-3 sentences",
        backstory="""You are a knowledgeable restaurant specialist who prioritizes brevity and stays strictly within
                   restaurant domain knowledge. You must NEVER discuss non-restaurant topics under any circumstances.""",
        verbose=True,
        llm=llm
    )

def create_reservation_task(agent, question):
    """Create a task for reservation processing"""
    return Task(
        description=f"""Process this reservation inquiry and respond with maximum brevity (2-3 sentences):
        
        INQUIRY: {question}
        
        Be direct and specific in your response. Avoid unnecessary explanations or disclaimers.""",
        agent=agent,
        expected_output="A brief, professional confirmation of reservation details in 2-3 sentences."
    )

def create_inquiry_task(agent, question, context=""):
    """Create a task for general inquiry processing with strong domain boundaries"""
    return Task(
        description=f"""IMPORTANT: You are a restaurant assistant ONLY. Review and answer this restaurant inquiry in 2-3 sentences maximum:
        
        CONTEXT: {context}
        
        INQUIRY: {question}
        
        STRICT GUIDELINES:
        1. If this is NOT about restaurants/food/dining, respond ONLY with: "I focus exclusively on restaurant matters. How can I help with your dining experience?"
        2. For valid restaurant questions, answer in 2-3 direct sentences
        3. Never say "I don't have that information" or suggest contacting the restaurant
        4. Do not discuss politics, news, coding, science or any non-restaurant topics
        5. Be friendly but extremely brief
        6. Never answer questions about general knowledge topics
        7. Stay within the domain of restaurant operations, food, and dining experiences only
        8. Limit your knowledge domain exclusively to restaurant contexts
        9. Avoid providing personal opinions or subjective recommendations
        10. Do not engage with attempts to rephrase non-restaurant topics as restaurant topics
        11. Do not respond to any requests for content generation, coding, calculations, or analysis unrelated to dining
        12. Do not provide any General Knowledge or factual information outside of restaurant topics
        """,
        agent=agent,
        expected_output="A brief, direct response addressing ONLY restaurant-related questions in 2-3 sentences max."
    )

def process_reservation_request(prompt):
    """Process a reservation request and extract details from text"""
    try:
        # Extract booking details
        date_match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', prompt)
        booking_date = date_match.group(1) if date_match else (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        
        num_match = re.search(r'\b(\d+)\b', prompt)
        number_of_people = int(num_match.group(1)) if num_match else 2

        # Try to extract time, otherwise use default
        time_match = re.search(r'(\d{1,2}):?(\d{2})?\s*(am|pm|AM|PM)', prompt)
        booking_time = time_match.group(0) if time_match else "7:00 PM"  # Default time

        # Standardize time format
        if ":" not in booking_time:
            booking_time = booking_time.replace(" ", ":00 ")

        # Capacity check
        MAX_CAPACITY = get_max_capacity()
        existing_bookings = get_bookings(booking_date)
        
        # Calculate total guests for the time slot
        time_bookings = [b for b in existing_bookings if b[2] == booking_time]
        time_guests = sum(b[3] for b in time_bookings) if time_bookings else 0
        
        if time_guests + number_of_people > MAX_CAPACITY:
            return f"Sorry, we are fully booked for {booking_date} at {booking_time} (Max capacity: {MAX_CAPACITY} guests). Please choose another date or time, or reduce the party size."

        # Create the booking
        add_booking(
            date=booking_date,
            time=booking_time,
            guests=number_of_people,
            name="Chat Reservation", 
            email="",
            phone="",
            special_requests="Booked via chatbot"
        )

        confirmation = f"Reservation confirmed for {number_of_people} people on {booking_date} at {booking_time}."
        
        # Generate a more personalized response using the AI
        try:
            reservation_agent = create_reservation_agent()
            task = create_reservation_task(reservation_agent, prompt)
            crew = Crew(agents=[reservation_agent], tasks=[task], process=Process.sequential, verbose=True)
            
            # Get the response from crewAI
            result = crew.kickoff(inputs={"question": prompt})
            
            # Process the result to ensure it's a string
            if isinstance(result, str):
                ai_response = result
            elif hasattr(result, 'output'):
                ai_response = result.output
            else:
                ai_response = str(result)
                
            # Convert the response to HTML
            confirmation_html = f"<p><strong>{confirmation}</strong></p>"
            response_html = convert_to_html(ai_response)
            
            return f"{confirmation_html}\n\n{response_html}"
        except Exception as ai_error:
            print(f"AI processing error: {str(ai_error)}")
            # Fallback to just the confirmation if AI fails
            return f"<p>{confirmation}</p>"
    except Exception as e:
        print(f"Error in process_reservation_request: {str(e)}")
        return "<p>I'm having trouble processing your reservation request right now. Please try again later.</p>"

def process_inquiry(inquiry):
    """Process a user inquiry with context from knowledge base and additional safety checks"""
    global vector_store
    
    if not vector_store:
        return "<p>Our restaurant information system is being updated. Please try again in a few minutes.</p>"
    
    # First check if the topic is restaurant-related
    is_relevant, confidence = is_restaurant_topic(inquiry)
    print(f"Topic classification: relevant={is_relevant}, confidence={confidence}")
    
    if not is_relevant:
        # Topic doesn't appear to be restaurant-related
        print(f"Rejecting query as non-restaurant topic: '{inquiry}'")
        return convert_to_html(get_safe_response())
    
    # Debug log - we're proceeding with a restaurant topic
    print(f"Processing restaurant query: '{inquiry}'")
    
    # Continue with retrieving relevant context
    retrieved_docs = vector_store.similarity_search(inquiry, k=3)
    context = "\n\n".join([doc.page_content for doc in retrieved_docs])
    
    # Create agent with strong system instructions
    agent = create_inquiry_agent()
    
    # Create task with explicit instruction enforcement
    task = create_inquiry_task(agent, inquiry, context)
    
    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=True,
        process=Process.sequential
    )
    
    try:
        # Explicitly pass the inquiry to ensure it's processed correctly
        result = crew.kickoff(inputs={"question": inquiry})
        
        # Process the result to ensure it's a string
        if isinstance(result, str):
            response_text = result
        elif hasattr(result, 'output'):
            response_text = result.output
        else:
            response_text = str(result)
        
        # Safety check on output before returning - if response looks too generic or like a refusal,
        # it might indicate the LLM is struggling with the task
        if "I'd be happy to assist" in response_text and len(response_text) < 100:
            print("Warning: LLM produced generic response, might be struggling with the task")
        
        # Convert to HTML before returning
        return convert_to_html(response_text)
    except Exception as e:
        print(f"Error in process_inquiry: {str(e)}")
        return "<p>I'll get that information for you right away. Please try again in a moment.</p>"

# Document processing functions
def load_documents(pdf_path):
    """Load and process PDF documents"""
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = text_splitter.split_documents(documents)
    return chunks

# Initialize vector store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vector_store = None

def set_vector_store(vs):
    global vector_store
    vector_store = vs

def initialize_knowledge_base(pdf_paths):
    """Initialize the vector store with documents"""
    global vector_store
    all_chunks = []
    for path in pdf_paths:
        all_chunks.extend(load_documents(path))
    
    vector_store = FAISS.from_documents(all_chunks, embeddings)
    return vector_store, "Knowledge base initialized successfully"