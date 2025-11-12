// src/pages/__tests__/FloatingCartButton.test.tsx
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { CartProvider } from "../../context/cartContext";
import FloatingCartButton from "../../components/cart/FloatingCartButton";

function withCart(items: any[]) {
  localStorage.setItem("cart", JSON.stringify({ items }));
}

test("muestra la cantidad total y oculta en /cart", () => {
  withCart([
    { product: { id: 1, name: "A", price: 1 }, quantity: 2 },
    { product: { id: 2, name: "B", price: 1 }, quantity: 3 },
  ]);

  const { rerender } = render(
    <CartProvider>
      <MemoryRouter initialEntries={["/products"]}>
        <Routes>
          <Route path="/products" element={<FloatingCartButton />} />
          <Route path="/cart" element={<FloatingCartButton />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

  expect(screen.getByRole("link", { name: /abrir carrito/i })).toHaveTextContent("5");

  rerender(
    <CartProvider>
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<FloatingCartButton />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );

  expect(screen.queryByRole("link", { name: /abrir carrito/i })).toBeNull();
});
