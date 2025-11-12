// scripts/seed-products.mjs
import axios from "axios";

// --------- CONFIG ---------
const RAW = process.env.VITE_API_URL || "http://127.0.0.1:8000/api/";
const baseURL = RAW.replace(/\/+$/, "") + "/"; // normaliza un solo slash al final
const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});
// quita "/" inicial para evitar "//"
api.interceptors.request.use((cfg) => {
  if (typeof cfg.url === "string" && cfg.url.startsWith("/")) {
    cfg.url = cfg.url.slice(1);
  }
  return cfg;
});

const money = (n) => Number(n.toFixed(2));
const img = (seed) => `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/600`;

// --------- DATA ---------
const PRODUCTS = [
  // Audio (5)
  { name: "Auriculares Quantum Nova",         price: 79.90,  image: img("audio-quantum-nova"),   category: "Audio",        is_featured: true  },
  { name: "Barra de Sonido Eclipse 2.1",      price: 149.00, image: img("audio-eclipse-21"),     category: "Audio",        is_featured: false },
  { name: "Parlante Nómada Storm",            price: 59.00,  image: img("audio-nomada-storm"),   category: "Audio",        is_featured: false },
  { name: "Micrófono Cardinal Studio USB",    price: 89.00,  image: img("audio-cardinal-mic"),   category: "Audio",        is_featured: true  },
  { name: "Audífonos Orion Over-Ear Pro",     price: 109.00, image: img("audio-orion-pro"),      category: "Audio",        is_featured: false },

  // Computadores (5)
  { name: "Ultrabook Atlas 13” Carbon",       price: 949.00, image: img("comp-atlas-13-carbon"), category: "Computadores", is_featured: true  },
  { name: "Workstation Aether 15” Creator",   price: 1299.0, image: img("comp-aether-15"),       category: "Computadores", is_featured: false },
  { name: "Mini PC Nebula SFF",               price: 529.00, image: img("comp-nebula-sff"),      category: "Computadores", is_featured: false },
  { name: "All-in-One Solaris 24” 1080p",     price: 829.00, image: img("comp-solaris-aio-24"),  category: "Computadores", is_featured: false },
  { name: "Chromebook Flux 14”",              price: 389.00, image: img("comp-flux-14"),         category: "Computadores", is_featured: true  },

  // Accesorios (5)
  { name: "Mouse ErgoWave Inalámbrico",       price: 27.90,  image: img("acc-ergowave-mouse"),   category: "Accesorios",   is_featured: false },
  { name: "Teclado Mecánico Vortex 75%",      price: 92.00,  image: img("acc-vortex-75"),        category: "Accesorios",   is_featured: true  },
  { name: "Base CryoCore para Laptop",        price: 33.00,  image: img("acc-cryocore-stand"),   category: "Accesorios",   is_featured: false },
  { name: "Hub USB-C Helix 7-en-1",           price: 45.00,  image: img("acc-helix-hub-7"),      category: "Accesorios",   is_featured: true  },
  { name: "Funda Nebulose 15”",               price: 21.50,  image: img("acc-nebulose-sleeve"),  category: "Accesorios",   is_featured: false },

  // Gaming (5)
  { name: "Control Pro X Specter",            price: 74.00,  image: img("gam-specter-pad"),      category: "Gaming",       is_featured: true  },
  { name: "Headset Valkyrie 7.1",             price: 99.00,  image: img("gam-valkyrie-headset"), category: "Gaming",       is_featured: false },
  { name: "Silla NovaStrike RGB",             price: 229.00, image: img("gam-novastrike-chair"), category: "Gaming",       is_featured: false },
  { name: "Mouse HyperFlux RGB",              price: 39.00,  image: img("gam-hyperflux-mouse"),  category: "Gaming",       is_featured: false },
  { name: "Teclado Óptico TKL Phantom",       price: 119.00, image: img("gam-phantom-tkl"),      category: "Gaming",       is_featured: true  },

  // Oficina (5)
  { name: "Impresora AeroJet Wi-Fi A4",       price: 159.00, image: img("ofc-aerojet-a4"),       category: "Oficina",      is_featured: false },
  { name: "Scanner Portátil SwiftScan",       price: 109.00, image: img("ofc-swiftscan"),        category: "Oficina",      is_featured: false },
  { name: "Webcam Polaris 1080p",             price: 49.00,  image: img("ofc-polaris-webcam"),   category: "Oficina",      is_featured: true  },
  { name: "Dock Titan Dual HDMI",             price: 139.00, image: img("ofc-titan-dock"),       category: "Oficina",      is_featured: false },
  { name: "Lámpara ArcLight LED",             price: 26.00,  image: img("ofc-arclight-led"),     category: "Oficina",      is_featured: false },

  // Viaje (5)
  { name: "Mochila Sentinel 20L Antirrobo",   price: 62.00,  image: img("via-sentinel-20l"),     category: "Viaje",        is_featured: true  },
  { name: "Power Bank 20.000 mAh Terra",      price: 44.90,  image: img("via-terra-20000"),      category: "Viaje",        is_featured: false },
  { name: "Adaptador Global OmniPlug",        price: 26.00,  image: img("via-omniplug"),         category: "Viaje",        is_featured: false },
  { name: "Organizador Cables GridPack",      price: 14.00,  image: img("via-gridpack"),         category: "Viaje",        is_featured: false },
  { name: "Balanza Digital AeroScale",        price: 17.00,  image: img("via-aeroscale"),        category: "Viaje",        is_featured: false },
].map(p => ({ ...p, price: money(p.price) }));

// --------- RUN ---------
async function main() {
  console.log(`Usando baseURL: ${baseURL}`);
  // Lee los existentes y evita duplicar por nombre (case-insensitive)
  const { data: existing } = await api.get("products/");
  const existingNames = new Set(
    (Array.isArray(existing) ? existing : []).map((p) => String(p.name).toLowerCase())
  );

  let created = 0, skipped = 0, errors = 0;
  for (const p of PRODUCTS) {
    if (existingNames.has(p.name.toLowerCase())) {
      skipped++;
      continue;
    }
    try {
      await api.post("products/", p);
      created++;
      console.log(`✓ creado: ${p.name}`);
    } catch (e) {
      errors++;
      const msg = e?.response?.data ?? e?.message ?? e;
      console.warn(`⚠️  error creando "${p.name}":`, msg);
    }
  }

  console.log("\nResumen:");
  console.log(`- Nuevos:  ${created}`);
  console.log(`- Omitidos (ya existían): ${skipped}`);
  console.log(`- Errores: ${errors}`);
}

main().catch((e) => {
  console.error("Fallo al sembrar datos:", e?.message ?? e);
  process.exit(1);
});
