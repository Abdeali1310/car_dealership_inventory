import { describe, it, expect } from "vitest";
import { getStockStatus } from "./stockStatus";

describe("getStockStatus helper", () => {
  it("should return Out of Stock for quantity 0", () => {
    const result = getStockStatus(0);
    expect(result.label).toBe("Out of Stock");
    expect(result.variant).toBe("critical");
  });

  it("should return Low Stock for quantity 1", () => {
    const result = getStockStatus(1);
    expect(result.label).toBe("Low Stock");
    expect(result.variant).toBe("warning");
  });

  it("should return Low Stock for quantity 4", () => {
    const result = getStockStatus(4);
    expect(result.label).toBe("Low Stock");
    expect(result.variant).toBe("warning");
  });

  it("should return In Stock for quantity 5", () => {
    const result = getStockStatus(5);
    expect(result.label).toBe("In Stock");
    expect(result.variant).toBe("success");
  });

  it("should return In Stock for quantity greater than 5", () => {
    const result = getStockStatus(10);
    expect(result.label).toBe("In Stock");
    expect(result.variant).toBe("success");
  });
});
