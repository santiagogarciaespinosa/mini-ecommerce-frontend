// src/pages/__tests__/Cart.behavior.test.tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

// axios hoisted
const axiosInstance = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  interceptors: { request: { use: vi.fn() } },
}));
vi.mock("axios", () => {
  const create = () => axiosInstance;
  return { default: Object.assign(create, { create }), create };
});

function seedCart() {
  const state = {
    items: [
      { product: { id: 1, name: "Prod A", price: 10 }, quantity: 2 },
      { product: { id: 2, name: "Prod B", price: 5 }, quantity: 1 },
    ],
  };
  localStorage.setItem("cart", JSON.stringify(state));
}

import { CartProvider } from "../../context/CartContext";
import Cart from "../Cart";
import CartSaved from "../CartSaved";

function renderCart() {
  return render(
    <CartProvider>
      <MemoryRouter initialEntries={["/cart"]}>
        <Routes>
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/saved" element={<CartSaved />} />
        </Routes>
      </MemoryRouter>
    </CartProvider>
  );
}

test("calcula subtotales y total y permite editar cantidades", async () => {
  seedCart();
  renderCart();

  const rows = screen
    .getAllByRole("button", { name: /eliminar/i })
    .map((btn) => btn.closest("div")!);

  expect(within(rows[0]).getByText("$20.00")).toBeInTheDocument();
  expect(within(rows[1]).getByText("$5.00")).toBeInTheDocument();

  expect(screen.getByText("Total: $25.00")).toBeInTheDocument();

  const qtyInputs = screen.getAllByRole("spinbutton");
  await userEvent.clear(qtyInputs[1]);
  await userEvent.type(qtyInputs[1], "3");

  expect(screen.getByText("Total: $35.00")).toBeInTheDocument();
});

test("eliminar item actualiza el total", async () => {
  seedCart();
  renderCart();

  const delButtons = screen.getAllByRole("button", { name: /eliminar/i });
  await userEvent.click(delButtons[1]);

  expect(screen.queryByText("Prod B")).not.toBeInTheDocument();
  expect(screen.getByText("Total: $20.00")).toBeInTheDocument();
});

test("Guardar carrito hace POST /cart, limpia localStorage y navega a /cart/saved", async () => {
  seedCart();
  axiosInstance.post.mockResolvedValue({ status: 201, data: { id: 1 } });

  renderCart();
  await userEvent.click(screen.getByRole("button", { name: /guardar carrito/i }));

  expect(await screen.findByText(/Carrito guardado correctamente/i)).toBeInTheDocument();

  expect(axiosInstance.post).toHaveBeenCalledWith("/cart/", [
    { product: 1, quantity: 2 },
    { product: 2, quantity: 1 },
  ]);

  expect(localStorage.getItem("cart")).toBeNull();
});
