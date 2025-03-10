"use client";

import { useState } from 'react';

export default function DebugComponent() {
  const [isOpen, setIsOpen] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-md text-xs"
      >
        {isOpen ? 'Hide Debug' : 'Debug Info'}
      </button>
      
      {isOpen && (
        <div className="bg-gray-800 text-white p-4 rounded-md mt-2 text-xs max-w-xs">
          <h4 className="font-bold mb-2">Debug Information</h4>
          <div>
            <p>Environment: {process.env.NODE_ENV}</p>
            <p>Components loaded:</p>
            <ul className="list-disc pl-4 mt-1">
              <li>AvailabilityChecker ✓</li>
              <li>Reservation ✓</li>
              <li>MassReservation ✓</li>
              <li>Chatbot ✓</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}