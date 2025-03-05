from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.db.database import add_booking, get_bookings, check_availability
from app.services.ai_service import process_inquiry, process_reservation_request, initialize_knowledge_base, set_vector_store
from app.utils.config import get_max_capacity, initialize_knowledge_base

import os

router = APIRouter()

# During app startup
vector_store, message = initialize_knowledge_base()
if vector_store:
    set_vector_store(vector_store)
    print(message)
else:
    print(f"Failed to initialize knowledge base: {message}")

# Models for API request/response
class BookingRequest(BaseModel):
    date: str
    time: str
    guests: int
    name: str
    email: str
    phone: Optional[str] = ""
    special_requests: Optional[str] = ""

class BookingResponse(BaseModel):
    id: int
    date: str
    time: str
    guests: int
    name: str
    success: bool
    message: str

class AvailabilityRequest(BaseModel):
    date: str
    time: str
    guests: int

class AvailabilityResponse(BaseModel):
    available: bool
    seats_left: int

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

class MultiBookingRequest(BaseModel):
    dates: List[str]
    time: str
    guests: int
    name: str
    email: str
    contact_person: str
    event_type: str
    special_requirements: Optional[str] = ""

class MultiBookingResponse(BaseModel):
    successful_dates: List[str]
    failed_dates: List[str]

# Routes
@router.post("/bookings/", response_model=BookingResponse)
async def create_booking(booking: BookingRequest):
    """Create a new booking"""
    try:
        # Check availability
        is_available, seats_left = check_availability(booking.date, booking.time, booking.guests)
        
        if not is_available:
            return BookingResponse(
                id=-1,
                date=booking.date,
                time=booking.time,
                guests=booking.guests,
                name=booking.name,
                success=False,
                message=f"No availability. Only {seats_left} seats left."
            )
        
        # Add booking
        booking_id = add_booking(
            date=booking.date,
            time=booking.time,
            guests=booking.guests,
            name=booking.name,
            email=booking.email,
            phone=booking.phone,
            special_requests=booking.special_requests
        )
        
        return BookingResponse(
            id=booking_id,
            date=booking.date,
            time=booking.time,
            guests=booking.guests,
            name=booking.name,
            success=True,
            message="Booking successful!"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bookings/", response_model=List[dict])
async def get_all_bookings(date: Optional[str] = None):
    """Get all bookings or for a specific date"""
    try:
        bookings = get_bookings(date)
        return bookings  # Already converted to dictionaries in get_bookings
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/availability/", response_model=AvailabilityResponse)
async def check_table_availability(request: AvailabilityRequest):
    """Check if a table is available"""
    try:
        is_available, seats_left = check_availability(request.date, request.time, request.guests)
        return AvailabilityResponse(available=is_available, seats_left=seats_left)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Process a chat message"""
    try:
        print(f"Chat request received: {request.message}")
        
        # Check if it's a reservation request
        is_reservation = any(keyword in request.message.lower() for keyword in ["reservation", "book", "table"])
        
        if is_reservation:
            print("Processing as reservation request")
            result = process_reservation_request(request.message)
        else:
            print("Processing as general inquiry")
            result = process_inquiry(request.message)
        
        print(f"Generated response (first 100 chars): {result[:100] if result else 'None'}")
        return ChatResponse(response=result)
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat-simple/", response_model=ChatResponse)
async def chat_simple(request: ChatRequest):
    """A simple chat endpoint that doesn't use the AI for testing"""
    try:
        # Simple echo response for testing
        return ChatResponse(response=f"Echo: {request.message}\n\nThis is a test response from the server.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/initialize-knowledge-base/")
async def init_knowledge_base():
    """Initialize the knowledge base for AI"""
    try:
        initialize_knowledge_base()
        return {"status": "success", "message": "Knowledge base initialized successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/bookings/group/", response_model=MultiBookingResponse)
async def create_group_booking(request: MultiBookingRequest):
    """Create multiple bookings for group events"""
    successful_dates = []
    failed_dates = []
    
    try:
        for date in request.dates:
            # Check availability
            is_available, _ = check_availability(date, request.time, request.guests)
            
            if is_available:
                # Add booking
                add_booking(
                    date=date,
                    time=request.time,
                    guests=request.guests,
                    name=request.name,
                    email=request.email,
                    special_requests=f"Event Type: {request.event_type}. {request.special_requirements}"
                )
                successful_dates.append(date)
            else:
                failed_dates.append(date)
        
        return MultiBookingResponse(successful_dates=successful_dates, failed_dates=failed_dates)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    """Upload a PDF file to be included in the knowledge base"""
    file_location = f"app/data/pdf/{file.filename}"
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
    
    with open(file_location, "wb") as file_object:
        file_object.write(file.file.read())
    
    # Reinitialize knowledge base with all PDFs in directory
    pdf_files = [f"app/data/pdf/{f}" for f in os.listdir("app/data/pdf")]
    initialize_knowledge_base(pdf_files)
    
    return {"filename": file.filename, "status": "File uploaded successfully"}