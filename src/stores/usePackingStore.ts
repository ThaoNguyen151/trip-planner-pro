import { FileText, Shirt, Zap, Pill, SprayCan, Package } from 'lucide-react'
import { create } from 'zustand'
import type { PackingFilters, PackingStore } from '@/types/package'

const DEFAULT_FILTERS: PackingFilters = {
  category: 'All Categories',
  status: 'All Status',
  priority: 'All Priorities',
}


export const usePackingStore = create<PackingStore>((set) => ({
  categories: [
    {
      id: 'documents',
      name: 'Documents',
      icon: FileText,
      color: '#6c6ee5',
      items: [
        { id: 'd1', name: 'Passport / ID card', quantity: 1, unit: '', required: true, packed: false },
        { id: 'd2', name: 'Flight E-Tickets', quantity: 2, unit: '', required: true, packed: false },
      ],
    },
    {
      id: 'clothes',
      name: 'Clothes',
      icon: Shirt,
      color: '#597bc1',
      items: [
        { id: 'c1', name: 'Linen Shirts (x3)', quantity: 3, unit: 'pcs', required: true, packed: true },
        { id: 'c2', name: 'Swimwear', quantity: 2, unit: 'pcs', required: false, packed: true },
        { id: 'c3', name: 'Walking Shoes', quantity: 1, unit: 'pair', required: true, packed: false },
      ],
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: Zap,
      color: '#9a92d3',
      items: [
        { id: 'e1', name: 'Universal Adapter', quantity: 1, unit: '', required: true, packed: false },
        { id: 'e2', name: 'Power Bank (20k mAh)', quantity: 1, unit: '', required: false, packed: false },
      ],
    },
    {
      id: 'medicines',
      name: 'Medicines',
      icon: Pill,
      color: '#cb82ec',
      items: [
        { id: 'm1', name: 'Ibuprofen', quantity: 20, unit: 'tabs', required: false, packed: false },
        { id: 'm2', name: 'Sunscreen SPF 50', quantity: 1, unit: 'bottle', required: false, packed: false },
      ],
    },
    {
      id: 'personal',
      name: 'Personal',
      icon: SprayCan,
      color: '#e8a268',
      items: [
        { id: 'p1', name: 'Toothbrush', quantity: 1, unit: '', required: true, packed: false },
      ],
    },
    {
      id: 'others',
      name: 'Others',
      icon: Package,
      color: '#6b93ca',
      items: [],
    },
  ],

  filters: DEFAULT_FILTERS,

  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),

  clearFilters: () => set({ filters: DEFAULT_FILTERS }),

  togglePacked: (categoryId, itemId) =>
    set((s) => ({
      categories: s.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, packed: !item.packed } : item,
              ),
            }
          : cat,
      ),
    })),

  addItem: (categoryId, itemData) =>
    set((s) => ({
      categories: s.categories.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: [
                ...cat.items,
                { id: `${categoryId}-${Date.now()}`, packed: false, ...itemData },
              ],
            }
          : cat,
      ),
    })),

  deleteItem: (categoryId, itemId) =>
    set((s) => ({
      categories: s.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat,
      ),
    })),

  unpackAll: () =>
    set((s) => ({
      categories: s.categories.map((cat) => ({
        ...cat,
        items: cat.items.map((item) => ({ ...item, packed: false })),
      })),
    })),
}))