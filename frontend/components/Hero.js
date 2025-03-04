import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative h-screen bg-hero-pattern bg-cover bg-center flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-4">Royal Udaipur</h1>
        <p className="text-xl md:text-2xl font-light mb-8">Experience the authentic flavors of India</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/menu" className="btn-primary">
            View Our Menu
          </Link>
          <Link
            href="#reservation"
            className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-royal-blue"
          >
            Reserve a Table
          </Link>
        </div>
      </div>
    </div>
  )
}

