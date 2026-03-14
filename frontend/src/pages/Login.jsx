import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const next = new URLSearchParams(location.search).get("next") || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(next, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="card p-8">
        <div className="text-2xl font-black text-slate-900">Welcome back</div>
        <div className="mt-2 text-sm text-slate-600">Login to continue to checkout and view orders.</div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <div className="label">Email</div>
            <input className="input mt-2" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <div className="label">Password</div>
            <input className="input mt-2" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {err ? <div className="rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700 ring-1 ring-orange-200">{err}</div> : null}
          <button className="btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          Don’t have an account?{" "}
          <Link className="font-semibold text-brand-primary" to={`/register?next=${encodeURIComponent(next)}`}>
            Register
          </Link>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 ring-1 ring-slate-200">
          Demo accounts (after seeding): <span className="font-semibold">admin@buildmart.com</span> / Admin123! •{" "}
          <span className="font-semibold">user@buildmart.com</span> / User123!
        </div>
      </div>
    </div>
  );
}

