"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Royal Udaipur Logo" width={50} height={50} className="mr-2" />
            <span className={`font-playfair text-xl font-bold ${scrolled ? "text-royal-blue" : "text-white"}`}>
              Royal Udaipur
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <NavLink href="/" label="Home" scrolled={scrolled} />
            <NavLink href="/#about" label="About" scrolled={scrolled} />
            <NavLink href="/menu" label="Menu" scrolled={scrolled} />
            <NavLink href="/#reservation" label="Reservation" scrolled={scrolled} />
            <NavLink href="/#contact" label="Contact" scrolled={scrolled} />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <X className={scrolled ? "text-royal-blue" : "text-white"} size={24} />
            ) : (
              <Menu className={scrolled ? "text-royal-blue" : "text-white"} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col space-y-4">
              <MobileNavLink href="/" label="Home" onClick={() => setIsOpen(false)} />
              <MobileNavLink href="/#about" label="About" onClick={() => setIsOpen(false)} />
              <MobileNavLink href="/menu" label="Menu" onClick={() => setIsOpen(false)} />
              <MobileNavLink href="/#reservation" label="Reservation" onClick={() => setIsOpen(false)} />
              <MobileNavLink href="/#contact" label="Contact" onClick={() => setIsOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ href, label, scrolled }) {
  return (
    <Link
      href={href}
      className={`font-medium transition-colors duration-300 ${
        scrolled ? "text-gray-800 hover:text-royal-blue" : "text-white hover:text-gold"
      }`}
    >
      {label}
    </Link>
  )
}

function MobileNavLink({ href, label, onClick }) {
  return (
    <Link href={href} className="text-gray-800 hover:text-royal-blue font-medium block py-2" onClick={onClick}>
      {label}
    </Link>
  )
}

