"use client";

import * as React from "react";

export type CartProduct = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  image: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartProduct[];
  count: number;
  total: number;
  addItem: (item: Omit<CartProduct, "quantity">) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartProduct[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("ev-projects-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    if (loaded) localStorage.setItem("ev-projects-cart", JSON.stringify(items));
  }, [items, loaded]);

  const addItem = React.useCallback((item: Omit<CartProduct, "quantity">) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) return current.map((entry) => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry);
      return [...current, { ...item, quantity: 1 }];
    });
  }, []);

  const setQuantity = React.useCallback((id: string, quantity: number) => {
    setItems((current) => quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
  }, []);

  const value = React.useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    addItem,
    removeItem: (id: string) => setItems((current) => current.filter((item) => item.id !== id)),
    setQuantity,
    clear: () => setItems([]),
  }), [items, addItem, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = React.useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
