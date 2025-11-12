// src/pages/AdminProducts.tsx
import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import type { Product } from "../types";
import ProductForm, { type FormState as CreateFormState } from "../components/admin/ProductForm";
import ProductCardsMobile from "../components/admin/ProductCardsMobile";
import ProductListTable from "../components/admin/ProductListTable";
import FilterBar from "../components/admin/FilterBar";
import Pagination from "../components/common/Pagination";
import { CATEGORIES } from "../components/constants/categories";

// Formato original: $ y 2 decimales
const money = (n: number | string) => `$${Number(n).toFixed(2)}`;
const formatMoney = (n: number) => money(n);

export default function AdminProducts() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Product | null>(null);

  // Filtros y paginación (cliente)
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);           // 1-based
  const [pageSize, setPageSize] = useState(10);

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Product[]>("products/");
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // Resetear a pág. 1 cuando cambian los filtros
  useEffect(() => {
    setPage(1);
  }, [search, category, featuredOnly, pageSize]);

  // Filtrado en memoria
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      const bySearch =
        !q ||
        String(p.name || "").toLowerCase().includes(q) ||
        String(p.category || "").toLowerCase().includes(q);
      const byCategory = !category || String(p.category || "") === category;
      const byFeatured = !featuredOnly || !!p.is_featured;
      return bySearch && byCategory && byFeatured;
    });
  }, [items, search, category, featuredOnly]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  // Crear desde ProductForm
  const onCreate = async (form: CreateFormState) => {
    const body = {
      name: form.name.trim(),
      price: Number(form.price),
      image: form.image.trim(),
      category: form.category.trim(),
      is_featured: !!form.is_featured,
    };
    if (!body.name || !Number.isFinite(body.price)) return;
    await api.post("products/", body);
    await load();
  };

  // Guardar edición inline
  const onUpdate = async () => {
    if (!editing) return;
    const body = {
      name: String(editing.name).trim(),
      price: Number(editing.price),
      image: (editing as any).image?.toString?.() ?? "",
      category: ((editing as any).category ?? "").toString(),
      is_featured: !!editing.is_featured,
    };
    if (!body.name || !Number.isFinite(body.price)) return;
    await api.put(`products/${editing.id}/`, body);
    setEditing(null);
    await load();
  };

 const onDelete = async (id: number) => {
  if (!confirm("¿Eliminar producto?")) return;

  try {
    await api.delete(`products/${id}/`); // DRF con slash final
  } catch (e: any) {
    const status = e?.response?.status;
    const detail =
      e?.response?.data?.detail ||
      e?.response?.data?.message ||
      e?.message ||
      "Error eliminando";

    // Muestra mensaje claro (ej. 409 por PROTECT)
    alert(`No se pudo eliminar (${status ?? "?"}): ${detail}`);
    return;
  }

  await load();
};


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold mb-6">Admin · Productos</h1>

      {/* Crear */}
      <div className="mb-6">
        <ProductForm onSubmit={onCreate} categories={CATEGORIES as readonly string[]} />
      </div>

      {/* Filtros */}
      <FilterBar
        search={search}
        onSearch={setSearch}
        category={category}
        onCategory={setCategory}
        featuredOnly={featuredOnly}
        onFeaturedOnly={setFeaturedOnly}
        pageSize={pageSize}
        onPageSize={setPageSize}
        categories={CATEGORIES as readonly string[]}
      />

      {/* Móvil: tarjetas */}
      <div className="md:hidden">
        <ProductCardsMobile
          items={pageItems}
          loading={loading}
          formatMoney={formatMoney}
          editing={editing}
          setEditing={setEditing}
          onSave={onUpdate}
          onDelete={onDelete}
        />
      </div>

      {/* Desktop: tabla */}
      <div className="hidden md:block">
        <ProductListTable
          items={pageItems}
          loading={loading}
          money={money as (n: number) => string}
          categories={CATEGORIES as readonly string[]}
          editing={editing}
          setEditing={setEditing}
          onSave={onUpdate}
          onDelete={onDelete}
        />
      </div>

      {/* Paginación */}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPage={setPage}
      />
    </div>
  );
}
