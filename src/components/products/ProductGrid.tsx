// src/components/products/ProductGrid.tsx
import type { Product } from "../../types";
import ProductCard from "./ProductCard";

type Props = {
  products: Product[];
  onAdd: (p: Product) => void;
  loading?: boolean;
  emptyText?: string;
};

export default function ProductGrid({ products, onAdd, loading, emptyText = "Sin productos." }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-4 border border-lightSecondary/20 dark:border-darkSecondary/20">
            <div className="aspect-video rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/20 animate-pulse" />
            <div className="h-4 w-2/3 mt-4 rounded bg-lightSecondary/10 dark:bg-darkSecondary/20 animate-pulse" />
            <div className="h-3 w-1/3 mt-2 rounded bg-lightSecondary/10 dark:bg-darkSecondary/20 animate-pulse" />
            <div className="h-10 w-full mt-4 rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/20 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return <div className="text-lightSecondary dark:text-darkSecondary">{emptyText}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAdd={onAdd} />
      ))}
    </div>
  );
}
