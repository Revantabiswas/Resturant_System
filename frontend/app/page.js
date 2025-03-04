import { Montserrat, Playfair_Display } from "next/font/google"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Reservation from "@/components/Reservation"
import Contact from "@/components/Contact"
import Chatbot from "@/components/Chatbot"

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

export default function Home() {
  return (
    <main className={`${montserrat.variable} ${playfair.variable} font-sans`}>
      <Hero />

      <div id="about" className="scroll-mt-20">
        <About />
      </div>

      <div id="reservation" className="scroll-mt-20">
        <Reservation />
      </div>

      <div id="contact" className="scroll-mt-20">
        <Contact />
      </div>

      <Chatbot />
    </main>
  )
}

