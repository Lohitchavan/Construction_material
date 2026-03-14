import { useEffect, useState } from "react";
import { api } from "../utils/api";

export default function Orders() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/orders/mine");
        if (alive) setItems(data.items || []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-extrabold text-slate-900">Order history</div>
        <div className="mt-1 text-sm text-slate-600">Track your placed orders.</div>
      </div>

      {loading ? (
        <div className="card h-40 animate-pulse bg-slate-100" />
      ) : !items.length ? (
        <div className="card p-8 text-sm text-slate-600">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((o) => (
            <div key={o._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Order #{o._id.slice(-6).toUpperCase()}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {new Date(o.createdAt).toLocaleString()} • {o.items.length} item(s)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-brand-primary">₹{o.totalPrice}</div>
                  <div className="mt-1 inline-flex rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                    {o.status}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {o.items.slice(0, 4).map((i) => (
                  <div key={i.product} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <img src={i.image} alt={i.name} className="h-12 w-14 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">{i.name}</div>
                      <div className="text-xs text-slate-500">
                        ₹{i.price} × {i.qty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

