import { Link } from "react-router-dom";
import { useCart } from "../state/cart";

export default function ProductCard({ product }) {
  const { add } = useCart();

  return (
    <div className="card overflow-hidden">
      <Link to={`/products/${product._id}`} className="block">
        <div className="aspect-[4/3] bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link to={`/products/${product._id}`} className="text-sm font-bold text-slate-900 hover:underline">
              {product.name}
            </Link>
            <div className="mt-1 text-xs text-slate-500">{product.category} • {product.supplier}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-brand-primary">₹{product.price}</div>
            <div className="mt-1 text-xs text-slate-500">★ {Number(product.rating || 0).toFixed(1)}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </div>
          <button
            className="btn-secondary"
            disabled={product.stock <= 0}
            onClick={() =>
              add(
                {
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  stock: product.stock,
                },
                1
              )
            }
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

