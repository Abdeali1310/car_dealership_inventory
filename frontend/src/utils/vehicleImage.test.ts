import { describe, it, expect } from "vitest";
import { getVehicleVisual } from "./vehicleImage";

describe("getVehicleVisual helper", () => {
  it("should return type image and url when imageUrl is provided", () => {
    const result = getVehicleVisual({
      category: "SEDAN",
      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
    });
    expect(result.type).toBe("image");
    expect(result.url).toBe("https://images.unsplash.com/photo-1503376780353-7e6692767b70");
    expect(result.icon).toBeUndefined();
  });

  it("should return type emoji and category fallback icon when imageUrl is empty or null", () => {
    const result = getVehicleVisual({
      category: "SUV",
      imageUrl: "",
    });
    expect(result.type).toBe("emoji");
    expect(result.icon).toBe("🚙");
    expect(result.url).toBeUndefined();
  });

  it("should default to sedan emoji if category is unrecognized", () => {
    const result = getVehicleVisual({
      category: "UNKNOWN_CATEGORY",
      imageUrl: undefined,
    });
    expect(result.type).toBe("emoji");
    expect(result.icon).toBe("🚗");
  });
});
