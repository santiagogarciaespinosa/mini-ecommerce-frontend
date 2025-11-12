// src/pages/Checkout.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

type SavedItem = {
  product: { id: number; name: string; price: number; image?: string };
  quantity: number;
};
type LocationState = { items: SavedItem[]; subtotal: number; total: number };

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function Checkout() {
  const { state } = useLocation() as { state: Partial<LocationState> | null };
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const items = state?.items ?? [];
  const subtotal = Number(state?.subtotal ?? 0);
  const total = Number(state?.total ?? 0);

  useEffect(() => {
    if (!items.length) navigate("/cart", { replace: true });
  }, [items.length, navigate]);

  const canConfirm = useMemo(() => items.length > 0 && !placing, [items.length, placing]);

  const payload = useMemo(
    () => items.map((i) => ({ product: i.product.id, quantity: i.quantity })),
    [items]
  );

  const confirm = async () => {
    if (!canConfirm) return;
    setPlacing(true);
    try {
      const res = await api.post("/orders/", { items: payload, total });
      const orderId = res?.data?.id ?? Date.now();
      navigate("/checkout/success", {
        replace: true,
        state: { orderId, items, subtotal, total },
      });
    } catch (e: any) {
      alert(e?.response?.data?.detail || "No se pudo procesar la compra");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full blur-3xl opacity-20 bg-lightAccentCreative dark:bg-darkAccentCreative" />
          <div className="absolute -bottom-28 -right-28 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-lightAccentPrimary dark:bg-darkAccentPrimary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold">Confirmar compra</h1>
          <p className="mt-2 text-lightSecondary dark:text-darkSecondary">
            Revisa tu pedido antes de pagar.
          </p>
        </div>
      </section>

      {/* Resumen */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-3xl border border-lightSecondary/15 dark:border-darkSecondary/15 overflow-hidden">
          <ul className="divide-y divide-lightSecondary/10 dark:divide-darkSecondary/10">
            {items.map((item) => (
              <li key={item.product.id} className="p-5 sm:p-6 flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-lightSecondary/10 dark:bg-darkSecondary/30" />
                <div className="flex-1">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-lightSecondary dark:text-darkSecondary">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <div className="font-semibold">
                  {money.format(Number(item.product.price) * item.quantity)}
                </div>
              </li>
            ))}
          </ul>
          <div className="p-6 space-y-2 border-t border-lightSecondary/10 dark:border-darkSecondary/10">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">{money.format(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="text-xl font-bold">{money.format(total)}</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/products"
            className="h-12 rounded-xl font-medium border border-lightSecondary/30 hover:bg-lightSecondary/10
                       text-center flex items-center justify-center
                       dark:border-darkSecondary/30 dark:hover:bg-darkSecondary/20"
          >
            Seguir comprando
          </Link>
          <button
            onClick={confirm}
            disabled={!canConfirm}
            aria-busy={placing || undefined}
            className="h-12 rounded-xl font-semibold bg-lightAccentPrimary text-lightBackground hover:opacity-90 disabled:opacity-60
                       dark:bg-darkAccentPrimary dark:text-darkText"
          >
            {placing ? "Procesando..." : "Confirmar compra"}
          </button>
        </div>
      </section>
    </div>
  );
}
