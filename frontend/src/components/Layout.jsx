import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container-page py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

