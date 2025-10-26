import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartSnapshot } from "./types";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  snapshot: () => CartSnapshot;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const found = s.items.find((i) => i.id === item.id);
          if (found) {
            return {
              items: s.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i))
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      snapshot: () => {
        const items = get().items;
        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const count = items.reduce((n, i) => n + i.quantity, 0);
        return { items, subtotal, count };
      },
    }),
    { name: "skatehubba-cart" }
  )
);
