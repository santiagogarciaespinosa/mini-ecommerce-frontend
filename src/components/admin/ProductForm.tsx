// src/components/admin/ProductForm.tsx
import { useState } from "react";

export type FormState = {
  name: string;
  price: string;
  image: string;
  category: string;
  is_featured: boolean;
};

type Props = {
  onSubmit: (form: FormState) => Promise<void> | void;
  categories: readonly string[];
};

export default function ProductForm({ onSubmit, categories }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    image: "",
    category: "",
    is_featured: false,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return; // evita doble submit

    const name = form.name.trim();
    const price = form.price.trim();
    const image = form.image.trim();
    const category = form.category.trim();

    if (!name || !Number.isFinite(Number(price))) return;

    setSaving(true);
    try {
      await onSubmit({
        name,
        price,
        image,
        category,
        is_featured: !!form.is_featured,
      });
      setForm({ name: "", price: "", image: "", category: "", is_featured: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end
                 p-4 rounded-2xl border border-lightSecondary/20 dark:border-darkSecondary/20
                 bg-lightSecondary/5 dark:bg-darkSecondary/20"
    >
      <div className="md:col-span-4">
        <label className="block text-sm mb-1">Nombre</label>
        <input
          className="w-full h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
          value={form.name}
          onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
          placeholder="Ej. Audífonos"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Precio</label>
        <input
          className="w-full h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
          value={form.price}
          onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
          placeholder="199900"
          inputMode="numeric"
          required
        />
      </div>

      <div className="md:col-span-3">
        <label className="block text-sm mb-1">Imagen (URL)</label>
        <input
          className="w-full h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
          value={form.image}
          onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))}
          placeholder="https://…"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm mb-1">Categoría</label>
        <select
          className="w-full h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
          value={form.category}
          onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
        >
          <option value="">Sin categoría</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <label className="md:col-span-1 inline-flex items-center gap-2 h-10">
        <input
          type="checkbox"
          checked={form.is_featured}
          onChange={(e) => setForm((s) => ({ ...s, is_featured: e.target.checked }))}
        />
        <span className="text-sm">Destacado</span>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="md:col-span-12 md:justify-self-end h-10 px-5 rounded-lg font-semibold bg-lightAccentPrimary text-lightBackground dark:bg-darkAccentPrimary dark:text-darkText disabled:opacity-60"
      >
        {saving ? "Creando…" : "Crear"}
      </button>
    </form>
  );
}
