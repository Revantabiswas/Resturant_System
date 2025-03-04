import Link from "next/link"

export default function MenuHeader() {
  return (
    <div className="relative h-96 bg-hero-pattern bg-cover bg-center flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-4">Our Menu</h1>
        <p className="text-xl md:text-2xl font-light mb-8">Discover the authentic flavors of India</p>
        <Link href="/#reservation" className="btn-primary">
          Reserve a Table
        </Link>
      </div>
    </div>
  )
}

