import { BadgeVariant } from "../components/shared/Badge";

export function getStockStatus(quantity: number): { label: string; variant: BadgeVariant } {
  if (quantity >= 5) {
    return { label: "In Stock", variant: "success" };
  } else if (quantity >= 1) {
    return { label: "Low Stock", variant: "warning" };
  } else {
    return { label: "Out of Stock", variant: "critical" };
  }
}
