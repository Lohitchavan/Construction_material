import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../utils/api";
import ProductCard from "../components/ProductCard";

const categories = ["Cement", "Bricks", "Sand", "Steel", "Tiles", "Paint"];

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Products() {
  const [params, setParams] = useSearchParams();

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";
  const rating = params.get("rating") || "";
  const sort = params.get("sort") || "new";
  const page = params.get("page") || "1";

  const [data, setData] = useState({ items: [], total: 0, pages: 0, page: 1 });
  const [loading, setLoading] = useState(true);

  const apiParams = useMemo(
    () => ({
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
      ...(minPrice ? { minPrice } : {}),
      ...(maxPrice ? { maxPrice } : {}),
      ...(rating ? { rating } : {}),
      ...(sort ? { sort } : {}),
      ...(page ? { page } : {}),
      limit: 12,
    }),
    [q, category, minPrice, maxPrice, rating, sort, page]
  );

  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get("/products", { params: apiParams });
        if (alive) setData(res.data);
      } finally {
        if (alive) setLoading(false);
      }
    }, 150);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [apiParams]);

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) next.delete(k);
      else next.set(k, String(v));
    });
    setParams(next, { replace: true });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit p-5">
        <div className="text-sm font-extrabold text-slate-900">Filters</div>
        <div className="mt-4 space-y-4">
          <div>
            <div className="label">Category</div>
            <select className="input mt-2" value={category} onChange={(e) => update({ category: e.target.value })}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="label">Price range</div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <input
                className="input"
                type="number"
                min="0"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => update({ minPrice: e.target.value })}
              />
              <input
                className="input"
                type="number"
                min="0"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => update({ maxPrice: e.target.value })}
              />
            </div>
          </div>

          <div>
            <div className="label">Rating</div>
            <select className="input mt-2" value={rating} onChange={(e) => update({ rating: e.target.value })}>
              <option value="">Any</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
              <option value="4.7">4.7+</option>
            </select>
          </div>

          <div>
            <div className="label">Sort</div>
            <select className="input mt-2" value={sort} onChange={(e) => update({ sort: e.target.value })}>
              <option value="new">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating</option>
              <option value="name_asc">Name</option>
            </select>
          </div>

          <button
            className="btn-ghost w-full"
            onClick={() => setParams(new URLSearchParams(), { replace: true })}
          >
            Clear filters
          </button>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-sm font-extrabold text-slate-900">Product Listing</div>
            <div className="mt-1 text-sm text-slate-600">
              {q ? (
                <>
                  Showing results for <span className="font-semibold text-slate-900">“{q}”</span>
                </>
              ) : (
                "Browse construction materials."
              )}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">{data.total || 0}</span> items
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="card h-[320px] animate-pulse bg-slate-100" />
            ))
          ) : data.items?.length ? (
            data.items.map((p) => <ProductCard key={p._id} product={p} />)
          ) : (
            <div className="card p-8 text-sm text-slate-600">
              No products found. Try adjusting filters or search query.
            </div>
          )}
        </div>

        {data.pages > 1 ? (
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <button
                className="btn-ghost"
                disabled={data.page <= 1}
                onClick={() => update({ page: clamp((data.page || 1) - 1, 1, data.pages) })}
              >
                Previous
              </button>
              <div className="text-sm text-slate-600">
                Page <span className="font-semibold text-slate-900">{data.page}</span> / {data.pages}
              </div>
              <button
                className="btn-ghost"
                disabled={data.page >= data.pages}
                onClick={() => update({ page: clamp((data.page || 1) + 1, 1, data.pages) })}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

