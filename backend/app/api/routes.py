from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
from app.db.database import add_booking, get_bookings, check_availability
from app.services.ai_service import process_inquiry, process_reservation_request
from app.utils.config import get_max_capacity, initialize_knowledge_base

router = APIRouter()

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
        
        # Convert to list of dictionaries
        bookings_list = []
        for booking in bookings:
            bookings_list.append({
                "id": booking[0],
                "date": booking[1],
                "time": booking[2],
                "guests": booking[3],
                "name": booking[4],
                "email": booking[5],
                "phone": booking[6],
                "special_requests": booking[7],
                "created_at": booking[8]
            })
        
        return bookings_list
    
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
        # Check if it's a reservation request
        if "reservation" in request.message.lower() or "book" in request.message.lower() or "table" in request.message.lower():
            result = process_reservation_request(request.message)
        else:
            result = process_inquiry(request.message)
        
        return ChatResponse(response=result)
    
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