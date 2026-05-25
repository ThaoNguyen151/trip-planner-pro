import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { normalizePackingCategories } from '@/lib/packing-icons'
import type { PackingFilters, PackingStore, PackingCategory } from '@/types/package'
import { STORAGE_KEYS } from '@/constants/storage-keys'
import { createDefaultPackingCategories } from '@/lib/trip-feature-defaults'

const DEFAULT_FILTERS: PackingFilters = {
  category: 'All Categories',
  status: 'All Status',
  priority: 'All Priorities',
}

export const usePackingStore = create<PackingStore>()(
  persist(
    (set) => ({
      categories: (createDefaultPackingCategories()),
      filters: DEFAULT_FILTERS,

      setFilter: (key, value) =>
        set((s) => ({
          filters: {
            ...s.filters,
            [key]: value,
          },
        })),

      clearFilters: () =>
        set({
          filters: DEFAULT_FILTERS,
        }),

      togglePacked: (categoryId, itemId) =>
        set((s) => ({
          categories: s.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  items: cat.items.map((item) =>
                    item.id === itemId
                      ? { ...item, packed: !item.packed }
                      : item,
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
                    {
                      id: `${categoryId}-${Date.now()}`,
                      packed: false,
                      ...itemData,
                    },
                  ],
                }
              : cat,
          ),
        })),

      deleteItem: (categoryId, itemId) =>
        set((s) => ({
          categories: s.categories.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  items: cat.items.filter(
                    (item) => item.id !== itemId,
                  ),
                }
              : cat,
          ),
        })),

      unpackAll: () =>
        set((s) => ({
          categories: s.categories.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              packed: false,
            })),
          })),
        })),
    }),
    {
      name: STORAGE_KEYS.PACKING_LIST,
      partialize: (state) => ({
        filters: state.filters,
        categories: state.categories,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          categories?: PackingCategory[];
          filters?: PackingFilters;
        };
        return {
          ...currentState,
          filters: persisted.filters ?? currentState.filters,
          categories: normalizePackingCategories(
            persisted.categories ?? currentState.categories,
          ),
        };
      },
    },
  ),
)