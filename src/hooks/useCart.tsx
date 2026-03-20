"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  variantId?: string;
  productName: string;
  variantName?: string;
  price: number; // dollars (e.g. 25.00)
  quantity: number;
  image?: string;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number
  ) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "camp-riverbend-cart";

function getKey(productId: string, variantId?: string) {
  return variantId ? `${productId}:${variantId}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const key = getKey(item.productId, item.variantId);
      const existing = prev.find(
        (i) => getKey(i.productId, i.variantId) === key
      );
      if (existing) {
        return prev.map((i) =>
          getKey(i.productId, i.variantId) === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
    setIsDrawerOpen(true);
  }, []);

  const removeItem = useCallback(
    (productId: string, variantId?: string) => {
      const key = getKey(productId, variantId);
      setItems((prev) =>
        prev.filter((i) => getKey(i.productId, i.variantId) !== key)
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string | undefined, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, variantId);
        return;
      }
      const key = getKey(productId, variantId);
      setItems((prev) =>
        prev.map((i) =>
          getKey(i.productId, i.variantId) === key ? { ...i, quantity } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setIsDrawerOpen(false);
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
