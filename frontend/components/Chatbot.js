"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X, Trash2 } from "lucide-react"
import DOMPurify from "dompurify"

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

  // Function to sanitize HTML content from the backend
  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'table', 'tr', 'td', 'th', 'tbody', 'thead', 'br', 'hr'],
      ALLOWED_ATTR: ['href', 'target', 'rel']
    });
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
      // Sanitize HTML content from backend before adding to messages
      setMessages((prev) => [...prev, { 
        role: "bot", 
        content: data.response,
        isHtml: true
      }])
      
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

  // Function to render message content based on whether it's HTML or plain text
  const renderMessageContent = (message) => {
    if (message.isHtml) {
      return (
        <div 
          className="chat-message-html"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(message.content) }}
        />
      );
    }
    return <div>{message.content}</div>;
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-royal-blue text-white p-4 rounded-full shadow-2xl hover:bg-dark-blue transition-all duration-300 hover:scale-105 z-50 flex items-center justify-center"
        style={{
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
          background: "linear-gradient(135deg, #4169e1 0%, #1e40af 100%)",
        }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            transform: "translateY(0)",
            opacity: 1,
            animation: "slideUp 0.3s ease-out"
          }}
        >
          <div 
            className="p-4 flex justify-between items-center"
            style={{
              background: "linear-gradient(135deg, #4169e1 0%, #1e40af 100%)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <div>
              <h3 className="font-playfair font-bold text-white text-lg">Royal Udaipur Chat</h3>
              <p className="text-sm text-gray-200 opacity-80">Ask us anything</p>
            </div>
            <button
              onClick={clearChat} 
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
              title="Clear chat"
            >
              <Trash2 size={20} className="text-white" />
            </button>
          </div>

          <div className="flex-grow p-5 h-96 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-5 ${msg.role === "user" ? "text-right" : ""}`}>
                <div
                  className={`inline-block p-4 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-royal-blue to-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
                  } ${msg.isHtml ? "chat-html-container" : ""}`}
                  style={{
                    maxWidth: "85%",
                    boxShadow: msg.role === "user" 
                      ? "0 4px 15px -3px rgba(59, 130, 246, 0.3)" 
                      : "0 4px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 flex bg-white">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-grow px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-royal-blue focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-royal-blue text-white px-5 py-3 rounded-r-full hover:bg-dark-blue transition-colors duration-300"
              style={{
                background: "linear-gradient(135deg, #4169e1 0%, #1e40af 100%)",
              }}
              disabled={isLoading}
            >
              {isLoading ? "..." : <Send size={20} />}
            </button>
          </form>

          <style jsx global>{`
            @keyframes slideUp {
              from {
                transform: translateY(20px);
                opacity: 0;
              }
              to {
                transform: translateY(0);
                opacity: 1;
              }
            }
            
            .chat-html-container {
              max-width: 100%;
              word-break: break-word;
              overflow-wrap: anywhere;
              text-align: left;
            }
            .chat-message-html {
              font-family: inherit;
              line-height: 1.6;
            }
            .chat-message-html h1, 
            .chat-message-html h2, 
            .chat-message-html h3, 
            .chat-message-html h4 {
              margin-top: 0.6rem;
              margin-bottom: 0.6rem;
              font-weight: bold;
              color: inherit;
            }
            .chat-message-html p {
              margin-bottom: 0.85rem;
            }
            .chat-message-html ul, 
            .chat-message-html ol {
              margin-top: 0.6rem;
              margin-bottom: 0.6rem;
              padding-left: 1.8rem;
            }
            .chat-message-html ul {
              list-style-type: disc;
            }
            .chat-message-html ol {
              list-style-type: decimal;
            }
            .chat-message-html li {
              margin-bottom: 0.35rem;
            }
            .chat-message-html table {
              border-collapse: collapse;
              width: 100%;
              margin-top: 0.6rem;
              margin-bottom: 0.6rem;
              border-radius: 8px;
              overflow: hidden;
            }
            .chat-message-html th, 
            .chat-message-html td {
              border: 1px solid #e2e8f0;
              padding: 0.6rem;
              text-align: left;
            }
            .chat-message-html th {
              background-color: rgba(0, 0, 0, 0.05);
              font-weight: bold;
            }
            .chat-message-html a {
              color: #3182ce;
              text-decoration: underline;
              transition: color 0.2s;
            }
            .chat-message-html a:hover {
              color: #2c5282;
            }
            .chat-message-html hr {
              margin-top: 0.8rem;
              margin-bottom: 0.8rem;
              border: 0;
              border-top: 1px solid #e2e8f0;
            }
          `}</style>
        </div>
      )}
    </>
  )
}

