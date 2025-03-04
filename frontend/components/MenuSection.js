import Image from "next/image"

export default function MenuSection({ title, items }) {
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-playfair font-bold text-royal-blue mb-8 text-center">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item) => (
          <div key={item.id} className="card flex">
            <div className="w-24 h-24 relative mr-4 flex-shrink-0">
              <Image
                src={item.image || "/placeholder.svg?height=100&width=100"}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-playfair font-semibold text-royal-blue">{item.name}</h3>
                <span className="text-deep-red font-semibold">{item.price}</span>
              </div>
              <p className="text-gray-700">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

