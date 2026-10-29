import { cartType } from "@/types/entity/cart";
import { create } from "zustand";

type CartState = {
  cartItems: cartType[];
  totalData: number;
  addToCart: (item: cartType) => void;
  updateCartItemAmount: (updateItem: cartType, amount: number) => void;
  removeCartItem: (removeItem: cartType) => void;
  setTotalData: (count: number) => void;
  initializeCart: () => void;
  clearCart: () => void;
  setCartItems: (items: cartType[]) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  totalData: 0,
  addToCart: (item: cartType) =>
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (x) =>
          x.id === item.id &&
          x.variant.value === item.variant.value &&
          x.size.value === item.size.value,
      );

      let newCartItems;
      if (existingItemIndex !== -1) {
        const updatedItem = {
          ...state.cartItems[existingItemIndex],
          amount: state.cartItems[existingItemIndex].amount + item.amount,
        };
        newCartItems = [
          ...state.cartItems.slice(0, existingItemIndex),
          updatedItem,
          ...state.cartItems.slice(existingItemIndex + 1),
        ];
      } else {
        newCartItems = [...state.cartItems, item];
      }
      localStorage.setItem(
        "petrol-cart",
        JSON.stringify({
          cartItems: newCartItems,
          totalData: newCartItems.length,
        }),
      );

      return { cartItems: newCartItems, totalData: newCartItems.length };
    }),
  updateCartItemAmount: (updateItem: cartType, amount: number) =>
    set((state) => {
      const newCartItems = state.cartItems.map((item) =>
        item.id === updateItem.id &&
        item.variant.id === updateItem.variant.id &&
        item.size.id === updateItem.size.id
          ? { ...item, amount: item.amount + amount }
          : item,
      );
      localStorage.setItem(
        "petrol-cart",
        JSON.stringify({
          cartItems: newCartItems,
          totalData: newCartItems.length,
        }),
      );

      return { cartItems: newCartItems };
    }),
  removeCartItem: (removeItem: cartType) =>
    set((state) => {
      const newCartItems = state.cartItems.filter(
        (item) =>
          !(
            item.id === removeItem.id &&
            item.variant.id === removeItem.variant.id &&
            item.size.id === removeItem.size.id
          ),
      );

      localStorage.setItem(
        "petrol-cart",
        JSON.stringify({
          cartItems: newCartItems,
          totalData: newCartItems.length,
        }),
      );
      return { cartItems: newCartItems, totalData: newCartItems.length };
    }),
  setTotalData: (count: number) => set({ totalData: count }),

  initializeCart: () => {
    const storedData = localStorage.getItem("petrol-cart");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      set({
        cartItems: parsedData.cartItems || [],
        totalData: parsedData.totalData || 0,
      });
    }
  },

  clearCart: () =>
    set(() => {
      localStorage.removeItem("petrol-cart");
      return { cartItems: [], totalData: 0 };
    }),
  setCartItems: (items: cartType[]) =>
    set(() => {
      localStorage.setItem(
        "petrol-cart",
        JSON.stringify({
          cartItems: items,
          totalData: items.length,
        }),
      );
      return { cartItems: items, totalData: items.length };
    }),
}));
