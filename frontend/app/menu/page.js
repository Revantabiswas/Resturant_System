import MenuHeader from "@/components/MenuHeader";
import MenuSection from "@/components/MenuSection";
import Chatbot from "@/components/Chatbot";

export default function MenuPage() {
  const indianShortPlates = [
    { id: 1, name: "Doodhiya Murgh Ka Bootha", description: "Creamy chicken morsels marinated in hung curd and cheese, cooked in a tandoor", price: "₹1200", image: "/images/butter-chicken.jpg" },
    { id: 2, name: "SharaBi Jhinga", description: "Prawns marinated with local liqueur and spices, cooked in clay oven", price: "₹1500", image: "/images/butter-chicken.jpg" },
    { id: 3, name: "Paneer Tikka", description: "Cottage cheese marinated with cream, black stone flower, and homemade spices", price: "₹1100", image: "/images/butter-chicken.jpg" },
  ];

  const soups = [
    { id: 1, name: "Elaichi Paya Ka Shorba", description: "Lamb trotter’s broth served with lemon wedge", price: "₹600", image: "@/public/images/butter-chicken.jpg" },
    { id: 2, name: "Dal Nariyal Ka Shorba", description: "South Indian delicacy of lentil extract, peppercorn, and coconut milk", price: "₹500", image: "/images/butter-chicken.jpg" },
  ];

  const indianMainCourse = [
    { id: 1, name: "Purani Delhi Style Butter Chicken", description: "Boneless chicken cooked with butter, cream, and rich tomato gravy", price: "₹1300", image: "/images/butter-chicken.jpg" },
    { id: 2, name: "Paneer Makhan Wala", description: "Cottage cheese simmered in tomato gravy, topped with cream", price: "₹1200", image: "/images/samosa.jpg" },
  ];

  const biryaniRice = [
    { id: 1, name: "Murgh Masaledar Biryani", description: "Popular chicken biryani spiced with home ground spices", price: "₹1400", image: "/images/butter-chicken.jpg" },
    { id: 2, name: "Shahi Subz Biryani", description: "Basmati rice with seasonal vegetables, cooked on dum", price: "₹1200", image: "/images/butter-chicken.jpg" },
  ];

  const indianBreads = [
    { id: 1, name: "Laccha Paratha", description: "Layered whole wheat paratha", price: "₹200", image: "/images/samosa.jpg" },
    { id: 2, name: "Naan", description: "Soft tandoori naan", price: "₹200", image: "/images/samosa.jpg" },
  ];

  const desserts = [
    { id: 1, name: "Anjeer Badam Halwa", description: "Grounded almond paste and fig cooked with clarified butter and milk", price: "₹800", image: "/images/butter-chicken.jpg" },
    { id: 2, name: "Kesari Angoori Rasmalai", description: "Poached cottage cheese laced with saffron", price: "₹800", image: "/images/samosa.jpg" },
  ];

  const comfortFood = [
    { id: 1, name: "Poori Bhaji", description: "Deep fried bread accompanied with spicy potato bhaji", price: "₹900", image: "/images/samosa.jpg" },
    { id: 2, name: "Khichdi", description: "Over-cooked rice and yellow lentil served with curd and ghee", price: "₹900", image: "/images/samosa.jpg" },
  ];

  const tajSignatureDishes = [
    { id: 1, name: "Cobb Salad", description: "American garden salad with chicken, bacon, avocado, and buttermilk dressing", price: "₹1200", image: "/images/samosa.jpg" },
    { id: 2, name: "Nasi Goreng", description: "Malaysian fried rice with chicken, fried prawns, and condiments", price: "₹1500", image: "/images/samosa.jpg" },
  ];

  return (
    <div className="bg-cream min-h-screen">
      <MenuHeader />

      <div className="container mx-auto px-4 py-12">
        <MenuSection title="Indian Short Plates & Deep Bowl" items={indianShortPlates} />
        <MenuSection title="Soups" items={soups} />
        <MenuSection title="Indian Main Course" items={indianMainCourse} />
        <MenuSection title="Biryani & Rice" items={biryaniRice} />
        <MenuSection title="Indian Breads" items={indianBreads} />
        <MenuSection title="Desserts" items={desserts} />
        <MenuSection title="Comfort Food" items={comfortFood} />
        <MenuSection title="Signature Dishes" items={tajSignatureDishes} />
      </div>

      <Chatbot />
    </div>
  );
}
