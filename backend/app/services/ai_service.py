import os
import re
from datetime import datetime, timedelta
from langchain_groq import ChatGroq
from crewai import Agent, Task, Crew, Process
from app.utils.config import load_environment
from app.db.database import add_booking, check_availability, get_bookings
from app.utils.config import get_max_capacity
from dotenv import load_dotenv

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
    reservation_agent = create_reservation_agent()
    task = create_reservation_task(reservation_agent, prompt)
    crew = Crew(agents=[reservation_agent], tasks=[task], process=Process.sequential, verbose=True)
    
    ai_response = crew.kickoff(inputs={"question": prompt})
    return f"{confirmation}\n\n{ai_response}"

def process_inquiry(prompt):
    """Process a general inquiry using AI"""
    inquiry_agent = create_inquiry_agent()
    task = create_inquiry_task(inquiry_agent, prompt)
    crew = Crew(agents=[inquiry_agent], tasks=[task], process=Process.sequential, verbose=True)
    return crew.kickoff(inputs={"question": prompt})