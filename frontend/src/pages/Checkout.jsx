import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../state/cart";
import { api } from "../utils/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const orderItems = useMemo(
    () => items.map((i) => ({ productId: i.id, qty: i.qty })),
    [items]
  );

  if (!items.length) {
    return (
      <div className="card p-10 text-center">
        <div className="text-lg font-black text-slate-900">No items to checkout</div>
        <div className="mt-2 text-sm text-slate-600">Add items to your cart before placing an order.</div>
      </div>
    );
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/orders", { items: orderItems, address, paymentMethod });
      clear();
      navigate("/orders");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="card p-6">
        <div className="text-sm font-extrabold text-slate-900">Delivery address</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="label">Full name</div>
            <input className="input mt-2" value={address.fullName} onChange={(e) => setAddress((a) => ({ ...a, fullName: e.target.value }))} required />
          </div>
          <div className="md:col-span-2">
            <div className="label">Phone</div>
            <input className="input mt-2" value={address.phone} onChange={(e) => setAddress((a) => ({ ...a, phone: e.target.value }))} required />
          </div>
          <div className="md:col-span-2">
            <div className="label">Address line 1</div>
            <input className="input mt-2" value={address.line1} onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))} required />
          </div>
          <div className="md:col-span-2">
            <div className="label">Address line 2 (optional)</div>
            <input className="input mt-2" value={address.line2} onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))} />
          </div>
          <div>
            <div className="label">City</div>
            <input className="input mt-2" value={address.city} onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))} required />
          </div>
          <div>
            <div className="label">State</div>
            <input className="input mt-2" value={address.state} onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))} required />
          </div>
          <div>
            <div className="label">Postal code</div>
            <input className="input mt-2" value={address.postalCode} onChange={(e) => setAddress((a) => ({ ...a, postalCode: e.target.value }))} required />
          </div>
          <div>
            <div className="label">Country</div>
            <input className="input mt-2" value={address.country} onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))} required />
          </div>
        </div>

        <div className="mt-8 text-sm font-extrabold text-slate-900">Payment</div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="card cursor-pointer p-4">
            <div className="flex items-center gap-3">
              <input type="radio" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
              <div>
                <div className="text-sm font-bold text-slate-900">Cash on delivery</div>
                <div className="text-xs text-slate-600">Pay at delivery.</div>
              </div>
            </div>
          </label>
          <label className="card cursor-pointer p-4">
            <div className="flex items-center gap-3">
              <input type="radio" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
              <div>
                <div className="text-sm font-bold text-slate-900">Card</div>
                <div className="text-xs text-slate-600">Demo option.</div>
              </div>
            </div>
          </label>
        </div>
      </section>

      <aside className="card h-fit p-6">
        <div className="text-sm font-extrabold text-slate-900">Order summary</div>
        <div className="mt-4 space-y-3">
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-3 text-sm text-slate-700">
              <div className="truncate">
                <span className="font-semibold text-slate-900">{i.name}</span> × {i.qty}
              </div>
              <div className="font-semibold">₹{i.price * i.qty}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <div className="text-sm font-semibold text-slate-700">Total</div>
          <div className="text-lg font-extrabold text-brand-primary">₹{total}</div>
        </div>
        <button className="btn-primary mt-6 w-full" disabled={submitting}>
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </aside>
    </form>
  );
}

