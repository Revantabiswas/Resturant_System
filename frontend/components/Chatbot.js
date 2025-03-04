"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X } from "lucide-react"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello! Welcome to Royal Udaipur. How can I assist you today?" },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "Thank you for your message. Our team will get back to you shortly."

      // Simple keyword-based responses
      const lowerInput = input.toLowerCase()
      if (lowerInput.includes("reservation") || lowerInput.includes("book") || lowerInput.includes("table")) {
        botResponse =
          "You can make a reservation by visiting our reservation section or calling us at (555) 123-4567. Would you like me to help you with anything else?"
      } else if (lowerInput.includes("menu") || lowerInput.includes("food") || lowerInput.includes("dish")) {
        botResponse =
          "Our menu features a variety of authentic Indian dishes. You can view our full menu on the Menu page. Do you have any specific dishes you're interested in?"
      } else if (lowerInput.includes("hour") || lowerInput.includes("open") || lowerInput.includes("time")) {
        botResponse =
          "We are open Monday-Thursday from 5:00 PM to 10:00 PM, Friday-Saturday from 5:00 PM to 11:00 PM, and Sunday from 4:00 PM to 9:00 PM."
      } else if (lowerInput.includes("location") || lowerInput.includes("address") || lowerInput.includes("where")) {
        botResponse =
          "We are located at 123 Main Street, New York, NY 10001. You can find directions on our Contact page."
      }

      setMessages((prev) => [...prev, { role: "bot", content: botResponse }])
    }, 1000)

    // Clear input
    setInput("")
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-royal-blue text-white p-4 rounded-full shadow-lg hover:bg-dark-blue transition-colors z-50"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col overflow-hidden">
          <div className="bg-royal-blue text-white p-4">
            <h3 className="font-playfair font-semibold">Royal Udaipur Chat</h3>
            <p className="text-sm text-gray-200">Ask us anything</p>
          </div>

          <div className="flex-grow p-4 h-80 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-royal-blue text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-royal-blue"
            />
            <button
              type="submit"
              className="bg-royal-blue text-white px-4 py-2 rounded-r-md hover:bg-dark-blue transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

