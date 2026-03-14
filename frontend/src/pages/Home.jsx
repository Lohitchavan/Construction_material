import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../utils/api";
import ProductCard from "../components/ProductCard";

const categories = [
  { name: "Cement", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80" },
  { name: "Bricks", image: "https://images.unsplash.com/photo-1617196037304-49459c1e5f54?auto=format&fit=crop&w=800&q=80" },
  { name: "Sand", image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80" },
  { name: "Steel", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80" },
  { name: "Tiles", image: "https://images.unsplash.com/photo-1582582429416-55f35b8b0b66?auto=format&fit=crop&w=800&q=80" },
  { name: "Paint", image: "https://images.unsplash.com/photo-1581579185169-3652e5f9b3d7?auto=format&fit=crop&w=800&q=80" },
];

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/products", { params: { sort: "rating_desc", limit: 6 } });
        if (alive) setPopular(data.items || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <section className="card overflow-hidden">
        <div className="grid gap-6 p-8 md:grid-cols-2 md:p-10">
          <div>
            <div className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-200">
              Construction theme • Modern UI
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Buy Construction Materials Online
            </h1>
            <p className="mt-3 text-sm text-slate-600 md:text-base">
              Cement, bricks, sand, steel, tiles, paint — from top suppliers, with transparent pricing and quick checkout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Browse Products
              </Link>
              <Link to="/categories" className="btn-ghost">
                View Categories
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="font-extrabold text-slate-900">Trusted</div>
                <div className="mt-1">Suppliers</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="font-extrabold text-slate-900">Fast</div>
                <div className="mt-1">Delivery</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="font-extrabold text-slate-900">Secure</div>
                <div className="mt-1">Checkout</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -m-10 bg-gradient-to-br from-blue-50 via-white to-orange-50" />
            <div className="relative grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-extrabold text-slate-900">Top suppliers</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {["UltraBuild Supplies", "SteelMart", "TileCraft", "ColorPro Coatings"].map((s) => (
                  <div key={s} className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div className="text-xs font-semibold text-slate-500">Supplier</div>
                    <div className="mt-1 font-bold text-slate-900">{s}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-brand-primary p-4 text-white">
                <div className="text-xs font-semibold text-white/80">Today’s highlight</div>
                <div className="mt-1 text-sm font-extrabold">Bulk deals on steel & cement</div>
                <div className="mt-2 text-xs text-white/80">Check product listings for offers.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Categories</div>
            <div className="mt-1 text-sm text-slate-600">Find materials by category.</div>
          </div>
          <Link to="/categories" className="text-sm font-semibold text-brand-primary">
            View all →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={`/products?category=${encodeURIComponent(c.name)}`}
              className="card group overflow-hidden"
            >
              <div className="aspect-[16/9] bg-slate-100">
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-extrabold text-slate-900">{c.name}</div>
                  <div className="text-xs font-semibold text-slate-500">Browse</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Popular products</div>
            <div className="mt-1 text-sm text-slate-600">Top rated materials right now.</div>
          </div>
          <Link to="/products" className="text-sm font-semibold text-brand-primary">
            See more →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card h-[320px] animate-pulse bg-slate-100" />
            ))
          ) : (
            popular.map((p) => <ProductCard key={p._id} product={p} />)
          )}
        </div>
      </section>
    </div>
  );
}

