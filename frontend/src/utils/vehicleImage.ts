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
    let url = vehicle.imageUrl;
    if (url.startsWith("/uploads/")) {
      const backendDomain = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");
      url = `${backendDomain}${url}`;
    }
    return { type: "image", url };
  }

  const icon = CATEGORY_EMOJIS[vehicle.category.toUpperCase()] || "🚗";
  return { type: "emoji", icon };
}
