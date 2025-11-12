// src/components/admin/ProductCardsMobile.tsx
import type { Product } from "@/types";
import { CATEGORIES } from "@/components/constants/categories";
import { useState } from "react";

type Props = {
  items: Product[];
  loading: boolean;
  formatMoney?: (n: number) => string;
  editing: Product | null;
  setEditing: (p: Product | null) => void;
  onSave: () => void;
  onDelete: (id: number) => void;
};

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    .format(Number.isFinite(n) ? n : 0);

export default function ProductCardsMobile({
  items,
  loading,
  formatMoney = defaultFormat,
  editing,
  setEditing,
  onSave,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-4 border border-lightSecondary/20 dark:border-darkSecondary/20 bg-lightSecondary/5 dark:bg-darkSecondary/20 animate-pulse h-28"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl p-6 border border-lightSecondary/20 dark:border-darkSecondary/20 text-lightSecondary dark:text-darkSecondary">
        Sin productos
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {items.map((p) => {
        const isEdit = editing?.id === p.id;

        return (
          <li
            key={p.id}
            className="rounded-2xl border border-lightSecondary/20 dark:border-darkSecondary/20 bg-lightSecondary/5 dark:bg-darkSecondary/20"
          >
            {!isEdit ? (
              <article className="p-4 grid grid-cols-[64px_1fr] gap-3">
                <Thumb src={(p as any).image} alt={p.name} />
                <div className="min-w-0">
                  <header className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold line-clamp-2">{p.name}</h3>
                    {p.is_featured ? (
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold bg-amber-200/60 dark:bg-amber-300/30 text-amber-900 dark:text-amber-100">
                        Destacado
                      </span>
                    ) : null}
                  </header>
                  <p className="mt-1 text-sm text-lightSecondary dark:text-darkSecondary">
                    {(p.category as any) || "Sin categoría"}
                  </p>
                  <p className="mt-2 font-semibold">{formatMoney(Number(p.price ?? 0))}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="h-9 px-3 rounded-lg bg-red-600 text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ) : (
              <form
                className="p-4 grid gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  onSave();
                }}
              >
                <div className="grid grid-cols-[64px_1fr] gap-3 items-center">
                  <Thumb src={(editing as any).image} alt={editing.name} />
                  <input
                    className="h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent w-full"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="Nombre"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
                    value={String(editing.price)}
                    onChange={(e) =>
                      setEditing({ ...editing, price: Number(e.target.value) as any })
                    }
                    placeholder="Precio"
                    inputMode="decimal"
                    required
                  />
                  <select
                    className="h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
                    value={(editing as any).category ?? ""}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value } as any)}
                  >
                    <option value="">Sin categoría</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  className="h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent w-full"
                  value={(editing as any).image ?? ""}
                  onChange={(e) => setEditing({ ...editing, image: e.target.value } as any)}
                  placeholder="Imagen (URL)"
                />

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!editing.is_featured}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  />
                  <span className="text-sm">Destacado</span>
                </label>

                <div className="flex gap-2 justify-end">
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-lg bg-lightAccentPrimary text-lightBackground dark:bg-darkAccentPrimary dark:text-darkText"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="h-10 px-4 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Thumb({ src, alt }: { src?: string | null; alt: string }) {
  const [ok, setOk] = useState(true);
  return (
    <div className="h-16 w-16 rounded-lg overflow-hidden border border-lightSecondary/20 dark:border-darkSecondary/20 bg-lightSecondary/10 dark:bg-darkSecondary/30">
      {ok && src ? (
        <img
          src={String(src)}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setOk(false)}
        />
      ) : (
        <div className="h-full w-full grid place-content-center text-xs text-lightSecondary dark:text-darkSecondary">
          Sin img
        </div>
      )}
    </div>
  );
}
