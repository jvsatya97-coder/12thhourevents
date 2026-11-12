'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/lib/products';

interface CompareCtx {
  items: Product[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
}

const Ctx = createContext<CompareCtx>({
  items: [], add: () => {}, remove: () => {}, has: () => false, clear: () => {},
  drawerOpen: false, setDrawerOpen: () => {},
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const add = (p: Product) => {
    setItems(prev => {
      if (prev.find(x => x.id === p.id)) return prev;
      if (prev.length >= 3) return prev; // max 3
      return [...prev, p];
    });
    setDrawerOpen(true);
  };
  const remove = (id: string) => setItems(prev => prev.filter(x => x.id !== id));
  const has = (id: string) => items.some(x => x.id === id);
  const clear = () => { setItems([]); setDrawerOpen(false); };

  return (
    <Ctx.Provider value={{ items, add, remove, has, clear, drawerOpen, setDrawerOpen }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCompare = () => useContext(Ctx);
