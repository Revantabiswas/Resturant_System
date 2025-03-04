import MenuHeader from "@/components/MenuHeader"
import MenuSection from "@/components/MenuSection"
import Chatbot from "@/components/Chatbot"

export default function MenuPage() {
  const appetizers = [
    {
      id: 1,
      name: "Vegetable Samosas",
      description: "Crispy pastry filled with spiced potatoes and peas",
      price: "$6.99",
      image: "/images/samosa.jpg",
    },
    {
      id: 2,
      name: "Onion Bhaji",
      description: "Crispy onion fritters with chickpea flour and spices",
      price: "$5.99",
      image: "/images/bhaji.jpg",
    },
    {
      id: 3,
      name: "Paneer Tikka",
      description: "Marinated cottage cheese cubes grilled in tandoor",
      price: "$8.99",
      image: "/images/paneer-tikka.jpg",
    },
  ]

  const mainCourses = [
    {
      id: 1,
      name: "Butter Chicken",
      description: "Tender chicken cooked in a rich tomato and butter sauce",
      price: "$16.99",
      image: "/images/butter-chicken.jpg",
    },
    {
      id: 2,
      name: "Palak Paneer",
      description: "Cottage cheese cubes in a creamy spinach sauce",
      price: "$14.99",
      image: "/images/palak-paneer.jpg",
    },
    {
      id: 3,
      name: "Lamb Rogan Josh",
      description: "Aromatic lamb curry with Kashmiri spices",
      price: "$18.99",
      image: "/images/rogan-josh.jpg",
    },
  ]

  const desserts = [
    {
      id: 1,
      name: "Gulab Jamun",
      description: "Deep-fried milk solids soaked in sugar syrup",
      price: "$5.99",
      image: "/images/gulab-jamun.jpg",
    },
    {
      id: 2,
      name: "Rasmalai",
      description: "Soft cottage cheese dumplings in sweetened milk",
      price: "$6.99",
      image: "/images/rasmalai.jpg",
    },
  ]

  const beverages = [
    {
      id: 1,
      name: "Mango Lassi",
      description: "Refreshing yogurt drink with mango pulp",
      price: "$4.99",
      image: "/images/mango-lassi.jpg",
    },
    {
      id: 2,
      name: "Masala Chai",
      description: "Traditional Indian spiced tea",
      price: "$3.99",
      image: "/images/masala-chai.jpg",
    },
  ]

  return (
    <div className="bg-cream min-h-screen">
      <MenuHeader />

      <div className="container mx-auto px-4 py-12">
        <MenuSection title="Appetizers" items={appetizers} />
        <MenuSection title="Main Courses" items={mainCourses} />
        <MenuSection title="Desserts" items={desserts} />
        <MenuSection title="Beverages" items={beverages} />
      </div>

      <Chatbot />
    </div>
  )
}

