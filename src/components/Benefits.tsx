// src/components/Benefits.tsx
type Benefit = { title: string; text: string; icon?: "shipping" | "returns" | "secure" | "support" };

const DEFAULTS: Benefit[] = [
  { title: "Envío gratis", text: "Pedidos desde $100", icon: "shipping" },
  { title: "Devoluciones", text: "30 días", icon: "returns" },
  { title: "Pagos seguros", text: "Protección total", icon: "secure" },
  { title: "Atención 24/7", text: "Siempre disponibles", icon: "support" },
];

export default function Benefits({ items = DEFAULTS }: { items?: Benefit[] }) {
  return (
    <section aria-labelledby="benefits-title">
      <h2 id="benefits-title" className="text-2xl sm:text-3xl font-bold mb-6">
        Beneficios de elegirnos
      </h2>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((b) => (
          <article
            key={b.title}
            className="group rounded-2xl border border-lightSecondary/15 dark:border-darkSecondary/15 p-5 sm:p-6
                       bg-white/40 dark:bg-black/20 backdrop-blur
                       hover:shadow-md transition
                       focus-within:ring-2 focus-within:ring-lightAccentPrimary dark:focus-within:ring-darkAccentPrimary"
          >
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center
                         bg-lightAccentPrimary/15 dark:bg-darkAccentPrimary/20
                         ring-1 ring-lightAccentPrimary/20 dark:ring-darkAccentPrimary/30
                         mb-4"
              aria-hidden="true"
            >
              <Icon name={b.icon} />
            </div>

            <h3 className="font-semibold leading-tight">{b.title}</h3>
            <p className="mt-1 text-sm text-lightSecondary dark:text-darkSecondary">{b.text}</p>

            <span
              className="mt-4 block h-[2px] w-0 group-hover:w-full group-focus-within:w-full
                         transition-all rounded bg-lightAccentPrimary dark:bg-darkAccentPrimary"
              aria-hidden="true"
            />
          </article>
        ))}
      </div>
    </section>
  );
}

function Icon({ name }: { name?: Benefit["icon"] }) {
  // Íconos inline (sin dependencias). Solo decorativos.
  switch (name) {
    case "shipping":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-80">
          <path
            d="M3 7h11v7h-1.5a2.5 2.5 0 0 0-2.45 2H7.95A2.5 2.5 0 0 0 5.5 14.5H3V7zm11 2h3l3 3v2h-3.05A2.5 2.5 0 0 0 14.5 17H14V9z"
            fill="currentColor"
          />
        </svg>
      );
    case "returns":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-80">
          <path
            d="M12 5V2L7 7l5 5V9c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6c-2.21 0-4.15-1.2-5.19-3H4.9A8.002 8.002 0 0 0 20 15c0-4.42-3.58-8-8-8z"
            fill="currentColor"
          />
        </svg>
      );
    case "secure":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-80">
          <path
            d="M12 2l7 3v6c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V5l7-3zm-1 14l6-6-1.41-1.41L11 12.17l-2.59-2.58L7 11l4 5z"
            fill="currentColor"
          />
        </svg>
      );
    case "support":
    default:
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" className="opacity-80">
          <path
            d="M12 2a7 7 0 0 0-7 7v3a3 3 0 0 0 3 3h1v-6H7a5 5 0 0 1 10 0h-2v6h2a3 3 0 0 0 3-3V9a7 7 0 0 0-7-7zm-1 16h2v2h-2z"
            fill="currentColor"
          />
        </svg>
      );
  }
}
