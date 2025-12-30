export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  image: string;
  rating: number;
  stock: number;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
