// src/components/ui/Card.tsx
import React, { PropsWithChildren } from "react";

type ElementTag = keyof JSX.IntrinsicElements;

type BaseProps = {
  className?: string;

  as?: ElementTag;
 
  clickable?: boolean;
 
  variant?: "surface" | "muted";

  elevateOnHover?: boolean;
};

type PolymorphicProps<T extends ElementTag> = PropsWithChildren<
  BaseProps & Omit<JSX.IntrinsicElements[T], "className" | "children">
>;


export default function Card<T extends ElementTag = "div">({
  children,
  className = "",
  as,
  clickable = false,
  variant = "surface",
  elevateOnHover = false,
  ...rest
}: PolymorphicProps<T>) {
  const Tag = (as || "div") as ElementTag;

  const isNativeInteractive =
    Tag === "a" || Tag === "button" || Tag === "label" || Tag === "input";

  const base =
    "rounded-2xl border p-5 transition-colors " +
    // foco visible accesible
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-lightAccentPrimary " +
    "dark:focus-visible:ring-darkAccentPrimary " +
    // sombras suaves
    "shadow-sm " +
    (elevateOnHover ? "hover:shadow-md motion-safe:transition-shadow " : "");

  const variants: Record<BaseProps["variant"], string> = {
    surface:
      "border-lightSecondary/20 bg-lightSecondary/5 " +
      "dark:border-darkSecondary/20 dark:bg-darkSecondary/20",
    muted:
      "border-lightSecondary/10 bg-lightSecondary/5 " +
      "dark:border-darkSecondary/10 dark:bg-darkSecondary/10",
  };

  const hoverStyles = clickable
    ? "hover:border-lightSecondary/40 dark:hover:border-darkSecondary/40 cursor-pointer"
    : "";

  const interactiveFallbackProps =
    clickable && !isNativeInteractive
      ? ({
          role: "button",
          tabIndex: 0,
          onKeyDown: (e: React.KeyboardEvent) => {
            // activa con Enter/Espacio si hay onClick en props
            const anyRest = rest as any;
            if (!anyRest.onClick) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              anyRest.onClick(e as any);
            }
          },
        } as const)
      : {};

  return (
    <Tag
      className={`${base} ${variants[variant]} ${hoverStyles} ${className}`}
      {...interactiveFallbackProps}
      {...(rest as any)}
    >
      {children}
    </Tag>
  );
}
