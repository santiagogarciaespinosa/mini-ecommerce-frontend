// src/components/Collections.tsx
import { Link } from "react-router-dom";
import Card from "./ui/Card";
import Button from "./ui/Button";
import { useProducts } from "../context/ProductsContext";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Colecciones creativas:
 * - Mobile: carrusel horizontal con snap-x.
 * - Desktop: grid responsiva (2/3/4 columnas).
 * - Animación al entrar en viewport (IntersectionObserver).
 * - Hover con leve tilt/zoom + borde conico decorativo.
 * - Chip de conteo y overlay para legibilidad.
 * - Skeletons consistentes.
 * - Respeta reduced motion.
 */
export default function Collections() {
  const { items, loading } = useProducts();

  // Agrupa por categoría y toma una imagen representativa.
  const buckets = useMemo(() => {
    const map = new Map<
      string,
      { name: string; count: number; image?: string }
    >();

    for (const p of items) {
      const raw =
        (p?.category?.toString?.() as string | undefined) ?? "Sin categoría";
      const name = raw.trim() || "Sin categoría";
      const key = name.toLocaleLowerCase();

      const imgCandidate =
        (p as any)?.image ||
        (p as any)?.thumbnail ||
        (Array.isArray((p as any)?.images) && (p as any).images[0]?.url) ||
        undefined;

      if (!map.has(key)) {
        map.set(key, { name, count: 1, image: imgCandidate });
      } else {
        const prev = map.get(key)!;
        prev.count += 1;
        if (!prev.image && imgCandidate) prev.image = String(imgCandidate);
      }
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [items]);

  const Skeletons = (
    <>
      {/* Mobile: carrusel de skeletons */}
      <div className="grid grid-flow-col auto-cols-[75%] sm:hidden gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={`m-${i}`} />
        ))}
      </div>

      {/* Desktop: grid skeleton */}
      <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={`d-${i}`} />
        ))}
      </div>
    </>
  );

  return (
    <section aria-labelledby="collections-title">
      <header className="mb-4 sm:mb-6">
        <h2
          id="collections-title"
          className="text-2xl sm:text-3xl font-extrabold tracking-tight"
        >
          Colecciones
        </h2>

      </header>

      {loading ? (
        Skeletons
      ) : buckets.length === 0 ? (
        <p className="text-lightSecondary dark:text-darkSecondary">
          Aún no hay colecciones.
        </p>
      ) : (
        <>
          {/* Mobile-first: carrusel horizontal con snap */}
          <ul className="grid grid-flow-col auto-cols-[75%] gap-3 overflow-x-auto snap-x snap-mandatory pb-2 sm:hidden -mx-4 px-4">
            {buckets.map((c, idx) => (
              <li key={c.name} className="snap-start">
                <CollectionCard
                  name={c.name}
                  count={c.count}
                  image={c.image}
                  index={idx}
                />
              </li>
            ))}
          </ul>

          {/* Desktop: grid responsiva */}
          <ul className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {buckets.map((c, idx) => (
              <li key={c.name}>
                <CollectionCard
                  name={c.name}
                  count={c.count}
                  image={c.image}
                  index={idx}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function CollectionCard({
  name,
  count,
  image,
  index = 0,
}: {
  name: string;
  count: number;
  image?: string;
  index?: number; // para escalonar animación
}) {
  const [imgOk, setImgOk] = useState(true);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Animación al entrar en viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media && media.matches) {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setShow(true);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Link semántico: evita query vacío
  const linkTo =
    name === "Sin categoría"
      ? "/products"
      : `/products?cat=${encodeURIComponent(name)}`;

  return (
    <Card
      clickable
      ref={ref}
      className={[
        "group relative transition-shadow duration-200 hover:shadow-lg focus-within:shadow-lg",
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 will-change-transform",
      ].join(" ")}
      style={{
        transitionDelay: show ? `${Math.min(index * 40, 240)}ms` : "0ms",
      }}
    >
      {/* Borde decorativo con conic-gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          padding: 1,
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(120,119,198,0.35), rgba(0,0,0,0) 25%, rgba(56,189,248,0.35) 50%, rgba(0,0,0,0) 75%, rgba(120,119,198,0.35))",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude" as any,
          WebkitMaskComposite: "xor",
        }}
      />

      <div className="relative overflow-hidden rounded-xl">
        <div className="aspect-[3/2] bg-gradient-to-br from-lightAccentCreative/20 to-lightAccentPrimary/20 dark:from-darkAccentCreative/20 dark:to-darkAccentPrimary/20">
          {imgOk && image ? (
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
              onError={() => setImgOk(false)}
            />
          ) : null}

          {/* Overlay para contraste */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg,rgba(0,0,0,0.00),rgba(0,0,0,0.22))",
            }}
          />
        </div>

        {/* Chip de conteo */}
        <div className="absolute left-2 top-2 inline-flex items-center rounded-full bg-black/60 text-white text-xs font-medium px-2 py-1 backdrop-blur-sm">
          {count} producto{count === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-base sm:text-lg truncate">
            {name}
          </h3>
        </div>

        <Link to={linkTo} aria-label={`Ver colección ${name}`}>
          <Button className="whitespace-nowrap transition-transform duration-150 group-hover:translate-x-0.5">
            Ver
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <div className="aspect-[3/2] rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/20 animate-pulse" />
      <div className="mt-4 h-4 w-2/3 rounded bg-lightSecondary/10 dark:bg-darkSecondary/20" />
      <div className="mt-2 h-3 w-1/3 rounded bg-lightSecondary/10 dark:bg-darkSecondary/20" />
      <div className="mt-4 h-10 rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/20" />
    </Card>
  );
}
