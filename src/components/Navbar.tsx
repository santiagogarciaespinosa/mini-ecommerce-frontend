
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-lightSecondary/15 dark:border-darkSecondary/15 bg-lightBackground/80 dark:bg-darkBackground/80 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold tracking-wide">LOGO</Link>
        <ul className="hidden md:flex items-center gap-8">
          <li><a className="hover:text-lightAccentCreative dark:hover:text-darkAccentCreative" href="#">Inicio</a></li>
          <li><a className="hover:text-lightAccentCreative dark:hover:text-darkAccentCreative" href="#">Productos</a></li>
          <li><a className="hover:text-lightAccentCreative dark:hover:text-darkAccentCreative" href="#">Colecciones</a></li>
        </ul>
        {/* Toggle de tema (opcional si ya tienes uno global) */}
        {/* Coloca aquí tu ThemeToggle si lo usas */}
      </nav>
    </header>
  );
}
