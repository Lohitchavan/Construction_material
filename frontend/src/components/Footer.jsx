export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-10">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="text-sm font-extrabold text-slate-900">BuildMart</div>
            <p className="mt-2 text-sm text-slate-600">
              Buy construction materials online with trusted suppliers and reliable delivery.
            </p>
          </div>
          <div className="text-sm text-slate-600">
            <div className="font-semibold text-slate-900">Categories</div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {["Cement", "Bricks", "Sand", "Steel", "Tiles", "Paint"].map((c) => (
                <div key={c} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <div className="font-semibold text-slate-900">Support</div>
            <div className="mt-2 space-y-2">
              <div>Shipping & Delivery</div>
              <div>Returns</div>
              <div>Contact: support@buildmart.com</div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-xs text-slate-500">
          © {new Date().getFullYear()} BuildMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

