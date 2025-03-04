/**
 * API client for communicating with the backend
 */

// Base API URL from environment variable, with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} endpoint - API endpoint (e.g., '/chat/')
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - JSON response
 */
async function fetchAPI(endpoint, options = {}) {
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Merge options
  const config = {
    ...options,
    headers,
  };

  try {
    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, config);

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API error: ${response.status} ${response.statusText}`
      );
    }

    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * API client with methods for each endpoint
 */
export const api = {
  /**
   * Send a message to the chatbot
   * @param {string} message - User's message
   * @returns {Promise<Object>} - Response with bot reply
   */
  async sendChatMessage(message) {
    return fetchAPI('/chat/', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },

  /**
   * Create a new reservation
   * @param {Object} reservationData - Reservation details
   * @returns {Promise<Object>} - Response with reservation confirmation
   */
  async createReservation(reservationData) {
    return fetchAPI('/reservations/', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
  },

  /**
   * Get menu items
   * @param {string} category - Optional category filter
   * @returns {Promise<Array>} - Menu items
   */
  async getMenu(category = null) {
    const endpoint = category ? `/menu/?category=${category}` : '/menu/';
    return fetchAPI(endpoint, {
      method: 'GET',
    });
  },

  /**
   * Check backend health
   * @returns {Promise<Object>} - Health status
   */
  async checkHealth() {
    return fetchAPI('/health/', {
      method: 'GET',
    });
  }
};