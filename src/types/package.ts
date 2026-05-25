export interface PackingItem {
  id: string
  name: string
  quantity: number
  unit: string
  required: boolean
  packed: boolean
}

export interface PackingCategory {
  id: string
  name: string
  iconName: string
  color: string
  items: PackingItem[]
}

export interface PackingFilters {
  category: string
  status: string
  priority: string
}

export interface FilterDropdownProps {
  label?: string
  options: string[]
  value: string
  onChange: (value: string) => void
}

export interface PackingStore {
  categories: PackingCategory[]
  filters: PackingFilters
  setFilter: (key: keyof PackingFilters, value: string) => void
  clearFilters: () => void
  togglePacked: (categoryId: string, itemId: string) => void
  addItem: (categoryId: string, itemData: Omit<PackingItem, 'id' | 'packed'>) => void
  deleteItem: (categoryId: string, itemId: string) => void
  unpackAll: () => void
}


