"use client";

import { useState } from "react";
import { Calendar, Clock, Users, Search } from "lucide-react";

export default function AvailabilityChecker() {
  const [searchData, setSearchData] = useState({
    date: "",
    time: "",
    guests: 2,
  });
  
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  // Generate available and unavailable time slots for demo purposes
  const generateDemoResults = () => {
    const timeSlots = [
      "12:00", "12:30", "13:00", "13:30", "14:00", 
      "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"
    ];
    
    // Randomly mark some slots as unavailable
    return timeSlots.map(time => ({
      time,
      available: Math.random() > 0.3 // 70% chance of availability
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      const results = generateDemoResults();
      setSearchResults(results);
      setShowResults(true);
      setIsSearching(false);
    }, 1500);
  };

  const handleTimeSelection = (time) => {
    // This would normally update your reservation form or proceed to booking
    console.log(`Selected time: ${time}`);
    // Scroll to reservation form
    document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-12 px-4 bg-cream">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-playfair font-bold text-royal-blue mb-6">Check Table Availability</h2>
            
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-royal-blue" /> Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={searchData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-royal-blue text-gray-700"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-royal-blue" /> Preferred Time
                </label>
                <select
                  id="time"
                  name="time"
                  value={searchData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-royal-blue text-gray-700"
                >
                  <option value="">Select a time</option>
                  <option value="lunch">Lunch (12:00 PM - 2:30 PM)</option>
                  <option value="dinner">Dinner (6:00 PM - 10:00 PM)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <Users className="w-4 h-4 mr-1 text-royal-blue" /> Guests
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={searchData.guests}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-royal-blue text-gray-700"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </option>
                  ))}
                  <option value="9+">9+ Guests (Group Booking)</option>
                </select>
              </div>
              
              <div className="md:col-span-3">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full bg-royal-blue hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center shadow-md"
                >
                  {isSearching ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking availability...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Check Availability
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Search Results */}
            {showResults && searchResults && (
              <div className={`mt-8 ${isSearching ? 'opacity-50' : ''}`}>
                <h3 className="font-playfair font-bold text-xl text-royal-blue mb-4">
                  Available Times for {new Date(searchData.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {searchResults.map((slot, index) => (
                    <button
                      key={index}
                      disabled={!slot.available}
                      onClick={() => slot.available && handleTimeSelection(slot.time)}
                      className={`py-2 px-3 rounded-md text-center transition-all ${
                        slot.available 
                          ? 'bg-blue-50 border border-royal-blue text-royal-blue hover:bg-royal-blue hover:text-white' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                      {!slot.available && <span className="block text-xs font-medium">Booked</span>}
                    </button>
                  ))}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> Select a time above to proceed with your reservation. 
                    For parties larger than 8, please make a group reservation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}