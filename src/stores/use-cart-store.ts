import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { produce } from "immer";
import { create } from "zustand";

type CartItem = {
  id: string;
  title: string;
  size: string;
  size_id: string;
  variant: string;
  variant_id: string;
  qty: number;
  price: number;
  img: string;
};

type CartStoreType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string, variant_id: string, size_id: string) => void;
  updateQuantity: (
    id: string,
    variant_id: string,
    size_id: string,
    qty: number,
  ) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  loadFromStorage: () => void;
  saveToStorage: () => void;
};

const useCartStoreBase = create<CartStoreType>((set, get) => ({
  items: [],

  addItem: (item) => {
    set(
      produce<CartStoreType>((state) => {
        const existingItem = state.items.find(
          (i) =>
            i.id === item.id &&
            i.variant_id === item.variant_id &&
            i.size_id === item.size_id,
        );

        if (existingItem) {
          existingItem.qty += 1;
        } else {
          state.items.push({ ...item, qty: 1 });
        }

        state.saveToStorage();
      }),
    );
  },

  removeItem: (id, variant_id, size_id) => {
    set(
      produce<CartStoreType>((state) => {
        state.items = state.items.filter(
          (i) =>
            !(
              i.id === id &&
              i.variant_id === variant_id &&
              i.size_id === size_id
            ),
        );
        state.saveToStorage();
      }),
    );
  },

  updateQuantity: (id, variant_id, size_id, qty) => {
    set(
      produce<CartStoreType>((state) => {
        const item = state.items.find(
          (i) =>
            i.id === id && i.variant_id === variant_id && i.size_id === size_id,
        );

        if (item) {
          item.qty = Math.max(1, qty);
          state.saveToStorage();
        }
      }),
    );
  },

  clearCart: () => {
    set(
      produce<CartStoreType>((state) => {
        state.items = [];
        state.saveToStorage();
      }),
    );
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.qty, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (total, item) => total + item.price * item.qty,
      0,
    );
  },

  saveToStorage: () => {
    const { items } = get();
    localStorage.setItem("petrolida-cart", JSON.stringify(items));
  },

  loadFromStorage: () => {
    const saved = localStorage.getItem("petrolida-cart");
    if (saved) {
      try {
        const items = JSON.parse(saved);
        set(
          produce<CartStoreType>((state) => {
            state.items = items;
          }),
        );
      } catch (error) {
        console.error("Failed to load cart from storage:", error);
      }
    }
  },
}));

const useCartStore = createSelectorHooks(useCartStoreBase);

export default useCartStore;
export type { CartItem };
