export interface Product {
  id: number;
  name: string;
  price: number;
  image?: string | null;
  category?: string | null;
  is_featured?: boolean;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
