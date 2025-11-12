// scripts/reset-products.mjs
import axios from "axios";

const RAW = process.env.VITE_API_URL || "http://127.0.0.1:8000/api/";
const baseURL = RAW.replace(/\/+$/, "") + "/";
const api = axios.create({ baseURL, headers: { "Content-Type": "application/json" }, timeout: 20000 });
api.interceptors.request.use((cfg) => {
  if (typeof cfg.url === "string" && cfg.url.startsWith("/")) cfg.url = cfg.url.slice(1);
  const token = process.env.API_TOKEN; // opcional
  if (token) cfg.headers.Authorization = token;
  return cfg;
});

async function main() {
  console.log(`API: ${baseURL}products/`);
  const { data } = await api.get("products/");
  const list = Array.isArray(data) ? data : [];
  if (!list.length) return console.log("No hay productos para borrar.");
  let ok = 0, fail = 0;
  for (const p of list) {
    try { await api.delete(`products/${p.id}/`); ok++; console.log("BORRADO:", p.name); }
    catch (e) { fail++; console.warn("Error borrando", p.id, p.name, e?.response?.status || e?.message); }
  }
  console.log(`\nResumen -> borrados: ${ok} | fallidos: ${fail}`);
}
main().catch((e) => { console.error("Fallo al limpiar:", e?.message ?? e); process.exit(1); });
