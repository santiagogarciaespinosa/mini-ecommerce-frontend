// src/pages/CartSaved.tsx
import { useLocation, Link, useNavigate } from "react-router-dom";
import { loadCartSnapshot, clearCartSnapshot } from "../utils/cartSnapshot";
import { formatMoney } from "../utils/formatMoney";
import { useCart } from "../context/cartContext";

type StateShape = {
  items: Array<{
    product: { id: number; name: string; price: number | string; image?: string | null };
    quantity: number;
  }>;
  subtotal: number;
  total: number;
} | null;

export default function CartSaved() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as StateShape) || null;

  const { clearCart, /* @ts-ignore */ addToCart } = useCart();

  // Preferimos state justo después de guardar; si no está, usamos snapshot local
  const fromState = !!state;
  const itemsFromState = state?.items ?? [];
  const snap = loadCartSnapshot();

  const rows = fromState
    ? itemsFromState.map((it) => ({
        id: it.product.id,
        name: it.product.name,
        price: it.product.price,
        image: it.product.image ?? null,
        quantity: it.quantity,
      }))
    : (snap?.items ?? []).map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        image: it.image ?? null,
        quantity: it.quantity,
      }));

  const savedAtText = fromState
    ? "recién guardado"
    : snap?.savedAt
    ? new Date(snap.savedAt).toLocaleString()
    : null;

  const total = rows.reduce((sum, it) => sum + Number(it.price) * it.quantity, 0);

  const restoreToCart = (goCheckout: boolean) => {
    if (!rows.length) return;

    // Vacía y rehidrata el carrito usando addToCart del contexto
    clearCart();
    rows.forEach((it) => {
      const product = {
        id: it.id,
        name: it.name,
        price: it.price,
        image: it.image ?? null,
        // campos opcionales que tu UI tolera:
        category: "",
        is_featured: false,
      } as any;
      if (typeof addToCart === "function") {
        addToCart(product, it.quantity);
      }
    });

    if (goCheckout) {
      navigate("/checkout", { replace: true });
    } else {
      navigate("/cart", { replace: true });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Carrito guardado</h1>
        <div className="flex gap-2">
          {!fromState && (
            <button
              onClick={() => {
                clearCartSnapshot();
                navigate(0); // recarga segura
              }}
              className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30"
            >
              Borrar snapshot
            </button>
          )}
          <Link
            to="/cart"
            className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30 grid place-items-center"
          >
            Volver al carrito
          </Link>
        </div>
      </div>

      <p className="text-sm text-lightSecondary dark:text-darkSecondary mb-4">
        {savedAtText ? `Guardado: ${savedAtText}` : "No hay carrito guardado."}
      </p>

      {!rows.length ? (
        <div className="rounded-2xl border border-lightSecondary/20 dark:border-darkSecondary/20 p-6">
          Sin productos.
        </div>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden border border-lightSecondary/20 dark:border-darkSecondary/20">
            <table className="w-full text-left">
              <thead className="bg-lightSecondary/10 dark:bg-darkSecondary/20">
                <tr>
                  <th className="p-3">Producto</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Cant.</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightSecondary/10 dark:divide-darkSecondary/10">
                {rows.map((it) => (
                  <tr key={it.id}>
                    <td className="p-3">{it.name}</td>
                    <td className="p-3">{formatMoney(it.price)}</td>
                    <td className="p-3">{it.quantity}</td>
                    <td className="p-3 text-right">
                      {formatMoney(Number(it.price) * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="p-3" colSpan={3}><strong>Total</strong></td>
                  <td className="p-3 text-right"><strong>{formatMoney(total)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Acciones para restaurar */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => restoreToCart(false)}
              className="h-11 rounded-xl font-medium border border-lightSecondary/30 hover:bg-lightSecondary/10
                         dark:border-darkSecondary/30 dark:hover:bg-darkSecondary/20"
            >
              Restaurar al carrito
            </button>
            <button
              onClick={() => restoreToCart(true)}
              className="h-11 rounded-xl font-semibold bg-lightAccentPrimary text-lightBackground hover:opacity-90
                         dark:bg-darkAccentPrimary dark:text-darkText"
            >
              Restaurar y comprar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
