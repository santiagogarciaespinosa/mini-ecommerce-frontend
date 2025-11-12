// src/components/admin/FilterBar.tsx
import { useId } from "react";

type Props = {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
  featuredOnly: boolean;
  onFeaturedOnly: (v: boolean) => void;
  pageSize: number;
  onPageSize: (n: number) => void;
  categories: readonly string[];
};

export default function FilterBar({
  search,
  onSearch,
  category,
  onCategory,
  featuredOnly,
  onFeaturedOnly,
  pageSize,
  onPageSize,
  categories,
}: Props) {
  const searchId = useId();
  const catId = useId();
  const featId = useId();
  const sizeId = useId();

  return (
    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl border border-lightSecondary/20 dark:border-darkSecondary/20 bg-lightSecondary/5 dark:bg-darkSecondary/20">
      <div>
        <label htmlFor={searchId} className="block text-sm mb-1">Buscar</label>
        <input
          id={searchId}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Nombre o categoría…"
          className="w-full h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
        />
      </div>

      <div>
        <label htmlFor={catId} className="block text-sm mb-1">Categoría</label>
        <select
          id={catId}
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className="w-full h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end">
        <label htmlFor={featId} className="inline-flex items-center gap-2">
          <input
            id={featId}
            type="checkbox"
            checked={featuredOnly}
            onChange={(e) => onFeaturedOnly(e.target.checked)}
          />
          <span className="text-sm">Solo destacados</span>
        </label>
      </div>

      <div>
        <label htmlFor={sizeId} className="block text-sm mb-1">Items por página</label>
        <select
          id={sizeId}
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          className="w-full h-10 rounded-lg px-3 border border-lightSecondary/30 dark:border-darkSecondary/30 bg-transparent"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
