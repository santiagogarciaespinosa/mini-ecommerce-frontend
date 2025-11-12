export type CartSnapshotItem = {
  id: number; // product id
  name: string;
  price: number | string;
  image?: string | null;
  quantity: number;
};

const KEY = "savedCartSnapshot:v1";

export function saveCartSnapshot(items: CartSnapshotItem[]) {
  const payload = {
    savedAt: new Date().toISOString(),
    items,
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
}

export function loadCartSnapshot():
  | { savedAt: string; items: CartSnapshotItem[] }
  | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearCartSnapshot() {
  localStorage.removeItem(KEY);
}
