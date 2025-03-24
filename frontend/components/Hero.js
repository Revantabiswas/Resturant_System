import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      } 
    }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="relative h-screen bg-hero-pattern bg-cover bg-center flex items-center justify-center text-white overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />
      
      {/* Parallax Background Elements */}
      <motion.div 
        className="absolute inset-0 bg-hero-pattern bg-cover bg-center"
        style={{ 
          translateX: mousePosition.x * -20,
          translateY: mousePosition.y * -20,
          scale: 1.1
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      
      <motion.div 
        className="container mx-auto px-4 z-10 text-center"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-playfair font-bold mb-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]"
          variants={textVariants}
          style={{ 
            translateX: mousePosition.x * 10,
            translateY: mousePosition.y * 10,
            rotateX: mousePosition.y * 5,
            rotateY: mousePosition.x * -5,
          }}
        >
          Royal Udaipur
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl font-light mb-8"
          variants={textVariants}
          style={{ 
            translateX: mousePosition.x * 5,
            translateY: mousePosition.y * 5,
          }}
        >
          Experience the authentic flavors of India
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          variants={textVariants}
        >
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="perspective-1000"
          >
            <Link href="/menu" className="btn-primary inline-block backdrop-blur-sm relative overflow-hidden group">
              <span className="relative z-10">View Our Menu</span>
              <span className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
          </motion.div>
          
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="perspective-1000"
          >
            <Link
              href="#reservation"
              className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-royal-blue inline-block backdrop-blur-sm relative overflow-hidden group"
            >
              <span className="relative z-10">Reserve a Table</span>
              <span className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Animated Decoration Elements */}
      <motion.div 
        className="absolute -bottom-16 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent"
        animate={{ 
          y: [10, 0, 10],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {/* Floating particles effect */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: Math.random() * 0.5 + 0.3,
            scale: Math.random() * 0.6 + 0.5
          }}
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3 + i * 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.2
          }}
          style={{ left: `${10 + i * 12}%` }}
        />
      ))}
    </div>
  )
}

