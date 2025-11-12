// src/components/FeaturedProducts.tsx
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";
import { useCart } from "@/context/cartContext";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  products: Product[];
  loading?: boolean;
  title?: string;
  /** Cuántos esqueletos mostrar mientras carga */
  skeletonCount?: number;
  /** Máximo de ítems a mostrar (default 8 para home) */
  maxItems?: number;
};

const money = (n: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

export default function FeaturedProducts({
  products,
  loading = false,
  title = "Destacados de la semana",
  skeletonCount = 8,
  maxItems = 8,
}: Props) {
  const { addToCart } = useCart();

  // Cap explícito de lo mostrado
  const list = useMemo(() => products.slice(0, maxItems), [products, maxItems]);

  // -------- Skeletons --------
  const SkeletonsMobile = (
    <ul
      role="list"
      aria-label="Productos cargando"
      className={[
        // dos filas, columnas automáticas; scroll lateral
        "grid grid-flow-col grid-rows-2",
        // ancho de cada columna en móvil (ocupa ~70-78% del viewport)
        "auto-cols-[78%] xs:auto-cols-[70%]",
        // separación horizontal y vertical
        "gap-x-3 gap-y-3",
        // scroll + snap
        "overflow-x-auto snap-x snap-mandatory pb-2",
        // edge padding visual
        "-mx-4 px-4",
        // solo móvil
        "sm:hidden",
      ].join(" ")}
    >
      {Array.from({ length: Math.min(skeletonCount, 8) }).map((_, i) => (
        <li key={`sm-${i}`} className="snap-start">
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );

  const SkeletonsDesktop = (
    <ul
      role="list"
      aria-label="Productos cargando"
      className="hidden sm:grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <li key={`lg-${i}`}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );

  // -------- Render --------
  return (
    <section aria-labelledby="featured-heading">
      <header className="mb-4 sm:mb-6 flex items-end justify-between gap-3">
        <h2 id="featured-heading" className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight">
          {title}
        </h2>
        {!loading && list.length > 0 ? (
          <span className="hidden sm:inline text-sm text-lightSecondary dark:text-darkSecondary">
            {list.length} ítems
          </span>
        ) : null}
      </header>

      {loading ? (
        <>
          {SkeletonsMobile}
          {SkeletonsDesktop}
        </>
      ) : list.length === 0 ? (
        <div className="col-span-full text-center py-10 rounded-2xl border border-lightSecondary/20 dark:border-darkSecondary/20 text-lightSecondary dark:text-darkSecondary">
          Sin productos destacados.
        </div>
      ) : (
        <>
          {/* Móvil: carrusel horizontal en DOS FILAS */}
          <ul
            role="list"
            aria-label="Listado de productos destacados (carrusel 2 filas)"
            className={[
              "grid grid-flow-col grid-rows-2",
              "auto-cols-[78%] xs:auto-cols-[70%]",
              "gap-x-3 gap-y-3",
              "overflow-x-auto snap-x snap-mandatory pb-2",
              "-mx-4 px-4",
              "sm:hidden",
            ].join(" ")}
          >
            {list.map((p, idx) => (
              <li key={p.id} className="snap-start">
                <FeaturedCard product={p} index={idx} onAdd={() => addToCart(p)} />
              </li>
            ))}
          </ul>

          {/* Desktop: grid con varias filas */}
          <ul
            role="list"
            aria-label="Listado de productos destacados"
            className="hidden sm:grid gap-4 sm:gap-5 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          >
            {list.map((p, idx) => (
              <li key={p.id}>
                <FeaturedCard product={p} index={idx} onAdd={() => addToCart(p)} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

function FeaturedCard({
  product,
  index = 0,
  onAdd,
}: {
  product: Product;
  index?: number;
  onAdd: () => void;
}) {
  const [imgOk, setImgOk] = useState(true);
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Animación al entrar en viewport (respeta prefers-reduced-motion)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) {
      setShow(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setShow(true);
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const price = Number(product.price ?? 0);
  const image =
    (product as any)?.image ||
    (product as any)?.thumbnail ||
    (Array.isArray((product as any)?.images) && (product as any).images[0]?.url) ||
    undefined;

  return (
    <Card
      ref={ref}
      role="listitem"
      className={[
        "group p-3 sm:p-4 transition-[transform,box-shadow] duration-200 hover:shadow-lg",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 will-change-transform",
      ].join(" ")}
      style={{ transitionDelay: show ? `${Math.min(index * 40, 240)}ms` : "0ms" }}
    >
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 sm:mb-4 bg-lightSecondary/10 dark:bg-darkSecondary/30">
        {imgOk && image ? (
          <img
            src={String(image)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 will-change-transform group-hover:scale-[1.03]"
            onError={() => setImgOk(false)}
          />
        ) : null}

        {/* Borde con conic-gradient sutil */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            padding: 1,
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(120,119,198,0.35), rgba(0,0,0,0) 25%, rgba(56,189,248,0.35) 50%, rgba(0,0,0,0) 75%, rgba(120,119,198,0.35))",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            maskComposite: "exclude" as any,
            WebkitMaskComposite: "xor",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.00),rgba(0,0,0,0.20))" }}
        />
      </div>

      <div className="min-h-[2.75rem] sm:min-h-[3.25rem]">
        <h3 className="font-semibold line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-sm text-lightSecondary dark:text-darkSecondary mt-1">{money(price)}</p>
      </div>

      <Button
        className="mt-3 sm:mt-4 w-full h-10 sm:h-11 transition-transform duration-150 group-hover:translate-x-[1px]"
        variant="creative"
        onClick={onAdd}
        aria-label={`Agregar ${product.name} al carrito`}
        data-cta="featured-add"
      >
        Agregar
      </Button>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card className="p-3 sm:p-4">
      <div className="aspect-[4/3] rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/20 animate-pulse mb-3 sm:mb-4" />
      <div className="h-4 w-3/5 rounded bg-lightSecondary/10 dark:bg-darkSecondary/20" />
      <div className="h-3 w-2/5 mt-2 rounded bg-lightSecondary/10 dark:bg-darkSecondary/20" />
      <div className="h-10 mt-4 rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/20" />
    </Card>
  );
}
