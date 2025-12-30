import { defineStore } from 'pinia';
import type { CartItem, Product } from '../types/product';

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    cartItemsCount: (state): number => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    subtotal: (state): number => {
      return state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    },

    tax: (state): number => {
      const subtotal = state.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
      return subtotal * 0.16;
    },

    total(): number {
      return this.subtotal + this.tax;
    },

    getItemQuantity: (state) => {
      return (productId: number): number => {
        const item = state.items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
      };
    },
  },

  actions: {
    addToCart(product: Product, quantity: number = 1) {
      const existingItem = this.items.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          product,
          quantity,
        });
      }
    },

    removeFromCart(productId: number) {
      const index = this.items.findIndex(
        (item) => item.product.id === productId
      );
      if (index > -1) {
        this.items.splice(index, 1);
      }
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find((item) => item.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    clearCart() {
      this.items = [];
    },
  },
});
