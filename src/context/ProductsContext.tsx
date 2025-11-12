// src/context/ProductsContext.tsx
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import type { Product } from "../types";

type Ctx = {
  items: Product[];
  loading: boolean;
  error?: string;
  refetch: () => Promise<void>;
  upsert: (p: Product) => void;
  remove: (id: number) => void;
};

const ProductsCtx = createContext<Ctx | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const timer = useRef<number | null>(null);
  const backoffRef = useRef(15000); // 15s → 60s
  const hiddenRef = useRef<boolean>(false);

  const schedule = (ms: number) => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => { if (!hiddenRef.current) void load(); }, ms);
  };

  const load = async () => {
    try {
      setError(undefined);
      // IMPORTANTE: sin barra inicial para que el test vea "products/"
      const { data } = await api.get<Product[]>("products/");
      setItems(Array.isArray(data) ? data : []);
      // reset backoff en éxito
      if (backoffRef.current !== 15000) {
        backoffRef.current = 15000;
        schedule(backoffRef.current);
      }
    } catch (e: any) {
      setError(e?.message || "Error");
      // backoff progresivo hasta 60s
      backoffRef.current = Math.min(backoffRef.current * 2, 60000);
      schedule(backoffRef.current);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onVis = () => {
      hiddenRef.current = document.hidden;
      if (!document.hidden) void load();
    };
    document.addEventListener("visibilitychange", onVis);
    void load();
    schedule(backoffRef.current);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (timer.current) window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<Ctx>(() => ({
    items,
    loading,
    error,
    refetch: load,
    upsert: (p) =>
      setItems((prev) => {
        const i = prev.findIndex((x) => x.id === p.id);
        if (i < 0) return [p, ...prev];
        const next = prev.slice();
        next[i] = { ...prev[i], ...p };
        return next;
      }),
    remove: (id) => setItems((prev) => prev.filter((x) => x.id !== id)),
  }), [items, loading, error]);

  return <ProductsCtx.Provider value={value}>{children}</ProductsCtx.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsCtx);
  if (!ctx) throw new Error("useProducts debe usarse dentro de ProductsProvider");
  return ctx;
}
