import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Order, Product } from "@/types";

interface StoreState {
  cart: CartItem[];
  wishlist: string[]; // array of product IDs
  orders: Order[];
  user: { id: string; email: string; name: string; role?: string; token?: string } | null;
  addToCart: (product: Product, quantity: number, finish: string, material: string) => void;
  removeFromCart: (itemId: string, finish: string, material: string) => void;
  updateCartQty: (itemId: string, finish: string, material: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  placeOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: Order["paymentStatus"]) => void;
  login: (id: string, email: string, name: string, role?: string, token?: string) => void;
  logout: () => void;
}

// Initial mock orders to seed the system
const INITIAL_ORDERS: Order[] = [
  {
    id: "AL-89732",
    date: "2026-06-12",
    items: [
      {
        id: "eternity-band",
        name: "Eternity Band",
        price: 920,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMSEn5M-kqjnfBe6p3P8Ro25F6VGMPu1GWmuVqIVl_JPMd2a7Z68bxY8zySw27Zx_sMXueziaJMbwfHBb98K45KbeElTVnZZI5gsCsTbbntA8WyAvmUen290EGizZwR0Vmqy275zvNjM7k6lAFZnqA1kRA_Mh5qQSf1LNnYBZ_6vJKufe742YAKYRwp6Ql8c64fQkhmO4EFVW0VpwDZUQmUZjjI4fUnnX40sU3U9H_zo20Cr1HWFWszcbYNJav1t1g9FjJNvHs6VQ",
        quantity: 1,
        selectedFinish: "Champagne Gold",
        selectedMaterial: "18k Solid Gold"
      }
    ],
    total: 920,
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Razorpay Secure",
    customer: {
      name: "Riya Sen",
      email: "riya.sen@example.com",
      phone: "9812345678",
      address: "H.No. 12, Park Street",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700016"
    }
  },
  {
    id: "AL-90145",
    date: "2026-06-14",
    items: [
      {
        id: "baroque-pearl-drops",
        name: "Baroque Pearl Drops",
        price: 850,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAb0rwjslXLOE36_JNe51leiUOT_JUC9KKkEu1Dekcn_WJFNUguVH7-SY7XJm3UvCamWmM_NDr82LxEJ6LfJuFk9ZtPaGb_6RPyue6U2_7svWCtWf5Ke1mj3_30WXTlw3GPNTq8rYlPTHzcAq0gD-g177glNz10rT6R9DSW84L5ZHjdGfxQ8bkBYN9ydBjnB7r4ZUUvoSxuZ-VcYO2LJk-fbmWtQ9vbq47TXdx3rS-PL_CdjcNf551ymhgUU0msxEfNvIPM-lLFZO0",
        quantity: 2,
        selectedFinish: "Silver",
        selectedMaterial: "Sterling Silver"
      }
    ],
    total: 1700,
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "Razorpay Secure",
    customer: {
      name: "Ananya Sharma",
      email: "ananya@example.com",
      phone: "9876543210",
      address: "Flat 402, Pearl Heights",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }
  }
];

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      orders: INITIAL_ORDERS,
      user: null,

      addToCart: (product, quantity, finish, material) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (item) =>
              item.id === product.id &&
              item.selectedFinish === finish &&
              item.selectedMaterial === material
          );

          if (existingIndex > -1) {
            const newCart = [...state.cart];
            newCart[existingIndex].quantity += quantity;
            return { cart: newCart };
          }

          const newItem: CartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: quantity,
            selectedFinish: finish,
            selectedMaterial: material
          };

          return { cart: [...state.cart, newItem] };
        }),

      removeFromCart: (itemId, finish, material) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.id === itemId &&
                item.selectedFinish === finish &&
                item.selectedMaterial === material
              )
          )
        })),

      updateCartQty: (itemId, finish, material, qty) =>
        set((state) => ({
          cart: state.cart
            .map((item) =>
              item.id === itemId &&
              item.selectedFinish === finish &&
              item.selectedMaterial === material
                ? { ...item, quantity: Math.max(1, qty) }
                : item
            )
            .filter((item) => item.quantity > 0)
        })),

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) =>
        set((state) => {
          const index = state.wishlist.indexOf(productId);
          if (index > -1) {
            return {
              wishlist: state.wishlist.filter((id) => id !== productId)
            };
          } else {
            return { wishlist: [...state.wishlist, productId] };
          }
        }),

      placeOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders]
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id === orderId) {
              const now = new Date().toISOString();
              const updatedOrder = { ...o, status };
              if (status === "Placed") {
                updatedOrder.placedAt = now;
                updatedOrder.processingAt = undefined;
                updatedOrder.shippedAt = undefined;
                updatedOrder.deliveredAt = undefined;
                updatedOrder.cancelledAt = undefined;
              } else if (status === "Processing") {
                updatedOrder.processingAt = now;
                updatedOrder.shippedAt = undefined;
                updatedOrder.deliveredAt = undefined;
                updatedOrder.cancelledAt = undefined;
              } else if (status === "Shipped") {
                updatedOrder.shippedAt = now;
                updatedOrder.deliveredAt = undefined;
                updatedOrder.cancelledAt = undefined;
              } else if (status === "Delivered") {
                updatedOrder.deliveredAt = now;
                updatedOrder.cancelledAt = undefined;
              }
              return updatedOrder;
            }
            return o;
          })
        })),

      updateOrderPaymentStatus: (orderId, paymentStatus) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, paymentStatus } : o
          )
        })),

      login: (id, email, name, role, token) => set({ user: { id, email, name, role, token } }),
      logout: () => set({ user: null })
    }),
    {
      name: "aurora-luxe-store"
    }
  )
);
