import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../utils/api";
import { useCart } from "../state/cart";

export default function ProductDetails() {
  const { id } = useParams();
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        if (!alive) return;
        setProduct(data);
        setQty(1);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const stockOptions = useMemo(() => {
    const n = Math.min(10, product?.stock || 0);
    return Array.from({ length: n }, (_, i) => i + 1);
  }, [product?.stock]);

  if (loading) {
    return <div className="card h-[420px] animate-pulse bg-slate-100" />;
  }

  if (!product) {
    return (
      <div className="card p-8 text-sm text-slate-600">
        Product not found. <Link to="/products">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-600">
        <Link to="/products" className="font-semibold text-brand-primary">
          Products
        </Link>{" "}
        / <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="card overflow-hidden">
        <div className="grid gap-6 p-6 lg:grid-cols-2 lg:p-8">
          <div className="overflow-hidden rounded-2xl bg-slate-100">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div>
            <div className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
              {product.category}
            </div>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-900">{product.name}</h1>
            <div className="mt-2 text-sm text-slate-600">Supplier: {product.supplier}</div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-slate-500">Price</div>
                <div className="mt-1 text-2xl font-extrabold text-brand-primary">₹{product.price}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-slate-500">Rating</div>
                <div className="mt-1 text-sm font-bold text-slate-900">★ {Number(product.rating || 0).toFixed(1)}</div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <div className="label">Quantity</div>
                <select
                  className="input mt-2"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? <option>0</option> : null}
                  {stockOptions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="label">Stock</div>
                <div className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
                  {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="btn-secondary"
                disabled={product.stock <= 0}
                onClick={() =>
                  add(
                    { id: product._id, name: product.name, price: product.price, image: product.image, stock: product.stock },
                    qty
                  )
                }
              >
                Add to cart
              </button>
              <Link to="/cart" className="btn-primary">
                Go to cart
              </Link>
            </div>

            <div className="mt-8">
              <div className="text-sm font-extrabold text-slate-900">Description</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

