"use client";

import { useState } from "react";
import { Calendar, Users, Clock, Utensils, Heart, Music, Gift } from "lucide-react";
// import api from "@/api";

export default function MassReservation() {
  const [formData, setFormData] = useState({
    organizerName: "",
    organizerEmail: "",
    organizerPhone: "",
    eventType: "dinner",
    guestCount: 10,
    preferredDates: [],
    timeSlot: "evening",
    dietaryRequirements: "",
    specialRequests: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const eventTypes = [
    { id: "dinner", name: "Group Dinner", icon: <Utensils className="w-5 h-5" /> },
    { id: "birthday", name: "Birthday Celebration", icon: <Gift className="w-5 h-5" /> },
    { id: "wedding", name: "Wedding Reception", icon: <Heart className="w-5 h-5" /> },
    { id: "corporate", name: "Corporate Event", icon: <Users className="w-5 h-5" /> },
    { id: "cultural", name: "Cultural Celebration", icon: <Music className="w-5 h-5" /> },
  ];

  const timeSlots = [
    { id: "morning", label: "Morning (9:00 AM - 11:30 AM)" },
    { id: "afternoon", label: "Afternoon (12:00 PM - 4:30 PM)" },
    { id: "evening", label: "Evening (5:00 PM - 9:30 PM)" },
    { id: "night", label: "Late Night (10:00 PM - 12:00 AM)" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    
    if (selectedDates.includes(formattedDate)) {
      setSelectedDates(selectedDates.filter(d => d !== formattedDate));
    } else {
      setSelectedDates([...selectedDates, formattedDate]);
    }

    setFormData((prev) => ({
      ...prev,
      preferredDates: [...selectedDates, formattedDate],
    }));
  };

  const handleGuestCountChange = (change) => {
    const newCount = Math.max(10, formData.guestCount + change);
    setFormData((prev) => ({
      ...prev,
      guestCount: newCount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This would connect to your actual API
      // await api.createGroupReservation(formData);
      
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      setIsLoading(false);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          organizerName: "",
          organizerEmail: "",
          organizerPhone: "",
          eventType: "dinner",
          guestCount: 10,
          preferredDates: [],
          timeSlot: "evening",
          dietaryRequirements: "",
          specialRequests: "",
        });
        setSelectedDates([]);
      }, 5000);
    } catch (error) {
      console.error("Group reservation failed:", error);
      alert("There was a problem with your group reservation. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-4xl font-playfair font-bold mb-4 text-center text-royal-blue">Group & Event Reservations</h2>
        <p className="text-xl font-playfair mb-12 text-center text-gray-600">Plan your special occasions with us</p>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          {isSubmitted ? (
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-royal-blue mb-4">Reservation Request Received!</h3>
              <p className="text-gray-700 mb-6">
                Thank you for your group reservation request. Our team will review your preferred dates and contact you within 24 hours to confirm availability and details.
              </p>
              <div className="animate-pulse">
                <p className="text-sm text-gray-500">This message will close automatically</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Organizer Information */}
                <div>
                  <h3 className="text-xl font-playfair font-bold text-royal-blue mb-4 flex items-center">
                    <Users className="mr-2" /> Organizer Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="organizerName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="organizerName"
                        name="organizerName"
                        value={formData.organizerName}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-royal-blue text-gray-700"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="organizerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="organizerEmail"
                        name="organizerEmail"
                        value={formData.organizerEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-royal-blue text-gray-700"
                        placeholder="email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="organizerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="organizerPhone"
                        name="organizerPhone"
                        value={formData.organizerPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-royal-blue text-gray-700"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div>
                  <h3 className="text-xl font-playfair font-bold text-royal-blue mb-4 flex items-center">
                    <Calendar className="mr-2" /> Event Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Event Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {eventTypes.map((type) => (
                          <label 
                            key={type.id}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all
                              ${formData.eventType === type.id 
                                ? 'border-royal-blue bg-blue-50 ring-2 ring-royal-blue ring-opacity-30' 
                                : 'border-gray-200 hover:bg-gray-50'}`}
                          >
                            <input
                              type="radio"
                              name="eventType"
                              value={type.id}
                              checked={formData.eventType === type.id}
                              onChange={handleChange}
                              className="sr-only"
                            />
                            <span className="text-royal-blue mr-2">
                              {type.icon}
                            </span>
                            <span className="text-sm font-medium">{type.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Guests
                      </label>
                      <div className="flex items-center">
                        <button 
                          type="button"
                          onClick={() => handleGuestCountChange(-5)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-l"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          name="guestCount"
                          value={formData.guestCount}
                          onChange={handleChange}
                          min="10"
                          className="input-field rounded-none text-center w-20"
                          readOnly
                        />
                        <button 
                          type="button"
                          onClick={() => handleGuestCountChange(5)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-r"
                        >
                          +
                        </button>
                        <span className="ml-3 text-gray-500 text-sm">Minimum 10 guests</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleChange}
                        className="input-field"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="mt-8">
                <h3 className="text-xl font-playfair font-bold text-royal-blue mb-4 flex items-center">
                  <Calendar className="mr-2" /> Preferred Dates
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Select multiple dates if you have flexibility. Our team will check availability and confirm the best option.
                </p>
                
                <div className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedDates.map(date => (
                      <div key={date} className="bg-royal-blue text-white px-3 py-1 rounded-full text-sm flex items-center">
                        {new Date(date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                        <button 
                          type="button"
                          onClick={() => handleDateSelect(new Date(date))}
                          className="ml-2 focus:outline-none"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {selectedDates.length === 0 && (
                      <div className="text-gray-500 text-sm italic">No dates selected</div>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    className="btn-secondary w-full flex items-center justify-center"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                  >
                    <Calendar className="mr-2" size={18} />
                    {calendarOpen ? 'Hide Calendar' : 'Select Dates'}
                  </button>
                  
                  {calendarOpen && (
                    <div className="mt-4 p-3 border rounded-lg bg-white">
                      {/* Simplified calendar UI - in a real app, use a proper calendar component */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-xs font-medium text-gray-500 py-1">{day}</div>
                        ))}
                        {[...Array(31)].map((_, i) => {
                          const day = i + 1;
                          // This is a simplified date selection - use a proper calendar in production
                          const today = new Date();
                          const date = new Date(today.getFullYear(), today.getMonth(), day);
                          const dateStr = date.toISOString().split('T')[0];
                          const isSelected = selectedDates.includes(dateStr);
                          const isPast = date < today && date.getDate() !== today.getDate();
                          
                          if (date.getMonth() !== today.getMonth()) return null;
                          
                          return (
                            <button
                              key={day}
                              type="button"
                              disabled={isPast}
                              onClick={() => handleDateSelect(date)}
                              className={`py-2 rounded-full text-sm ${
                                isPast ? 'text-gray-300 cursor-not-allowed' :
                                isSelected ? 'bg-royal-blue text-white' : 'hover:bg-gray-100'
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Requirements */}
              <div className="mt-8">
                <h3 className="text-xl font-playfair font-bold text-royal-blue mb-4 flex items-center">
                  <Utensils className="mr-2" /> Additional Requirements
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="dietaryRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                      Dietary Requirements
                    </label>
                    <textarea
                      id="dietaryRequirements"
                      name="dietaryRequirements"
                      value={formData.dietaryRequirements}
                      onChange={handleChange}
                      rows={3}
                      className="input-field"
                      placeholder="Please list any dietary restrictions or allergies"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows={3}
                      className="input-field"
                      placeholder="Any special arrangements or requests"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-royal-blue hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Submit Group Reservation</>
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  * Our team will contact you to confirm availability and finalize details within 24 hours.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}