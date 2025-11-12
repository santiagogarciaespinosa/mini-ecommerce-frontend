// src/pages/CheckoutSuccess.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

type SavedItem = {
  product: { id: number; name: string; price: number };
  quantity: number;
};
type State = { orderId: number | string; items: SavedItem[]; subtotal: number; total: number };

const money = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function CheckoutSuccess() {
  const { state } = useLocation() as { state: Partial<State> | null };
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.orderId) navigate("/", { replace: true });
  }, [state?.orderId, navigate]);

  const orderId = state?.orderId ?? "—";
  const hasSummary = typeof state?.total === "number";

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(String(orderId));
    } catch {
      /* sin ruido */
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center">
          <div className="h-24 w-24 rounded-full border-4 mx-auto border-lightAccentCreative dark:border-darkAccentCreative flex items-center justify-center">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2"
                className="text-lightAccentCreative dark:text-darkAccentCreative"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold">Compra realizada</h1>
          <p className="mt-2 text-lightSecondary dark:text-darkSecondary">
            Pedido&nbsp;#<span className="font-semibold">{orderId}</span>
          </p>
          <button
            onClick={copyId}
            className="mt-3 inline-flex items-center justify-center h-10 px-4 rounded-lg border border-lightSecondary/30 hover:bg-lightSecondary/10
                       dark:border-darkSecondary/30 dark:hover:bg-darkSecondary/20 text-sm"
            title="Copiar número de pedido"
          >
            Copiar número
          </button>
        </div>
      </section>

      {/* Resumen si existe */}
      {hasSummary && (
        <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="rounded-3xl border border-lightSecondary/15 dark:border-darkSecondary/15 overflow-hidden">
            <div className="p-6 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-semibold">{money.format(Number(state?.subtotal ?? 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold">{money.format(Number(state?.total ?? 0))}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Acciones */}
      <section className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/products"
            className="h-12 rounded-xl font-medium border border-lightSecondary/30 hover:bg-lightSecondary/10
                       text-center flex items-center justify-center
                       dark:border-darkSecondary/30 dark:hover:bg-darkSecondary/20"
          >
            Seguir comprando
          </Link>
          <Link
            to="/"
            className="h-12 rounded-xl font-semibold bg-lightAccentPrimary text-lightBackground hover:opacity-90
                       text-center flex items-center justify-center
                       dark:bg-darkAccentPrimary dark:text-darkText"
          >
            Ir al inicio
          </Link>
        </div>
      </section>
    </div>
  );
}
