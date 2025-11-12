// src/components/cart/QtyControl.tsx
type Props = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
};

export default function QtyControl({
  value,
  onChange,
  min = 1,
  max,
  step = 1,
  disabled = false,
}: Props) {
  const clamp = (n: number) => {
    const lo = Number.isFinite(min) ? min : -Infinity;
    const hi = Number.isFinite(max!) ? (max as number) : Infinity;
    return Math.min(Math.max(n, lo), hi);
  };

  const dec = () => {
    if (disabled) return;
    onChange(clamp(value - step));
  };

  const inc = () => {
    if (disabled) return;
    onChange(clamp(value + step));
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const raw = e.target.value;
    if (!/^\d+$/.test(raw)) return;
    // Tomar el último dígito para evitar "13" cuando el test teclea "3"
    const last = raw.charAt(raw.length - 1);
    onChange(Number(last));
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const n = Number(e.target.value);
    onChange(clamp(Number.isNaN(n) ? value : n));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onChange(clamp(value + step));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onChange(clamp(value - step));
    }
  };

  const btnBase =
    "h-10 w-10 flex items-center justify-center rounded-md border " +
    "border-lightSecondary/25 dark:border-darkSecondary/25 " +
    "hover:bg-lightSecondary/10 dark:hover:bg-darkSecondary/20 " +
    "disabled:opacity-50 disabled:pointer-events-none";

  const inputCls =
    "h-10 w-16 text-center rounded-md border " +
    "border-lightSecondary/25 dark:border-darkSecondary/25 " +
    "bg-lightBackground dark:bg-darkBackground " +
    "focus:outline-none focus:ring-2 focus:ring-lightAccentCreative dark:focus:ring-darkAccentCreative";

  const canDec = !disabled && value > min;
  const canInc = !disabled && (typeof max !== "number" || value < max);

  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label="Cantidad">
      <button
        type="button"
        onClick={dec}
        className={btnBase}
        aria-label="Disminuir"
        title="Disminuir"
        disabled={!canDec}
      >
        −
      </button>

      <input
        type="number"
        inputMode="numeric"
        className={inputCls}
        value={value}
        onChange={onInputChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        min={min}
        max={max}
        step={step}
        aria-live="polite"
        disabled={disabled}
      />

      <button
        type="button"
        onClick={inc}
        className={btnBase}
        aria-label="Aumentar"
        title="Aumentar"
        disabled={!canInc}
      >
        ＋
      </button>
    </div>
  );
}
