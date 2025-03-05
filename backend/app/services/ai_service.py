import os
import re
from datetime import datetime, timedelta
from langchain_groq import ChatGroq
from crewai import Agent, Task, Crew, Process
from app.utils.config import load_environment
from app.db.database import add_booking, check_availability, get_bookings
from app.utils.config import get_max_capacity
from dotenv import load_dotenv
from langchain.document_loaders import PyPDFLoader
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

llm = ChatGroq(model="groq/llama3-8b-8192", api_key=groq_api_key)

def create_reservation_agent():
    """Create an agent for handling reservations"""
    return Agent(
        role="Restaurant Reservation Agent",
        goal="Help customers make restaurant reservations and confirm details",
        backstory="You are an expert in restaurant operations with years of experience. You help customers make reservations and provide them with confirmation details.",
        verbose=True,
        llm=llm
    )

def create_inquiry_agent():
    """Create an agent for handling general inquiries"""
    return Agent(
        role="Restaurant Information Specialist",
        goal="Provide detailed information about the restaurant, menu, and policies",
        backstory="You have deep knowledge about the restaurant's cuisine, services, and policies. You help customers with any questions they might have.",
        verbose=True,
        llm=llm
    )

def create_reservation_task(agent, question):
    """Create a task for reservation processing"""
    return Task(
        description=f"Process this reservation inquiry and respond professionally: {question}",
        agent=agent,
        expected_output="A friendly, professional response confirming reservation details or explaining why the reservation couldn't be made."
    )

def create_inquiry_task(agent, question):
    """Create a task for general inquiry processing"""
    return Task(
        description=f"Answer this customer inquiry professionally and accurately: {question}",
        agent=agent,
        expected_output="A friendly, informative response that addresses the customer's question completely."
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
                
            return f"{confirmation}\n\n{ai_response}"
        except Exception as ai_error:
            print(f"AI processing error: {str(ai_error)}")
            # Fallback to just the confirmation if AI fails
            return confirmation
    except Exception as e:
        print(f"Error in process_reservation_request: {str(e)}")
        return "I'm having trouble processing your reservation request right now. Please try again later."

def process_inquiry(inquiry):
    """Process a user inquiry with context from knowledge base"""
    global vector_store
    
    if not vector_store:
        return "I'm sorry, my knowledge base hasn't been initialized yet."
    
    # Retrieve relevant context
    retrieved_docs = vector_store.similarity_search(inquiry, k=3)
    context = "\n\n".join([doc.page_content for doc in retrieved_docs])
    
    # Create context-aware task
    agent = create_inquiry_agent()
    task = Task(
        description=f"""Process this inquiry using the following context:
        
        CONTEXT:
        {context}
        
        INQUIRY:
        {inquiry}""",
        agent=agent,
        expected_output="A helpful response based on the provided context."
    )
    
    crew = Crew(
        agents=[agent],
        tasks=[task],
        verbose=True,
        process=Process.sequential
    )
    
    try:
        result = crew.kickoff()
        # Process the result to ensure it's a string
        if isinstance(result, str):
            return result
        elif hasattr(result, 'output'):
            return result.output
        else:
            return str(result)
    except Exception as e:
        print(f"Error in process_inquiry: {str(e)}")
        return "I'm having trouble processing your inquiry right now. Please try again later."

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