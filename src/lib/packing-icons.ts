import { createElement } from "react";
import {
  FileText,
  Package,
  Pill,
  Shirt,
  SprayCan,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { PackingCategory } from "@/types/package";

export const PACKING_ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Shirt,
  Zap,
  Pill,
  SprayCan,
  Package,
};

const CATEGORY_ID_ICON: Record<string, string> = {
  documents: "FileText",
  clothes: "Shirt",
  electronics: "Zap",
  medicines: "Pill",
  personal: "SprayCan",
  others: "Package",
};

const EMOJI_ICON: Record<string, string> = {
  "📄": "FileText",
  "👕": "Shirt",
  "🔌": "Zap",
  "💊": "Pill",
  "🪥": "SprayCan",
  "📦": "Package",
};

export function resolvePackingIcon(iconName?: string): LucideIcon {
  if (iconName && PACKING_ICON_MAP[iconName]) {
    return PACKING_ICON_MAP[iconName];
  }
  return Package;
}

export function PackingCategoryIcon({
  iconName,
  size,
  color,
}: {
  iconName: string;
  size?: number;
  color?: string;
}) {
  return createElement(resolvePackingIcon(iconName), { size, color });
}

type StoredPackingCategory = PackingCategory & { emoji?: string; icon?: unknown };

export function normalizePackingCategories(
  categories: StoredPackingCategory[],
): PackingCategory[] {
  return categories.map((cat) => {
    const iconName =
      cat.iconName ??
      CATEGORY_ID_ICON[cat.id] ??
      (cat.emoji ? EMOJI_ICON[cat.emoji] : undefined) ??
      "Package";

    return {
      id: cat.id,
      name: cat.name,
      iconName,
      color: cat.color,
      items: cat.items,
    };
  });
}
