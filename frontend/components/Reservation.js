"use client"

import { useState } from "react"
import { Calendar, Clock, Users } from "lucide-react"

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: 2,
    specialRequests: "",
  })

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend
    console.log("Reservation data:", formData)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        specialRequests: "",
      })
    }, 3000)
  }

  return (
    <section className="py-20 bg-royal-blue text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-8 text-center">Reserve Your Table</h2>
        <p className="text-xl md:text-2xl font-playfair mb-12 text-center text-gold">Experience the Royal Treatment</p>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 bg-dark-blue">
              <h3 className="text-2xl font-playfair font-semibold mb-6">Reservation Details</h3>

              <div className="space-y-6">
                <div className="flex items-start">
                  <Calendar className="mr-4 text-gold" />
                  <div>
                    <h4 className="font-semibold">Opening Hours</h4>
                    <p className="text-sm text-gray-300">Monday - Thursday: 5:00 PM - 10:00 PM</p>
                    <p className="text-sm text-gray-300">Friday - Saturday: 5:00 PM - 11:00 PM</p>
                    <p className="text-sm text-gray-300">Sunday: 4:00 PM - 9:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="mr-4 text-gold" />
                  <div>
                    <h4 className="font-semibold">Reservation Policy</h4>
                    <p className="text-sm text-gray-300">We hold reservations for 15 minutes past the reserved time.</p>
                    <p className="text-sm text-gray-300">For parties of 6 or more, please call us directly.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Users className="mr-4 text-gold" />
                  <div>
                    <h4 className="font-semibold">Large Parties</h4>
                    <p className="text-sm text-gray-300">For private events or large parties, please contact us at:</p>
                    <p className="text-sm text-gray-300">events@royaludaipur.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-green-500 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-2xl font-playfair font-semibold text-gray-800 mb-2">Reservation Confirmed!</h3>
                  <p className="text-gray-600">Thank you for choosing Royal Udaipur. We look forward to serving you.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="date" className="block text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-gray-700 mb-1">
                        Time
                      </label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select Time</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="5:30 PM">5:30 PM</option>
                        <option value="6:00 PM">6:00 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                        <option value="7:00 PM">7:00 PM</option>
                        <option value="7:30 PM">7:30 PM</option>
                        <option value="8:00 PM">8:00 PM</option>
                        <option value="8:30 PM">8:30 PM</option>
                        <option value="9:00 PM">9:00 PM</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="guests" className="block text-gray-700 mb-1">
                        Guests
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        required
                        className="input-field"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1} {i === 0 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className="block text-gray-700 mb-1">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      rows="3"
                      className="input-field"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Reserve Now
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

