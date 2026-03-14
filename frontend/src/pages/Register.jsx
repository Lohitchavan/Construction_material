import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
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
      await register(name, email, password);
      navigate(next, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="card p-8">
        <div className="text-2xl font-black text-slate-900">Create account</div>
        <div className="mt-2 text-sm text-slate-600">Register to place orders and track delivery.</div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <div className="label">Name</div>
            <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
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
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-brand-primary" to={`/login?next=${encodeURIComponent(next)}`}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

