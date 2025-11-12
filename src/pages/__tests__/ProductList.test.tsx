// src/pages/__tests__/ProductList.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// axios hoisted + create()
const axiosInstance = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  interceptors: { request: { use: vi.fn() } },
}));
vi.mock("axios", () => {
  const create = () => axiosInstance;
  return { default: Object.assign(create, { create }), create };
});

import { ProductsProvider } from "../../context/ProductsContext";
import { CartProvider } from "../../context/cartContext";
import ProductList from "../ProductList";

test("muestra productos con nombre, precio y botón Agregar", async () => {
  axiosInstance.get.mockResolvedValue({
    data: [
      { id: 1, name: "Prod A", price: 10 },
      { id: 2, name: "Prod B", price: 20 },
    ],
  });

  render(
    <MemoryRouter initialEntries={["/products"]}>
      <CartProvider>
        <ProductsProvider>
          <ProductList />
        </ProductsProvider>
      </CartProvider>
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText("Prod A")).toBeInTheDocument();
    expect(screen.getByText("$10.00")).toBeInTheDocument();
  });

  expect(screen.getAllByRole("button", { name: /agregar/i })).toHaveLength(2);
  expect(axiosInstance.get).toHaveBeenCalledWith("products/");
});
