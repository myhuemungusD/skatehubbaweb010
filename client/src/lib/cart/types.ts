export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartSnapshot = {
  items: CartItem[];
  subtotal: number;
  count: number;
};
