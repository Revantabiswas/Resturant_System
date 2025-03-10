/**
 * Restaurant API Service
 * Handles all API calls to the backend server
 */

// Base API URL - would normally come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Create a new individual reservation
 */
const createReservation = async (reservationData) => {
  try {
    // For now, this simulates a successful API call
    console.log('Creating reservation with data:', reservationData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an actual API call:
    // const response = await fetch(`${API_BASE_URL}/reservations`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(reservationData),
    // });
    // const data = await response.json();
    // if (!response.ok) throw new Error(data.message || 'Failed to create reservation');
    // return data;
    
    return { success: true, id: 'res_' + Math.random().toString(36).substr(2, 9) };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Create a new group/mass reservation
 */
const createGroupReservation = async (reservationData) => {
  try {
    console.log('Creating group reservation with data:', reservationData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true, id: 'group_' + Math.random().toString(36).substr(2, 9) };
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Check availability for a specific date and time
 */
const checkAvailability = async (date, time, guests) => {
  try {
    console.log('Checking availability for:', { date, time, guests });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate random available slots for demo purposes
    const slots = [];
    const baseHour = time === 'lunch' ? 12 : 18;
    for (let i = 0; i < 6; i++) {
      const hour = baseHour + Math.floor(i/2);
      const minute = (i % 2) * 30;
      slots.push({
        time: `${hour}:${minute === 0 ? '00' : minute}`,
        available: Math.random() > 0.3
      });
    }
    
    return slots;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const api = {
  createReservation,
  createGroupReservation,
  checkAvailability
};

export default api;