import { useMemo } from "react";

type Base = { category?: string | null };
type Props = {
  active: string;
  onChange: (cat: string) => void;
  products?: Base[];
  categories?: string[];
  loading?: boolean;
};

const norm = (s?: string | null) => (s?.toString().trim() ? s!.toString().trim() : "Sin categoría");

export default function ProductFilters({
  active,
  onChange,
  products = [],
  categories,
  loading = false,
}: Props) {
  const { cats, counts, total } = useMemo(() => {
    // 1) Conteo real SIEMPRE desde products
    const counts = new Map<string, number>();
    for (const p of products) {
      const c = norm(p?.category ?? "");
      counts.set(c, (counts.get(c) || 0) + 1);
    }

    // 2) Conjunto de categorías visibles = keys contadas + categorías opcionales (todas normalizadas)
    const visible = new Set<string>([...counts.keys()]);
    if (categories?.length) {
      for (const raw of categories) visible.add(norm(raw));
    }

    // 3) Orden alfabético (insensible a mayúsculas)
    const sorted = Array.from(visible).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    // 4) “Todos” al inicio
    const cats = ["Todos", ...sorted];

    // 5) Total real
    const total = products.length;

    return { cats, counts, total };
  }, [products, categories]);

  if (loading) {
    return (
      <div className="mt-6 flex flex-wrap gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 rounded-full bg-lightSecondary/10 dark:bg-darkSecondary/20 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Oculta si no hay nada que filtrar
  if (!cats.length || (cats.length === 1 && cats[0] === "Todos" && total === 0)) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3" role="tablist" aria-label="Filtros de categoría">
      {cats.map((c) => {
        const isAll = c === "Todos";
        const count = isAll ? total : (counts.get(c) || 0);
        const isActive = c === active;

        return (
          <button
            key={c}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(c)}
            className={[
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              "border border-lightSecondary/25 dark:border-darkSecondary/25",
              isActive
                ? "bg-lightAccentCreative text-white dark:bg-darkAccentCreative"
                : "hover:bg-lightSecondary/10 dark:hover:bg-darkSecondary/20",
            ].join(" ")}
          >
            {c} {typeof count === "number" ? `(${count})` : ""}
          </button>
        );
      })}
    </div>
  );
}
