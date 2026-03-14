import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/auth";

export default function AdminRoute() {
  const { isAuthed, user } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}

