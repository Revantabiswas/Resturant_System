"use client";

import { Montserrat, Playfair_Display } from "next/font/google"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Reservation from "@/components/Reservation"
import Contact from "@/components/Contact"
import Chatbot from "@/components/Chatbot"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import dynamic from "next/dynamic"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

function AnimatedSection({ children, id }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div 
      id={id}
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="scroll-mt-20"
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  return (
    <main className={`${montserrat.variable} ${playfair.variable} font-sans`}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
      </motion.div>

      <AnimatedSection id="about">
        <About />
      </AnimatedSection>

      <AnimatedSection id="reservation">
        <Reservation />
      </AnimatedSection>

      <AnimatedSection id="contact">
        <Contact />
      </AnimatedSection>

      <Chatbot />
    </main>
  )
}

