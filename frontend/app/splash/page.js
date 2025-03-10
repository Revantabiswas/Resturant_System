"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export default function SplashScreen() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Smoother loading progress with easing
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
          }, 800); // Longer delay for smoother transition
          return 100;
        }
        
        // Use non-linear progression for more natural loading feel
        const increment = 5 * Math.pow((100 - prev) / 100, 0.7);
        return Math.min(prev + increment, 100);
      });
    }, 180); // Slightly longer interval for smoother progression

    // After loading completes, show exit animation and redirect with longer duration
    const timer = setTimeout(() => {
      setExitAnimation(true);
      setTimeout(() => {
        router.push("/");
      }, 1600); // Longer transition to main page
    }, 5200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    // Remove any outer wrapper divs that might be inheriting layout styles
    <div className={`${montserrat.variable} ${playfair.variable} font-sans fixed inset-0 z-50 bg-dark-blue overflow-hidden`}>
      <div
        className={`w-full h-full flex flex-col items-center justify-center 
                   ${exitAnimation ? "splash-exit" : "splash-appear"}`}
        style={{
          transition: "opacity 1.4s ease-in-out, transform 1.6s cubic-bezier(0.22, 1, 0.36, 1)",
          opacity: exitAnimation ? 0 : 1,
          transform: exitAnimation ? "scale(1.08)" : "scale(1)"
        }}
      >
        <div className="w-64 h-64 md:w-80 md:h-80 relative mb-8">
          {/* Enhanced mandala pattern animation */}
          <div 
            className="absolute inset-0" 
            style={{
              animation: "mandala-spin 24s infinite linear, mandala-pulse 12s infinite ease-in-out",
            }}
          >
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full text-gold"
              fill="currentColor"
            >
              <path d="M100 0 L100 200 M0 100 L200 100 M29.3 29.3 L170.7 170.7 M29.3 170.7 L170.7 29.3" 
                    stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1" />
              {/* Decorative elements with enhanced animation */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <g 
                  key={i} 
                  transform={`rotate(${angle} 100 100)`}
                  style={{ 
                    animation: `element-pulse 3s infinite ease-in-out ${i * 0.25}s` 
                  }}
                >
                  <path d="M100 20 L105 5 L100 0 L95 5 z" />
                  <path d="M100 180 L105 195 L100 200 L95 195 z" />
                </g>
              ))}
            </svg>
          </div>
          
          {/* Improved diya animation with glowing effect */}
          <div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: "diya-float 4s infinite ease-in-out",
            }}
          >
            <div className="w-20 h-20 relative">
              <div 
                className="w-16 h-8 rounded-b-full bg-deep-red absolute bottom-0 left-1/2 transform -translate-x-1/2"
                style={{ 
                  boxShadow: "0 0 10px 2px rgba(220, 38, 38, 0.5)" 
                }}
              ></div>
              <div 
                className="w-8 h-8 rounded-full bg-gold absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                style={{ 
                  boxShadow: "0 0 15px 5px rgba(234, 179, 8, 0.5)" 
                }}
              >
                <div className="w-2 h-6 bg-deep-red rounded-full"></div>
                <div 
                  className="w-1 h-3 bg-yellow-300 rounded-full absolute top-0"
                  style={{ 
                    animation: "flame-flicker 2s infinite ease-in-out",
                    boxShadow: "0 0 8px 4px rgba(234, 179, 8, 0.7)"
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant name with smoother fade-in */}
        <h1 
          className="text-4xl md:text-6xl font-playfair font-bold text-gold mb-3"
          style={{ 
            animation: "fade-in-up 1.2s ease-out 0.5s both",
            textShadow: "0 0 10px rgba(234, 179, 8, 0.3)"
          }}
        >
          Royal Udaipur
        </h1>
        <p 
          className="text-xl md:text-2xl font-playfair text-cream mb-10"
          style={{ animation: "fade-in-up 1.2s ease-out 0.8s both" }}
        >
          Authentic Indian Cuisine
        </p>

        {/* Enhanced loading bar with smoother animation */}
        <div className="w-64 md:w-80 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gold"
            style={{ 
              width: `${loadingProgress}%`,
              transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              boxShadow: "0 0 10px rgba(234, 179, 8, 0.5)"
            }}
          ></div>
        </div>
        <p 
          className="text-cream mt-4"
          style={{ animation: "fade-in-up 1s ease-out 1s both" }}
        >
          {isLoading ? "Preparing your experience..." : "Ready to serve you!"}
        </p>
      </div>

      {/* Add global style for animations */}
      <style jsx global>{`
        @keyframes mandala-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes mandala-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes diya-float {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, -54%); }
        }
        
        @keyframes flame-flicker {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          25% { transform: scale(1.1, 1.2); opacity: 1; }
          50% { transform: scale(0.9, 1.1) translateX(1px); opacity: 0.8; }
          75% { transform: scale(1.05) translateX(-1px); opacity: 0.9; }
        }
        
        @keyframes element-pulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        .splash-appear {
          animation: splash-appear 1.2s ease-out forwards;
        }
        
        @keyframes splash-appear {
          from { 
            opacity: 0; 
            transform: scale(1.1);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
