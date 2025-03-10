import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-dark-blue text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Image src="/images/logo.png" alt="Royal Udaipur Logo" width={40} height={40} className="mr-2" />
              <span className="font-playfair text-xl font-bold">Royal Udaipur</span>
            </div>
            <p className="text-gray-300 mb-4">Experience the authentic flavors of India in an elegant royal setting.</p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-300 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-300 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-300 hover:text-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-gray-300 hover:text-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-300 hover:text-gold transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/#reservation" className="text-gray-300 hover:text-gold transition-colors">
                  Reservations
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-gray-300 hover:text-gold transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">123 Eros Building</li>
              <li className="text-gray-300">Nehru Place, New Delhi 10001</li>
              <li className="text-gray-300">(555) 123-4567</li>
              <li className="text-gray-300">info@royaludaipur.com</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Monday - Thursday</li>
              <li className="text-gray-300">5:00 PM - 10:00 PM</li>
              <li className="text-gray-300">Friday - Saturday</li>
              <li className="text-gray-300">5:00 PM - 11:00 PM</li>
              <li className="text-gray-300">Sunday</li>
              <li className="text-gray-300">4:00 PM - 9:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Royal Udaipur. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

