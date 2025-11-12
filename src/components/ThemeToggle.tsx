import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);
/*
  No alcanse a implementar el toggle de tema en esta versión.
  return (
    <button
      onClick={() => setDark(!dark)}
      className="border border-light-secondary dark:border-dark-secondary px-3 py-1 rounded-md hover:opacity-80 transition"
    >
      {dark ? "Modo Claro" : "Modo Oscuro"}
    </button>
  );
  */
}
