// src/components/common/Pagination.tsx

type Props = {
  page: number;           
  pageSize: number;
  total: number;        
  onPage: (p: number) => void;
};

export default function Pagination({ page, pageSize, total, onPage }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const disablePrev = page <= 1;
  const disableNext = page >= totalPages;

  // Helper para crear botones de página alrededor de la actual
  const neighbors = 1;
  const pages = [];
  const start = Math.max(1, page - neighbors);
  const end = Math.min(totalPages, page + neighbors);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div className="text-sm text-lightSecondary dark:text-darkSecondary">
        {total ? (
          <>
            Mostrando{" "}
            <strong>
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}
            </strong>{" "}
            de <strong>{total}</strong>
          </>
        ) : (
          "Sin resultados"
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => !disablePrev && onPage(1)}
          disabled={disablePrev}
          className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30 disabled:opacity-50"
          aria-label="Primera página"
          title="Primera"
        >
          «
        </button>
        <button
          onClick={() => !disablePrev && onPage(page - 1)}
          disabled={disablePrev}
          className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30 disabled:opacity-50"
          aria-label="Anterior"
          title="Anterior"
        >
          ‹
        </button>

        {start > 1 && <span className="px-1">…</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={[
              "h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30",
              p === page ? "bg-lightAccentPrimary text-lightBackground dark:bg-darkAccentPrimary dark:text-darkText" : ""
            ].join(" ")}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="px-1">…</span>}

        <button
          onClick={() => !disableNext && onPage(page + 1)}
          disabled={disableNext}
          className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30 disabled:opacity-50"
          aria-label="Siguiente"
          title="Siguiente"
        >
          ›
        </button>
        <button
          onClick={() => !disableNext && onPage(totalPages)}
          disabled={disableNext}
          className="h-9 px-3 rounded-lg border border-lightSecondary/30 dark:border-darkSecondary/30 disabled:opacity-50"
          aria-label="Última página"
          title="Última"
        >
          »
        </button>
      </div>
    </div>
  );
}
