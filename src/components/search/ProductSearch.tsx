// src/components/search/ProductSearch.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import useDebouncedValue from "@/hooks/useDebouncedValue";

export type SearchItem = {
  id: string | number;
  name: string;
  category?: string | null;
  image?: string | null;
};

type Props = {
  items?: SearchItem[];
  onSubmit: (query: string) => void;
  onSelect?: (item: SearchItem) => void;
  onClear?: () => void;            
  placeholder?: string;
  defaultQuery?: string;
  fetchSuggestions?: (q: string) => Promise<SearchItem[]>;
};

export default function ProductSearch({
  items = [],
  onSubmit,
  onSelect,
  onClear,
  placeholder = "Buscar productos…",
  defaultQuery = "",
  fetchSuggestions,
}: Props) {
  const [query, setQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debounced = useDebouncedValue(query, 120);

  // sincroniza cuando cambia la query externa (desde URL)
  useEffect(() => {
    setQuery(defaultQuery);
    setOpen(false);
  }, [defaultQuery]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!debounced.trim()) {
        setSuggestions([]);
        setOpen(false);
        return;
      }

      if (fetchSuggestions) {
        const remote = await fetchSuggestions(debounced);
        if (!active) return;
        setSuggestions(remote.slice(0, 8));
        setOpen(remote.length > 0);
      } else {
        const q = debounced.toLowerCase();
        const res = items
          .filter(
            (i) =>
              i?.name?.toLowerCase().includes(q) ||
              (i?.category ?? "")?.toString().toLowerCase().includes(q)
          )
          .slice(0, 8);
        setSuggestions(res);
        setOpen(res.length > 0);
      }
      setHighlight(0);
    };

    run();
    return () => {
      active = false;
    };
  }, [debounced, items, fetchSuggestions]);

  const submit = (q: string) => {
    const value = q.trim();
    if (!value) return;
    onSubmit(value);
    setOpen(false);
    inputRef.current?.blur();
  };

  const clearAll = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onClear?.();
    inputRef.current?.blur();
  };

  const select = (item: SearchItem) => {
    onSelect?.(item);
    onSubmit(item.name);
    setOpen(false);
    inputRef.current?.blur();
  };

  const highlightedId = useMemo(
    () => (open && suggestions[highlight] ? `opt-${suggestions[highlight].id}` : undefined),
    [open, suggestions, highlight]
  );

  return (
    <div className="relative w-full max-w-2xl">
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-owns="search-suggestions"
        aria-expanded={open}
        aria-controls="search-suggestions"
        aria-activedescendant={highlightedId}
        className="w-full"
      >
        <div className="flex items-center gap-2 rounded-2xl border border-lightSecondary/25 dark:border-darkSecondary/25 bg-white dark:bg-darkSurface px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-lightAccentPrimary/40 dark:focus-within:ring-darkAccentPrimary/40">
          <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-70">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>

          <input
            ref={inputRef}
            type="search"
            className="w-full bg-transparent outline-none placeholder:text-lightSecondary dark:placeholder:text-darkSecondary text-sm sm:text-base"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(Boolean(e.target.value.trim()));
            }}
            onFocus={() => setOpen(Boolean(suggestions.length))}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
                setHighlight((h) => Math.min(h + 1, Math.max(0, suggestions.length - 1)));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlight((h) => Math.max(0, h - 1));
              } else if (e.key === "Enter") {
                if (open && suggestions[highlight]) {
                  e.preventDefault();
                  select(suggestions[highlight]);
                } else {
                  submit(query);
                }
              } else if (e.key === "Escape") {
                // limpiar rápido con Esc
                e.preventDefault();
                clearAll();
              }
            }}
            aria-label="Buscar productos"
          />

          {/* Botón Limpiar visible cuando hay texto */}
          {query.trim() && (
            <button
              type="button"
              onClick={clearAll}
              aria-label="Limpiar búsqueda"
              className="rounded-xl px-3 py-2 text-sm font-medium border border-lightSecondary/25 dark:border-darkSecondary/25 hover:bg-lightSecondary/10 dark:hover:bg-darkSecondary/20"
            >
              Limpiar
            </button>
          )}

          <button
            onClick={() => submit(query)}
            className="shrink-0 rounded-xl px-3 py-2 text-sm font-medium bg-lightAccentPrimary text-white dark:bg-darkAccentPrimary hover:brightness-105 disabled:opacity-50"
            disabled={!query.trim()}
          >
            Buscar
          </button>
        </div>

        {open && suggestions.length > 0 && (
          <ul
            id="search-suggestions"
            role="listbox"
            className="absolute z-50 mt-2 w-full rounded-2xl border border-lightSecondary/25 dark:border-darkSecondary/25 bg-white dark:bg-darkSurface shadow-lg overflow-hidden"
          >
            {suggestions.map((s, i) => {
              const active = i === highlight;
              return (
                <li
                  id={`opt-${s.id}`}
                  role="option"
                  aria-selected={active}
                  key={s.id}
                  className={[
                    "flex items-center gap-3 px-3 py-2 cursor-pointer",
                    active ? "bg-lightSecondary/10 dark:bg-darkSecondary/20" : "hover:bg-lightSecondary/10 dark:hover:bg-darkSecondary/20",
                  ].join(" ")}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    select(s);
                  }}
                >
                  {s.image ? (
                    <img
                      src={String(s.image)}
                      alt=""
                      className="h-8 w-8 rounded object-cover border border-lightSecondary/20 dark:border-darkSecondary/20"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded grid place-content-center text-xs border border-lightSecondary/20 dark:border-darkSecondary/20 text-lightSecondary dark:text-darkSecondary">
                      {s.name.slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{highlightMatch(s.name, query)}</p>
                    {s.category ? (
                      <p className="text-xs text-lightSecondary dark:text-darkSecondary truncate">
                        {s.category}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function highlightMatch(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  const before = text.slice(0, i);
  const match = text.slice(i, i + q.length);
  const after = text.slice(i + q.length);
  return (
    <>
      {before}
      <mark className="bg-yellow-200/60 dark:bg-yellow-300/40 rounded px-0.5">{match}</mark>
      {after}
    </>
  );
}
