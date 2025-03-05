import os
import time
from dotenv import load_dotenv
from app.services.ai_service import process_inquiry, process_reservation_request

# Load environment variables
load_dotenv()

def test_ai_service():
    print("Testing AI Service...")
    
    # Check if GROQ API key is set
    groq_api_key = os.getenv('GROQ_API_KEY')
    print(f"GROQ API key is {'set' if groq_api_key else 'NOT SET'}")
    
    # Test general inquiry
    print("\n=== Testing general inquiry ===")
    inquiry = "What kind of cuisine do you serve?"
    print(f"Sending inquiry: {inquiry}")
    
    start_time = time.time()
    try:
        response = process_inquiry(inquiry)
        print(f"Response received in {time.time() - start_time:.2f} seconds")
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
    
    # Test reservation request
    print("\n=== Testing reservation request ===")
    reservation = "I'd like to book a table for 4 people tomorrow at 7 PM"
    print(f"Sending reservation request: {reservation}")
    
    start_time = time.time()
    try:
        response = process_reservation_request(reservation)
        print(f"Response received in {time.time() - start_time:.2f} seconds")
        print(f"Response: {response}")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_ai_service()
