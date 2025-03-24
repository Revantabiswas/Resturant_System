"use client";

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || 
          e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'scale-150' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        width: isHovering ? '40px' : '20px',
        height: isHovering ? '40px' : '20px',
      }}
    />
  );
}
