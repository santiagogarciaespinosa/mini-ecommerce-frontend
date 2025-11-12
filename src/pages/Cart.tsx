// src/pages/Cart.tsx
import { useState } from "react";
import { useCart } from "../context/cartContext";
import api from "../services/api";
import QtyControl from "../components/cart/QtyControl";
import { useNavigate, Link } from "react-router-dom"; // ← añade Link
import { saveCartSnapshot } from "../utils/cartSnapshot";
import { formatMoney } from "../utils/formatMoney";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const saveCart = async () => {
    if (!cart.length) return;
    setSaving(true);
    try {
      // Payload para backend (dejamos la ruta que esperas en tests)
      const payload = cart.map((i) => ({ product: i.product.id, quantity: i.quantity }));
      await api.post("/cart/", payload);

      // Snapshot local para poder ver luego en /cart/saved o si se recarga la página
      saveCartSnapshot(
        cart.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          image: i.product.image,
          quantity: i.quantity,
        }))
      );

      const snapshot = { items: cart, subtotal: total, total };
      clearCart();
      navigate("/cart/saved", { state: snapshot, replace: true });
    } catch {
      alert("No se pudo guardar el carrito");
    } finally {
      setSaving(false);
    }
  };

  const checkout = () => {
    if (!cart.length) return;
    const snapshot = { items: cart, subtotal: total, total };
    navigate("/checkout", { state: snapshot });
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-20 bg-lightAccentCreative dark:bg-darkAccentCreative" />
          <div className="absolute -bottom-28 -right-28 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-lightAccentPrimary dark:bg-darkAccentPrimary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Carrito de Compras
          </h1>
        </div>
      </section>

      {/* LISTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl border border-lightSecondary/15 dark:border-darkSecondary/15 overflow-hidden">
          {cart.length === 0 ? (
            <div className="p-8 text-lightSecondary dark:text-darkSecondary">
              No hay productos en el carrito.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-lightSecondary/10 dark:divide-darkSecondary/10">
                {cart.map((item) => (
                  <li
                    key={item.product.id}
                    className="p-5 sm:p-6 flex items-center gap-4 sm:gap-6"
                  >
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/30 flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.product.name}</p>
                      <p className="text-sm text-lightSecondary dark:text-darkSecondary mt-1">
                        {formatMoney(Number(item.product.price))} c/u
                      </p>
                      <div className="mt-3">
                        <QtyControl
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.product.id, q)}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {formatMoney(Number(item.product.price) * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="mt-2 text-sm rounded-lg border border-lightSecondary/30 px-3 py-1 hover:bg-lightSecondary/10
                                   dark:border-darkSecondary/30 dark:hover:bg-darkSecondary/25"
                        aria-label={`Eliminar ${item.product.name}`}
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between p-6 border-t border-lightSecondary/10 dark:border-darkSecondary/10">
                <p className="text-xl sm:text-2xl font-bold">
                  Total: {formatMoney(total)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={saveCart}
            disabled={!cart.length || saving}
            className="h-12 rounded-xl font-medium border border-lightSecondary/30 hover:bg-lightSecondary/10
                       disabled:opacity-60
                       dark:border-darkSecondary/30 dark:hover:bg-darkSecondary/20"
            aria-busy={saving || undefined}
          >
            {saving ? "Guardando..." : "Guardar carrito"}
          </button>

          <button
            onClick={checkout}
            disabled={!cart.length}
            className="h-12 rounded-xl font-semibold bg-lightAccentPrimary text-lightBackground hover:opacity-90 disabled:opacity-60
                       dark:bg-darkAccentPrimary dark:text-darkText"
          >
            Comprar ahora
          </button>

          <Link
            to="/cart/saved"
            className="h-12 rounded-xl font-medium border border-lightSecondary/30 hover:bg-lightSecondary/10
                       grid place-items-center
                       dark:border-darkSecondary/30 dark:hover:bg-darkSecondary/20"
          >
            Ver carrito guardado
          </Link>
        </div>
      </section>
    </div>
  );
}
