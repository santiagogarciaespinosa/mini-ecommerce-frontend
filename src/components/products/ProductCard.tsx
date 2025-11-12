// src/components/products/ProductCard.tsx
import type { Product } from "../../types";

type Props = {
  product: Product;
  onAdd: (p: Product) => void;
};

export default function ProductCard({ product, onAdd }: Props) {
  const hasImg = !!(product as any).image;
  const category = (product as any).category as string | undefined;

  return (
    <div
      className="rounded-3xl p-5 shadow-sm border
                 border-lightSecondary/15 dark:border-darkSecondary/15
                 bg-lightSecondary/5 dark:bg-darkSecondary/20"
    >
      <div
        className="aspect-[4/3] rounded-2xl mb-5 overflow-hidden
                   bg-lightSecondary/10 dark:bg-darkSecondary/30"
      >
        {hasImg ? (
          <img
            src={(product as any).image}
            alt={product.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>

      {category ? (
        <span
          className="inline-flex items-center px-2 py-0.5 text-xs rounded-full
                     border border-lightSecondary/30 dark:border-darkSecondary/30
                     text-lightSecondary dark:text-darkSecondary mb-2"
        >
          {category}
        </span>
      ) : null}

      <h3 className="text-xl font-semibold leading-tight line-clamp-1">
        {product.name}
      </h3>

      <p className="mt-1 text-sm text-lightSecondary dark:text-darkSecondary">
        ${Number(product.price).toFixed(2)}
      </p>

      <button
        onClick={() => onAdd(product)}
        className="mt-5 h-11 w-full rounded-xl font-semibold
                   bg-lightAccentPrimary text-lightBackground hover:opacity-90
                   dark:bg-darkAccentPrimary dark:text-darkText
                   transition-opacity"
        aria-label={`Agregar ${product.name} al carrito`}
      >
        Agregar al carrito
      </button>
    </div>
  );
}
