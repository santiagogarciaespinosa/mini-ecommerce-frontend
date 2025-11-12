import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import CartSaved from "./pages/CartSaved";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import AdminProducts from "./pages/AdminProducts";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ThemeToggle from "./components/ThemeToggle";
import FloatingCartButton from "./components/cart/FloatingCartButton"; // <-- nuevo

function App() {
  return (
    <CartProvider>
      <ProductsProvider>
        <BrowserRouter>
          <nav className="bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText p-4 flex justify-between items-center shadow-md border-b border-lightSecondary dark:border-darkSecondary">
            <div className="flex gap-6 font-medium">
              <Link
                to="/"
                className="hover:text-lightAccentCreative dark:hover:text-darkAccentCreative transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/products"
                className="hover:text-lightAccentCreative dark:hover:text-darkAccentCreative transition-colors"
              >
                Productos
              </Link>

              <Link
                to="/admin/products"
                className="hover:text-lightAccentCreative dark:hover:text-darkAccentCreative transition-colors"
              >
                Admin productos
              </Link>
            </div>
            <ThemeToggle />
          </nav>

          <main className="min-h-screen bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText transition-colors">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/cart/saved" element={<CartSaved />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/admin/products" element={<AdminProducts />} />
            </Routes>
          </main>

          {/* Botón flotante del carrito */}
          <FloatingCartButton />
        </BrowserRouter>
      </ProductsProvider>
    </CartProvider>
  );
}

export default App;
