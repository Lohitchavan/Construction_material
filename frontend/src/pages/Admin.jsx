import { useEffect, useMemo, useState } from "react";
import { api } from "../utils/api";

const tabs = ["Products", "Orders", "Users"];
const categories = ["Cement", "Bricks", "Sand", "Steel", "Tiles", "Paint"];

function emptyProduct() {
  return {
    name: "",
    description: "",
    price: 0,
    category: "Cement",
    image: "",
    supplier: "",
    stock: 0,
    rating: 4.2,
  };
}

export default function Admin() {
  const [tab, setTab] = useState("Products");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct());
  const isEditing = useMemo(() => Boolean(editing), [editing]);

  const refresh = async () => {
    setLoading(true);
    try {
      const [p, o, u] = await Promise.all([
        api.get("/products", { params: { limit: 48, sort: "new" } }),
        api.get("/admin/orders"),
        api.get("/admin/users"),
      ]);
      setProducts(p.data.items || []);
      setOrders(o.data.items || []);
      setUsers(u.data.items || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm(emptyProduct());
  };

  const startEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      supplier: p.supplier,
      stock: p.stock,
      rating: p.rating ?? 4.2,
    });
  };

  const save = async () => {
    if (isEditing) await api.put(`/products/${editing}`, form);
    else await api.post("/products", form);
    await refresh();
    startCreate();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    await refresh();
  };

  const updateOrderStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status });
    await refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-extrabold text-slate-900">Admin Dashboard</div>
        <div className="mt-1 text-sm text-slate-600">Manage products, orders, and users.</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            className={t === tab ? "btn-primary" : "btn-ghost"}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <button className="btn-ghost ml-auto" onClick={refresh}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="card h-48 animate-pulse bg-slate-100" />
      ) : tab === "Products" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="card p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Products</div>
              <button className="btn-secondary" onClick={startCreate}>
                Add product
              </button>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-slate-500">
                  <tr>
                    <th className="py-2">Name</th>
                    <th className="py-2">Category</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Stock</th>
                    <th className="py-2" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-t border-slate-200">
                      <td className="py-3">
                        <div className="font-semibold text-slate-900">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.supplier}</div>
                      </td>
                      <td className="py-3">{p.category}</td>
                      <td className="py-3 font-semibold text-brand-primary">₹{p.price}</td>
                      <td className="py-3">{p.stock}</td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <button className="btn-ghost" onClick={() => startEdit(p)}>
                            Edit
                          </button>
                          <button className="btn-ghost" onClick={() => remove(p._id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="card p-5">
            <div className="text-sm font-extrabold text-slate-900">{isEditing ? "Edit product" : "Add product"}</div>
            <div className="mt-4 space-y-3">
              <div>
                <div className="label">Name</div>
                <input className="input mt-2" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <div className="label">Category</div>
                <select className="input mt-2" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="label">Price</div>
                  <input className="input mt-2" type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} />
                </div>
                <div>
                  <div className="label">Stock</div>
                  <input className="input mt-2" type="number" min="0" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <div className="label">Supplier</div>
                <input className="input mt-2" value={form.supplier} onChange={(e) => setForm((f) => ({ ...f, supplier: e.target.value }))} />
              </div>
              <div>
                <div className="label">Image URL</div>
                <input className="input mt-2" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
              </div>
              <div>
                <div className="label">Description</div>
                <textarea className="input mt-2 min-h-28" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button className="btn-primary flex-1" onClick={save} type="button">
                  {isEditing ? "Save changes" : "Create"}
                </button>
                <button className="btn-ghost" type="button" onClick={startCreate}>
                  Reset
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : tab === "Orders" ? (
        <div className="card p-5">
          <div className="text-sm font-extrabold text-slate-900">Orders</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2">Order</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Total</th>
                  <th className="py-2">Status</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-t border-slate-200">
                    <td className="py-3">
                      <div className="font-semibold text-slate-900">#{o._id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString()}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-900">{o.user?.name}</div>
                      <div className="text-xs text-slate-500">{o.user?.email}</div>
                    </td>
                    <td className="py-3 font-semibold text-brand-primary">₹{o.totalPrice}</td>
                    <td className="py-3">
                      <select
                        className="input"
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      >
                        {["placed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-right text-xs text-slate-500">{o.items.length} items</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-5">
          <div className="text-sm font-extrabold text-slate-900">Users</div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-slate-200">
                    <td className="py-3 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-3">{u.email}</td>
                    <td className="py-3">
                      <span className={u.role === "admin" ? "rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700 ring-1 ring-orange-200" : "rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200"}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

