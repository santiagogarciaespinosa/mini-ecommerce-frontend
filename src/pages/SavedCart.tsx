import { loadCartSnapshot, clearCartSnapshot } from "../utils/cartSnapshot";

const money = (n: number | string) => `$${Number(n).toFixed(2)}`;

export default function SavedCart() {
  const snap = loadCartSnapshot();

  if (!snap || !snap.items.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Carrito guardado</h1>
        <p className="text-lightSecondary dark:text-darkSecondary">No tienes un carrito guardado.</p>
      </div>
    );
  }

  const total = snap.items.reduce(
    (sum, it) => sum + Number(it.price) * it.quantity, 0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Carrito guardado</h1>
        <button
          onClick={() => { clearCartSnapshot(); location.reload(); }}
          className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30"
        >
          Borrar snapshot
        </button>
      </div>
      <p className="text-sm text-lightSecondary dark:text-darkSecondary mb-4">
        Guardado: {new Date(snap.savedAt).toLocaleString()}
      </p>

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
            {snap.items.map((it) => (
              <tr key={it.id}>
                <td className="p-3">{it.name}</td>
                <td className="p-3">{money(it.price)}</td>
                <td className="p-3">{it.quantity}</td>
                <td className="p-3 text-right">{money(Number(it.price) * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="p-3" colSpan={3}><strong>Total</strong></td>
              <td className="p-3 text-right"><strong>{money(total)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
