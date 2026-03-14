/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cm_cart";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStored()?.items || []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
    } catch {
      // ignore
    }
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return {
      items,
      count,
      total,
      add(product, qty = 1) {
        setItems((prev) => {
          const q = Math.max(1, Number(qty) || 1);
          const idx = prev.findIndex((p) => p.id === product.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...next[idx], qty: next[idx].qty + q };
            return next;
          }
          return [
            ...prev,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              stock: product.stock,
              qty: q,
            },
          ];
        });
      },
      remove(id) {
        setItems((prev) => prev.filter((p) => p.id !== id));
      },
      setQty(id, qty) {
        setItems((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, qty: Math.max(1, Math.min(p.stock ?? 9999, Number(qty) || 1)) } : p
          )
        );
      },
      clear() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

