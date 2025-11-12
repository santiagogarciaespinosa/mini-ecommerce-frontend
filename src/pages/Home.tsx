// src/pages/Home.tsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Collections from "../components/Collections";
import Benefits from "../components/Benefits";

export default function Home() {
  const { items: products, loading, error, refetch } = useProducts();

  // Toma hasta 8 destacados; si no hay, usa los primeros 8 disponibles.
  const featured = useMemo(
    () => products.filter((p: any) => !!p?.is_featured).slice(0, 8),
    [products]
  );
  const list = featured.length ? featured : products.slice(0, 8);

  const showEmpty = !loading && !error && products.length === 0;

  return (
    <main id="home" className="min-h-screen">
      <Hero />

      {/* Barra de error con reintento */}
      {error && (
        <div
          role="alert"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6"
        >
          <div className="rounded-xl border border-red-300/50 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-100 p-4 flex items-center justify-between">
            <p className="text-sm">
              No se pudieron cargar los productos. <span className="opacity-80">({error})</span>
            </p>
            <button
              onClick={() => refetch()}
              className="h-9 px-3 rounded-lg bg-red-600 text-white text-sm"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Estado vacío elegante */}
      {showEmpty && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border border-lightSecondary/20 dark:border-darkSecondary/20 p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">Sin productos por ahora</h2>
            <p className="text-lightSecondary dark:text-darkSecondary mb-6">
              Vuelve en unos minutos o explora nuestras colecciones.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => refetch()}
                className="h-11 px-5 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30"
              >
                Recargar
              </button>
              <Link
                to="/products"
                className="h-11 px-5 rounded-lg font-semibold bg-lightAccentPrimary text-lightBackground dark:bg-darkAccentPrimary dark:text-darkText"
              >
                Ver todo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contenido principal */}
      {!showEmpty && (
        <section
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-16"
          aria-busy={loading || undefined}
        >
          {/* Destacados + CTA */}
          <div className="space-y-6">
            <FeaturedProducts loading={loading} products={list} />
            <div className="flex justify-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-xl font-semibold bg-lightAccentPrimary text-lightBackground hover:opacity-90 dark:bg-darkAccentPrimary dark:text-darkText"
                aria-label="Explorar todos los productos"
                data-cta="home-explore-all"
              >
                Explorar todos
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="translate-y-px"
                >
                  <path
                    fill="currentColor"
                    d="M5 12h12.17l-4.59-4.59L13 6l7 7-7 7-1.41-1.41L17.17 13H5z"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Colecciones y beneficios */}
          <Collections />
          <Benefits />
        </section>
      )}
    </main>
  );
}
