import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Royal Udaipur - Authentic Indian Restaurant",
  description: "Experience the authentic flavors of India at Royal Udaipur Restaurant",
  generator: 'Revanta',
  icons: [] // This will override any default favicon
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-cream">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}



