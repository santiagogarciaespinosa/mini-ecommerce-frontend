// src/pages/ProductList.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useProducts } from "../context/ProductsContext";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import ProductSearch, { type SearchItem } from "@/components/search/ProductSearch";
import type { Product } from "../types";

const CATEGORIES = ["Audio", "Computadores", "Accesorios", "Gaming", "Oficina", "Viaje"] as const;

export default function ProductList() {
  const { items: products, loading } = useProducts();
  const { addToCart } = useCart();

  const [searchParams, setSearchParams] = useSearchParams();
  const urlCat = searchParams.get("cat") || "Todos";
  const urlQ = searchParams.get("q") || "";

  const [activeCat, setActiveCat] = useState<string>(urlCat);
  const [query, setQuery] = useState<string>(urlQ);

  useEffect(() => {
    const allowed = new Set<string>(["Todos", ...CATEGORIES]);
    if (!allowed.has(urlCat)) {
      setActiveCat("Todos");
      setSearchParams((prev) => {
        prev.delete("cat");
        return prev;
      }, { replace: true });
    } else {
      setActiveCat(urlCat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCat]);

  useEffect(() => {
    setQuery(urlQ);
  }, [urlQ]);

  const onChangeCat = (cat: string) => {
    setActiveCat(cat);
    setSearchParams((prev) => {
      const q = prev.get("q")?.trim() || "";
      const next = new URLSearchParams();
      if (cat !== "Todos") next.set("cat", cat);
      if (q) next.set("q", q);
      return next;
    }, { replace: true });
  };

  const itemsForSearch: SearchItem[] = useMemo(
    () =>
      products.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.image || p.thumbnail || (Array.isArray(p.images) && p.images[0]?.url) || undefined,
      })),
    [products]
  );

  const applyQuery = (q: string) => {
    const value = q.trim();
    setQuery(value);
    setSearchParams((prev) => {
      const cat = prev.get("cat");
      const next = new URLSearchParams();
      if (cat && cat !== "Todos") next.set("cat", cat);
      if (value) next.set("q", value);
      return next;
    }, { replace: true });
  };

  const clearQuery = () => {
    setQuery("");
    setSearchParams((prev) => {
      const cat = prev.get("cat");
      const next = new URLSearchParams();
      if (cat && cat !== "Todos") next.set("cat", cat);
      // no q => muestra todo
      return next;
    }, { replace: true });
  };

  const filtered = useMemo<Product[]>(() => {
    const q = query.trim().toLowerCase();
    const byText = !q
      ? products
      : products.filter((p: any) => {
          const n = (p?.name ?? "").toString().toLowerCase();
          const c = (p?.category ?? "").toString().toLowerCase();
          return n.includes(q) || c.includes(q);
        });

    if (activeCat === "Todos") return byText;
    return byText.filter((p: any) => (p?.category || "") === activeCat);
  }, [products, query, activeCat]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-20 bg-lightAccentCreative dark:bg-darkAccentCreative" />
          <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-lightAccentPrimary dark:bg-darkAccentPrimary" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Productos</h1>

          {/* Buscador */}
          <div className="mt-4">
            <ProductSearch
              items={itemsForSearch}
              defaultQuery={query}
              placeholder="Buscar por nombre o categoría…"
              onSubmit={applyQuery}
              onSelect={(it) => applyQuery(it.name)}
              onClear={clearQuery}
            />
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <ProductFilters
              active={activeCat}
              onChange={onChangeCat}
              products={products as any}
              categories={[...CATEGORIES]}
              loading={loading}
            />
          </div>

          {!loading && (
            <p className="mt-3 text-sm text-lightSecondary dark:text-darkSecondary">
              {query ? (
                <>
                  Resultados para “{query}”: <strong>{filtered.length}</strong>
                  {activeCat !== "Todos" ? <> en {activeCat}</> : null}
                </>
              ) : (
                <>
                  {activeCat === "Todos" ? "Todos los productos" : activeCat}:{" "}
                  <strong>{filtered.length}</strong>
                </>
              )}
            </p>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <ProductGrid products={filtered} onAdd={addToCart} loading={loading} />
      </section>
    </div>
  );
}
