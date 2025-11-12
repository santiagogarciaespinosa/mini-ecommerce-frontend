// src/components/cart/FloatingCartButton.tsx
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/cartContext";

export default function FloatingCartButton() {
  const { cart } = useCart();
  const { pathname } = useLocation();

  // Ocultar en pantallas donde no aporta
  const hideOn = ["/cart", "/checkout", "/checkout/success"];
  if (hideOn.includes(pathname)) return null;

  const count = cart.reduce((n, i) => n + i.quantity, 0);

  return (
    <Link
      to="/cart"
      aria-label="Abrir carrito"
      className={[
        // posición con safe-area
        "fixed right-4 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] sm:right-6 sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50",
        // tamaño y forma
        "h-14 w-14 sm:h-16 sm:w-16 rounded-full",
        // colores
        "bg-lightAccentPrimary text-lightBackground dark:bg-darkAccentPrimary dark:text-darkText",
        // interacción y foco
        "shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2",
        "focus:ring-lightAccentPrimary dark:focus:ring-darkAccentPrimary",
        // layout
        "flex items-center justify-center"
      ].join(" ")}
    >
      {/* Ícono carrito */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3h2l.4 2M7 13h9l3-7H6.4M7 13L6 6M7 13l-2 7h13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Badge con total */}
      {count > 0 && (
        <span
          aria-label={`Artículos en el carrito: ${count}`}
          className={[
            "absolute -top-1 -right-1 min-w-5 h-5 px-1",
            "rounded-full text-xs font-bold",
            "bg-lightAccentCreative text-white dark:bg-darkAccentCreative",
            "flex items-center justify-center"
          ].join(" ")}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
