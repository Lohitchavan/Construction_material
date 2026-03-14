import { Link } from "react-router-dom";

const categories = [
  { name: "Cement", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80" },
  { name: "Bricks", image: "https://images.unsplash.com/photo-1617196037304-49459c1e5f54?auto=format&fit=crop&w=1200&q=80" },
  { name: "Sand", image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=80" },
  { name: "Steel", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80" },
  { name: "Tiles", image: "https://images.unsplash.com/photo-1582582429416-55f35b8b0b66?auto=format&fit=crop&w=1200&q=80" },
  { name: "Paint", image: "https://images.unsplash.com/photo-1581579185169-3652e5f9b3d7?auto=format&fit=crop&w=1200&q=80" },
];

export default function Categories() {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-extrabold text-slate-900">Category Page</div>
          <div className="mt-1 text-sm text-slate-600">Grid layout of categories with image cards.</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.name} to={`/products?category=${encodeURIComponent(c.name)}`} className="card group overflow-hidden">
            <div className="aspect-[16/10] bg-slate-100">
              <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-lg font-black text-slate-900">{c.name}</div>
                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-200">
                  Browse →
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-600">
                Explore {c.name.toLowerCase()} products from verified suppliers.
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

