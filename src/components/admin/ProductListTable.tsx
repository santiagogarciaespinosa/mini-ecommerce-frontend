// src/components/admin/ProductListTable.tsx
import type { Product } from "../../types";

type Props = {
  items: Product[];
  loading: boolean;
  money: (n: number) => string;
  categories: readonly string[];
  editing: Product | null;
  setEditing: (p: Product | null) => void;
  onSave: () => void;
  onDelete: (id: number) => void;
};

export default function ProductListTable({
  items,
  loading,
  money,
  categories,
  editing,
  setEditing,
  onSave,
  onDelete,
}: Props) {
  return (
    <div className="rounded-2xl overflow-hidden border border-lightSecondary/20 dark:border-darkSecondary/20">
      <table className="w-full text-left">
        <thead className="bg-lightSecondary/10 dark:bg-darkSecondary/20">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Precio</th>
            <th className="p-3">Categoría</th>
            <th className="p-3">Destacado</th>
            <th className="p-3">Imagen</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lightSecondary/10 dark:divide-darkSecondary/10">
          {loading ? (
            <tr>
              <td className="p-4" colSpan={7}>Cargando…</td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td className="p-4" colSpan={7}>Sin productos</td>
            </tr>
          ) : (
            items.map((p) => (
              <tr key={p.id}>
                <td className="p-3">{p.id}</td>
                <td className="p-3">
                  {editing?.id === p.id ? (
                    <input
                      className="h-9 rounded-lg px-2 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent w-full"
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td className="p-3">
                  {editing?.id === p.id ? (
                    <input
                      className="h-9 rounded-lg px-2 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent w-32"
                      value={String(editing.price)}
                      onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) as any })}
                      inputMode="decimal"
                    />
                  ) : (
                    money(p.price as any)
                  )}
                </td>
                <td className="p-3">
                  {editing?.id === p.id ? (
                    <select
                      className="h-9 rounded-lg px-2 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
                      value={(editing as any).category ?? ""}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value } as any)}
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (p.category ?? "") ? (
                    p.category
                  ) : (
                    <span className="text-lightSecondary dark:text-darkSecondary">—</span>
                  )}
                </td>
                <td className="p-3">
                  {editing?.id === p.id ? (
                    <input
                      type="checkbox"
                      checked={!!editing.is_featured}
                      onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                    />
                  ) : p.is_featured ? "Sí" : "No"}
                </td>
                <td className="p-3">
                  {editing?.id === p.id ? (
                    <input
                      className="h-9 rounded-lg px-2 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent w-full"
                      value={(editing as any).image ?? ""}
                      onChange={(e) => setEditing({ ...editing, image: e.target.value } as any)}
                      placeholder="https://…"
                    />
                  ) : (p.image ?? "") ? (
                    <a href={p.image!} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      Ver
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2 justify-end">
                    {editing?.id === p.id ? (
                      <>
                        <button
                          onClick={onSave}
                          className="h-9 px-3 rounded-lg bg-lightAccentPrimary text-lightBackground dark:bg-darkAccentPrimary dark:text-darkText"
                          title="Guardar"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30"
                          title="Cancelar"
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditing(p)}
                          className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="h-9 px-3 rounded-lg bg-red-600 text-white"
                          title="Eliminar"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
