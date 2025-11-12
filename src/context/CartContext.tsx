import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product, CartItem } from "../types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;                 // array plano
      if (parsed && Array.isArray(parsed.items)) return parsed.items; // legacy { items: [] }
      return [];
    } catch {
      return [];
    }
  });

  // Evita persistir justo después de clearCart()
  const skipPersist = useRef(false);

  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const i = prev.findIndex((it) => it.product.id === product.id);
      if (i === -1) return [...prev, { product, quantity: 1 }];
      const next = [...prev];
      next[i] = { ...next[i], quantity: next[i].quantity + 1 };
      return next;
    });
  };

  const removeFromCart = (productId: number) =>
    setCart((prev) => prev.filter((it) => it.product.id !== productId));

  const updateQuantity = (productId: number, quantity: number) =>
    setCart((prev) =>
      prev.map((it) =>
        it.product.id === productId ? { ...it, quantity: Math.max(1, quantity | 0) } : it
      )
    );

  const clearCart = () => {
    skipPersist.current = true;
    localStorage.removeItem("cart"); // los tests esperan null
    setCart([]);
  };

  const value = useMemo<CartContextType>(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
