import MassReservation from "@/components/MassReservation"
import AvailabilityChecker from "@/components/AvailabilityChecker"
import Reservation from "@/components/Reservation"
import Chatbot from "@/components/Chatbot"
import DebugComponent from "@/components/DebugComponent"

export const metadata = {
  title: "Reservations | Royal Udaipur Restaurant",
  description: "Make a reservation at Royal Udaipur Restaurant. Check table availability and book your dining experience.",
}

export default function ReservationsPage() {
  return (
    <main className="bg-cream">
      <div className="bg-dark-blue text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">Reservations</h1>
        <p className="text-xl md:text-2xl font-playfair text-gold max-w-3xl mx-auto">
          Secure your table at Royal Udaipur and experience the finest Indian cuisine
        </p>
      </div>
      
      <AvailabilityChecker />
      <Reservation />
      <MassReservation />
      <DebugComponent />
      <Chatbot />
    </main>
  )
}
