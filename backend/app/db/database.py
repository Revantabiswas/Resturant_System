import sqlite3
from datetime import datetime
import os
from typing import List, Tuple, Optional

DB_PATH = "restaurant.db"

def init_db():
    """Initialize the database with required tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        guests INTEGER,
        name TEXT,
        email TEXT,
        phone TEXT,
        special_requests TEXT,
        created_at TEXT
    )
    ''')
    
    conn.commit()
    conn.close()

def add_booking(date: str, time: str, guests: int, name: str, email: str, 
                phone: str = "", special_requests: str = "") -> int:
    """Add a new booking to the database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    created_at = datetime.now().isoformat()
    
    cursor.execute('''
    INSERT INTO bookings (date, time, guests, name, email, phone, special_requests, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (date, time, guests, name, email, phone, special_requests, created_at))
    
    booking_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return booking_id

def get_bookings(date: Optional[str] = None) -> List[Tuple]:
    """Get all bookings or bookings for a specific date"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    if date:
        cursor.execute('SELECT * FROM bookings WHERE date = ?', (date,))
    else:
        cursor.execute('SELECT * FROM bookings')
    
    bookings = cursor.fetchall()
    conn.close()
    
    return bookings

def check_availability(date: str, time: str, guests: int) -> Tuple[bool, int]:
    """Check if there is availability for the specified date, time and number of guests"""
    from app.utils.config import get_max_capacity
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get bookings for the specified time and date
    cursor.execute('SELECT SUM(guests) FROM bookings WHERE date = ? AND time = ?', (date, time))
    result = cursor.fetchone()
    current_guests = result[0] if result[0] else 0
    
    max_capacity = get_max_capacity()
    seats_left = max_capacity - current_guests
    
    conn.close()
    
    # Check if there are enough seats
    return seats_left >= guests, seats_left