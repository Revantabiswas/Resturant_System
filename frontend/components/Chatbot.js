"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X, Trash2 } from "lucide-react"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  // Reset chat messages when component mounts
  useEffect(() => {
    setMessages([
      { role: "bot", content: "Hello! Welcome to Royal Udaipur. How can I assist you today?" },
    ])
    // Clear session ID on component mount
    setSessionId(null)
  }, [])

  // Function to clear chat history
  const clearChat = () => {
    setMessages([
      { role: "bot", content: "Hello! Welcome to Royal Udaipur. How can I assist you today?" },
    ])
    // Generate a new session
    setSessionId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionId && { "session-id": sessionId }),
        },
        body: JSON.stringify({
          message: input,
          session_id: sessionId
        }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "bot", content: data.response }])
      
      // Save the session ID for future requests
      if (data.session_id) {
        setSessionId(data.session_id)
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, something went wrong. Please try again later." },
      ])
    } finally {
      setIsLoading(false)
      setInput("")
    }
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
          <div className="bg-royal-blue text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-playfair font-semibold">Royal Udaipur Chat</h3>
              <p className="text-sm text-gray-200">Ask us anything</p>
            </div>
            <button
              onClick={clearChat} 
              className="p-1 rounded hover:bg-blue-700 transition-colors"
              title="Clear chat"
            >
              <Trash2 size={20} />
            </button>
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
              disabled={isLoading}
            >
              {isLoading ? "..." : <Send size={20} />}
            </button>
          </form>
        </div>
      )}
    </>
  )
}

