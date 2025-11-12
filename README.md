🛍️ Mini Ecommerce – Frontend (React + Vite + TypeScript + Tailwind)

Aplicación frontend para una tienda tipo mini-ecommerce.
Incluye catálogo, carrito con guardado rápido (snapshot local + POST al backend), checkout simulado y panel de administración responsive (tabla en desktop y tarjetas en móvil).

Backend esperado: Django REST Framework (DRF) sirviendo en http://127.0.0.1:8000/api/

🧩 Stack Tecnológico

⚛️ React 18 + TypeScript

⚡ Vite (HMR)

🎨 Tailwind CSS (modo claro/oscuro)

🧭 React Router v6 (SPA)

🌐 Axios (HTTP)

🧠 Context API (carrito y catálogo)

💰 Intl.NumberFormat para formatMoney (COP)

🚀 Arranque rápido
⚙️ Requisitos

Node.js 18+

npm / pnpm / yarn

Backend DRF corriendo en http://127.0.0.1:8000
 (ver “Backend mínimo”)

📦 Clonar e instalar

git clone https://github.com/santiagogarciaespinosa/mini-ecommerce-frontend.git
cd frontend
npm install

🔐 Variables de entorno

Crea un archivo .env dentro de frontend/ con:

VITE_API_URL=http://127.0.0.1:8000/api/

Si no defines la variable, se usa por defecto http://127.0.0.1:8000/api/
.

▶️ Ejecutar en desarrollo

npm run dev
Abre en el navegador: http://localhost:5173

🩺 Health check del backend

Con el backend en ejecución:

curl -i http://127.0.0.1:8000/api/products/

Debe responder con estado 200 y un array JSON.

curl -i -X POST http://127.0.0.1:8000/api/cart/
 -H "Content-Type: application/json" -d '[]'
Debe responder con 201 (creación correcta del carrito).

🌱 Datos iniciales (seed) y reseteo

Los scripts se encuentran en frontend/scripts/ y usan la variable VITE_API_URL si está definida.

🌾 Sembrar productos

Desde la carpeta frontend/ ejecutar:
node scripts/seed-products.mjs

Inserta productos de ejemplo vía POST /api/products/ y evita duplicados por nombre.

Para apuntar a otra API:
VITE_API_URL=http://127.0.0.1:8001/api/
 node scripts/seed-products.mjs

🧹 Resetear productos

Desde la carpeta frontend/ ejecutar:
node scripts/reset-products.mjs

Este script hace GET /api/products/ y luego DELETE /api/products/:id.
Si el backend protege por integridad (productos en órdenes), verás advertencias y esos ítems no se eliminarán (o se aplicará soft delete según configuración).

🧰 Atajos (opcional vía npm)

Agrega en frontend/package.json:

{
"scripts": {
"seed:products": "node scripts/seed-products.mjs",
"reset:products": "node scripts/reset-products.mjs"
}
}

Luego podrás ejecutar directamente:
npm run seed:products
npm run reset:products

🧱 Estructura del proyecto

frontend/

src/

components/

admin/

ProductCardsMobile.tsx → UI móvil – tarjetas y edición
ProductListTable.tsx → UI desktop – tabla y edición
ProductForm.tsx → Crear productos

cart/

QtyControl.tsx
ThemeToggle.tsx

context/

cartContext.tsx → Lógica add/update/remove/clear
ProductsContext.tsx → Fetch/cache productos

pages/

Home.tsx
ProductList.tsx
Cart.tsx → Guardar carrito + botón “Ver guardado”
CartSaved.tsx → Ver/restaurar snapshot guardado
Checkout.tsx
CheckoutSuccess.tsx
AdminProducts.tsx → Panel CRUD responsive

services/

api.ts → Axios con baseURL normalizado

utils/

formatMoney.ts → Formateo COP centralizado
cartSnapshot.ts → Snapshot en localStorage

constants/

categories.ts → Categorías canónicas

types.ts
App.tsx → Rutas SPA
main.tsx

scripts/

seed-products.mjs
reset-products.mjs

index.html
tailwind.config.js
vite.config.ts → Alias "@/..." → src

vite.config.ts → Alias "@/..." → src
🗺️ Rutas (SPA)

/ – Home
/products – Listado de productos
/cart – Carrito (cantidades, eliminar, Guardar carrito)
/cart/saved – Carrito guardado
 • Muestra snapshot desde location.state o localStorage
 • Restaurar al carrito / Restaurar y comprar / Borrar snapshot
/checkout – Checkout simulado
/checkout/success – Éxito
/admin/products – Panel admin (crear/editar/eliminar inline; responsive)

🔁 Flujo de carrito y guardado

En /cart, botón Guardar carrito:
• Realiza POST /api/cart/ con [{ product, quantity }]
• Guarda snapshot en localStorage (savedCartSnapshot:v1)
• Navega a /cart/saved con state

En /cart/saved:
• Restaurar al carrito → redirige a /cart
• Restaurar y comprar → redirige a /checkout
• Borrar snapshot → limpia y recarga

⚙️ Backend mínimo (referencia)

Endpoints sugeridos (DRF):
GET /api/products/
POST /api/products/
PUT /api/products/:id/
DELETE /api/products/:id/
POST /api/cart/ → acepta lista [{ "product": number, "quantity": number }]

Notas:
• Ante ProtectedError al eliminar producto, aplicar soft delete (is_active=false) y responder 204.
• CORS: permitir http://localhost:5173
.

🧠 Troubleshooting

• Alias @ no resuelve → revisa vite.config.ts y reinicia npm run dev.
• DELETE 500 (referencias en órdenes) → implementar soft delete o responder 409 con detail.
• location.reload is not a function en /cart/saved → usar navigate(0) (React Router v6).
• CORS bloqueado → habilitar http://localhost:5173
 en django-cors-headers.
• Ruta de carrito → este front usa POST /cart/; si tu backend usa /cartitems/, ajusta la URL o crea alias.

🧰 Scripts útiles (frontend)

npm run dev
npm run build
npm run preview
node scripts/seed-products.mjs
node scripts/reset-products.mjs
