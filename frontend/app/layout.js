import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import dynamic from "next/dynamic"

// Import AnimatePresence through dynamic import with ssr disabled
const AnimatePresenceWrapper = dynamic(
  () => import('@/components/AnimatePresenceWrapper'),
  { ssr: false }
)

const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })

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
        <AnimatePresenceWrapper>
          <Navbar />
          {children}
          <Footer />
        </AnimatePresenceWrapper>
        <CustomCursor />
      </body>
    </html>
  )
}


