
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-lightSecondary/10 dark:border-darkSecondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <p className="font-semibold">Acerca de</p>
          <ul className="mt-3 space-y-2 text-sm text-lightSecondary dark:text-darkSecondary">
            <li>Inicio</li><li>Productos</li><li>Nosotros</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Servicios</p>
          <ul className="mt-3 space-y-2 text-sm text-lightSecondary dark:text-darkSecondary">
            <li>Envíos</li><li>Garantía</li><li>Soporte</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-lightSecondary dark:text-darkSecondary">
            <li>Correo</li><li>Instagram</li><li>Twitter</li>
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-sm text-lightSecondary dark:text-darkSecondary">© {new Date().getFullYear()} Tienda</p>
        </div>
      </div>
    </footer>
  );
}
