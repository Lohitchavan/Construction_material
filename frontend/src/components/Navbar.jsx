import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../state/cart";
import { useAuth } from "../state/auth";

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function Navbar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { count } = useCart();
  const { isAuthed, user, logout } = useAuth();

  const initial = useMemo(() => params.get("q") || "", [params]);
  const [q, setQ] = useState(initial);

  useEffect(() => {
    setQ(initial);
  }, [initial]);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = q.trim();
    navigate(next ? `/products?q=${encodeURIComponent(next)}` : "/products");
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="container-page">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary text-white font-black">
              BM
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-slate-900">BuildMart</div>
              <div className="text-[11px] text-slate-500">Construction Materials</div>
            </div>
          </Link>

          <form onSubmit={onSubmit} className="hidden flex-1 sm:block">
            <div className="relative">
              <input
                className="input pl-10"
                placeholder="Search cement, bricks, sand, steel, tiles, paint..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
            </div>
          </form>

          <nav className="ml-auto flex items-center gap-2">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                cn("rounded-xl px-3 py-2 text-sm font-semibold", isActive ? "text-brand-primary" : "text-slate-700")
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                cn("rounded-xl px-3 py-2 text-sm font-semibold", isActive ? "text-brand-primary" : "text-slate-700")
              }
            >
              Products
            </NavLink>
            <Link to="/cart" className="btn-ghost relative">
              Cart
              {count > 0 ? (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-secondary px-1 text-xs font-bold text-white">
                  {count}
                </span>
              ) : null}
            </Link>

            {!isAuthed ? (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                {user?.role === "admin" ? (
                  <Link to="/admin" className="btn-secondary">
                    Admin
                  </Link>
                ) : (
                  <Link to="/orders" className="btn-ghost">
                    Orders
                  </Link>
                )}
                <button className="btn-ghost" onClick={logout}>
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>

        <div className="pb-3 sm:hidden">
          <form onSubmit={onSubmit}>
            <div className="relative">
              <input
                className="input pl-10"
                placeholder="Search materials..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                ⌕
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

