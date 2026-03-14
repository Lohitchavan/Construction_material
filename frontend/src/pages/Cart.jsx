import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../state/cart";
import { useAuth } from "../state/auth";

export default function Cart() {
  const { items, total, remove, setQty } = useCart();
  const { isAuthed } = useAuth();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="card p-10 text-center">
        <div className="text-lg font-black text-slate-900">Your cart is empty</div>
        <div className="mt-2 text-sm text-slate-600">Add some construction materials to continue.</div>
        <div className="mt-6">
          <Link to="/products" className="btn-primary">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="card p-5">
        <div className="text-sm font-extrabold text-slate-900">Cart</div>
        <div className="mt-4 space-y-4">
          {items.map((i) => (
            <div key={i.id} className="flex gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <img src={i.image} alt={i.name} className="h-20 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{i.name}</div>
                    <div className="mt-1 text-xs text-slate-500">₹{i.price} each</div>
                  </div>
                  <button className="text-sm font-semibold text-slate-600 hover:text-slate-900" onClick={() => remove(i.id)}>
                    Remove
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold text-slate-500">Qty</div>
                    <input
                      className="input w-24"
                      type="number"
                      min="1"
                      max={i.stock ?? 9999}
                      value={i.qty}
                      onChange={(e) => setQty(i.id, e.target.value)}
                    />
                  </div>
                  <div className="text-sm font-extrabold text-brand-primary">₹{i.price * i.qty}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="card h-fit p-5">
        <div className="text-sm font-extrabold text-slate-900">Summary</div>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Items</span>
            <span className="font-semibold">{items.reduce((s, x) => s + x.qty, 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total</span>
            <span className="text-lg font-extrabold text-brand-primary">₹{total}</span>
          </div>
        </div>

        <button
          className="btn-primary mt-6 w-full"
          onClick={() => {
            if (!isAuthed) navigate("/login?next=/checkout");
            else navigate("/checkout");
          }}
        >
          Checkout
        </button>
        <Link to="/products" className="btn-ghost mt-3 w-full">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}

