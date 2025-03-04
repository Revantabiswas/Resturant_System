import Image from "next/image"

export default function About() {
  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Our Story</h2>
        <p className="section-subtitle">A Taste of Royal Udaipur</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-lg mb-6">
              At Royal Udaipur, we bring the rich flavors of India to your table. Established in 2010, our restaurant
              combines traditional cooking techniques with the finest ingredients to create an unforgettable dining
              experience.
            </p>
            <p className="text-lg mb-6">
              Our chefs come from different regions of India, each bringing their own unique expertise and recipes
              passed down through generations. We take pride in serving authentic Indian cuisine that captures the
              essence of royal Udaipur dining.
            </p>
            <p className="text-lg">
              From the moment you step into our restaurant, you'll be transported to the majestic palaces of Rajasthan
              with our elegant décor and warm hospitality.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/about_1.jpeg?height=400&width=300"
                alt="Restaurant Interior"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden mt-8">
              <Image
                src="/about_2.jpeg?height=400&width=300"
                alt="Chef Preparing Food"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=400&width=300" alt="Signature Dish" fill className="object-cover" />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden mt-8">
              <Image src="/placeholder.svg?height=400&width=300" alt="Spices" fill className="object-cover" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            title="Elegant Dining"
            description="Our restaurant offers a warm, elegant atmosphere perfect for any occasion."
            icon="utensils"
          />
          <FeatureCard
            title="Authentic Cuisine"
            description="Experience the true flavors of India with our authentic recipes."
            icon="chef-hat"
          />
          <FeatureCard
            title="Private Events"
            description="Host your special events with us for an unforgettable experience."
            icon="users"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="card text-center">
      <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
        {icon === "utensils" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
            <path d="M7 2v20"></path>
            <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
          </svg>
        )}
        {icon === "chef-hat" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
            <line x1="6" x2="18" y1="17" y2="17"></line>
          </svg>
        )}
        {icon === "users" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )}
      </div>
      <h3 className="text-xl font-playfair font-semibold mb-2 text-royal-blue">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}

