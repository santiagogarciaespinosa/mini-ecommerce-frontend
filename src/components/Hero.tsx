// src/components/Hero.tsx
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import { useProducts } from "../context/ProductsContext";
import { useCart } from "../context/cartContext";
import { useEffect, useMemo, useRef, useState } from "react";

const money = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export default function Hero() {
  const { items = [], loading } = useProducts();
  const { addToCart } = useCart();

  const [imgOk, setImgOk] = useState(true);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setShow(true)),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const featured = useMemo(() => {
    const hasImg = (p: any) =>
      !!(p?.image || p?.thumbnail || (Array.isArray(p?.images) && p.images[0]?.url));
    const pick = (fn: (p: any) => boolean) => items.find(fn);
    return (
      pick((p: any) => p?.is_featured && hasImg(p)) ??
      pick((p: any) => p?.is_featured) ??
      pick((p: any) => hasImg(p)) ??
      items[0] ?? {
        id: 0,
        name: "Producto destacado",
        price: 0,
        image: "",
        category: "Selección recomendada",
      }
    );
  }, [items]);

  const image: string | undefined =
    (featured as any)?.image ||
    (featured as any)?.thumbnail ||
    (Array.isArray((featured as any)?.images) && (featured as any).images[0]?.url) ||
    undefined;

  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="home-hero-title"
      role="region"
      ref={ref}
    >
      {/* Fondo sutil */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none">
        <div className="absolute -top-20 -left-24 h-60 w-60 sm:h-80 sm:w-80 rounded-full blur-3xl opacity-20 bg-lightAccentCreative dark:bg-darkAccentCreative" />
        <div className="absolute -bottom-24 -right-24 h-[18rem] w-[18rem] sm:h-[26rem] sm:w-[26rem] rounded-full blur-3xl opacity-20 bg-lightAccentPrimary dark:bg-darkAccentPrimary" />
      </div>

      <div
        className={[
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
          "py-6 sm:py-12 lg:py-20",
          // MOBILE: dos columnas (texto izq + imagen der). DESKTOP: igual.
          "grid grid-cols-[1fr_auto] sm:grid-cols-2 items-start",
          "gap-4 sm:gap-10",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 will-change-transform",
        ].join(" ")}
        style={{ transition: "opacity 320ms ease, transform 320ms ease" }}
      >
        {/* Columna izquierda: texto + (en desktop) ambos botones */}
        <div className="min-w-0">
          <h1
            id="home-hero-title"
            className="text-[1.9rem] leading-[1.15] sm:text-5xl lg:text-6xl font-extrabold line-clamp-2"
          >
            {loading ? (
              <span className="inline-block h-8 w-60 rounded bg-lightSecondary/15 dark:bg-darkSecondary/25 animate-pulse" />
            ) : (
              (featured as any)?.name ?? "Producto destacado"
            )}
          </h1>

          <p className="mt-2 text-[0.95rem] sm:text-lg text-lightSecondary dark:text-darkSecondary">
            {loading ? (
              <span className="inline-block h-5 w-44 rounded bg-lightSecondary/15 dark:bg-darkSecondary/25 animate-pulse" />
            ) : (
              (featured as any)?.category || "Selección recomendada"
            )}
          </p>

          <p className="mt-3 text-xl sm:text-3xl font-semibold">
            {loading ? (
              <span className="inline-block h-7 w-28 rounded bg-lightSecondary/15 dark:bg-darkSecondary/25 animate-pulse" />
            ) : (
              money(Number((featured as any)?.price ?? 0))
            )}
          </p>

          {/* MOBILE: solo “Ver productos” aquí. DESKTOP: ambos botones aquí en fila */}
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Botón primario: oculto en mobile, visible en ≥sm */}
            <Button
              variant="primary"
              onClick={() => !loading && items.length && addToCart && addToCart(featured as any)}
              disabled={loading || !items.length}
              aria-label={
                loading || !items.length
                  ? "Agregar al carrito deshabilitado"
                  : `Agregar ${(featured as any)?.name ?? "producto"} al carrito`
              }
              className="hidden sm:inline-flex h-11 px-5"
            >
              Agregar al carrito
            </Button>

            {/* Botón secundario: visible siempre; full-width en mobile */}
            <Link to="/products" aria-label="Ver catálogo de productos" className="w-full sm:w-auto">
              <Button variant="ghost" className="h-11 px-5 w-full sm:w-auto">
                Ver productos
              </Button>
            </Link>
          </div>
        </div>

        {/* Columna derecha: imagen y (solo en mobile) botón “Agregar” debajo */}
        <div className="justify-self-end self-start">
          <div className="w-36 xs:w-44 sm:w-64 lg:w-96">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -m-1 sm:-m-2 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 180deg at 50% 50%, rgba(120,119,198,0.35), rgba(0,0,0,0) 25%, rgba(56,189,248,0.35) 50%, rgba(0,0,0,0) 75%, rgba(120,119,198,0.35))",
                  mask: "radial-gradient(farthest-side, #000 95%, transparent)",
                  WebkitMask: "radial-gradient(farthest-side, #000 95%, transparent)",
                }}
              />
              <div className="aspect-square rounded-full overflow-hidden border border-lightSecondary/20 dark:border-darkSecondary/20 bg-gradient-to-br from-lightSecondary/10 to-transparent dark:from-darkSecondary/20 shadow-sm">
                {loading ? (
                  <div className="h-full w-full animate-pulse bg-lightSecondary/15 dark:bg-darkSecondary/25" />
                ) : imgOk && image ? (
                  <img
                    src={String(image)}
                    alt={(featured as any)?.name ?? "Producto destacado"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgOk(false)}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-full w-full grid place-content-center text-lightSecondary dark:text-darkSecondary"
                  >
                    Sin imagen
                  </div>
                )}
              </div>
            </div>

            {/* Botón primario SOLO en mobile, debajo de la imagen */}
            <Button
              variant="primary"
              onClick={() => !loading && items.length && addToCart && addToCart(featured as any)}
              disabled={loading || !items.length}
              aria-label={
                loading || !items.length
                  ? "Agregar al carrito deshabilitado"
                  : `Agregar ${(featured as any)?.name ?? "producto"} al carrito`
              }
              className="mt-3 h-11 w-full sm:hidden"
            >
              Agregar al carrito
            </Button>
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <div className="border-t border-lightSecondary/10 dark:border-darkSecondary/10">
        <ul
          role="list"
          aria-label="Beneficios destacados"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
        >
          {[
            { t: "Envío rápido", s: "Gratis en 2 días" },
            { t: "Garantía", s: "Incluida" },
            { t: "Soporte 24/7", s: "Atención al cliente" },
          ].map((b) => (
            <li key={b.t} className="flex items-start gap-3">
              <span
                className="mt-2 h-2 w-2 rounded-full bg-lightAccentPrimary dark:bg-darkAccentPrimary shrink-0"
                aria-hidden="true"
              />
              <div className="leading-tight">
                <p className="font-semibold text-[0.98rem]">{b.t}</p>
                <p className="text-sm text-lightSecondary dark:text-darkSecondary">{b.s}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
