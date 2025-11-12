// src/components/ui/Button.tsx
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "creative" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  className = "",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium transition-colors " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles: Record<string, string> = {
    primary:
      "bg-lightAccentPrimary text-lightBackground hover:opacity-90 " +
      "dark:bg-darkAccentPrimary dark:text-darkText focus:ring-lightAccentPrimary dark:focus:ring-darkAccentPrimary",
    creative:
      "bg-lightAccentCreative text-white hover:opacity-90 " +
      "dark:bg-darkAccentCreative focus:ring-lightAccentCreative dark:focus:ring-darkAccentCreative",
    ghost:
      "border border-lightSecondary/40 text-lightText hover:bg-lightSecondary/10 " +
      "dark:border-darkSecondary/40 dark:text-darkText dark:hover:bg-darkSecondary/20",
  };

  return (
    <button
      className={`${base} ${styles[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin mr-2"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" />
          </svg>
          Cargando…
        </>
      ) : (
        children
      )}
    </button>
  );
}
