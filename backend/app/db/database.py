import sqlite3
from datetime import datetime
import os
from typing import List, Tuple, Optional, Dict, Any

DB_FILE = "restaurant.db"
MAX_CAPACITY = 50  # Maximum restaurant capacity

def init_db():
    """Initialize the SQLite database with tables"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Create reservations table with time slots
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        time TEXT,
        guests INTEGER,
        name TEXT,
        email TEXT,
        phone TEXT,
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    conn.commit()
    conn.close()

def add_booking(date: str, time: str, guests: int, name: str = '', 
                email: str = '', phone: str = '', special_requests: str = '') -> int:
    """Add a new booking to the database"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    cursor.execute(
        'INSERT INTO reservations (date, time, guests, name, email, phone, special_requests) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (date, time, guests, name, email, phone, special_requests)
    )
    
    booking_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return booking_id

def get_bookings(date: Optional[str] = None, time: Optional[str] = None) -> List[Dict[str, Any]]:
    """Get all bookings or filter by date and time"""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    cursor = conn.cursor()
    
    query = 'SELECT * FROM reservations'
    params = []
    
    if date and time:
        query += ' WHERE date = ? AND time = ?'
        params = [date, time]
    elif date:
        query += ' WHERE date = ?'
        params = [date]
    
    cursor.execute(query, params)
    bookings = [dict(row) for row in cursor.fetchall()]  # Convert to list of dictionaries
    conn.close()
    
    return bookings

def check_availability(date: str, time: str, party_size: int) -> Tuple[bool, int]:
    """Check if a reservation can be made for given date, time and party size"""
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Get total guests for that time slot
    cursor.execute('SELECT SUM(guests) FROM reservations WHERE date = ? AND time = ?', (date, time))
    result = cursor.fetchone()
    current_guests = result[0] if result[0] else 0
    
    conn.close()
    
    # Check if adding party_size would exceed capacity
    seats_left = MAX_CAPACITY - current_guests
    return (seats_left >= party_size, seats_left)

def get_max_capacity() -> int:
    """Return the maximum restaurant capacity"""
    return MAX_CAPACITY