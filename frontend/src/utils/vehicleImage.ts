export interface VisualSource {
  type: "image" | "emoji";
  url?: string;
  icon?: string;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  SEDAN: "🚗",
  SUV: "🚙",
  TRUCK: "🛻",
  COUPE: "🏎️",
  HATCHBACK: "🚗",
  CONVERTIBLE: "🚗",
  VAN: "🚐",
  MOTORCYCLE: "🏍️",
};

export function getVehicleVisual(vehicle: { imageUrl?: string | null; category: string }): VisualSource {
  if (vehicle.imageUrl && vehicle.imageUrl.trim() !== "") {
    return { type: "image", url: vehicle.imageUrl };
  }

  const icon = CATEGORY_EMOJIS[vehicle.category.toUpperCase()] || "🚗";
  return { type: "emoji", icon };
}
