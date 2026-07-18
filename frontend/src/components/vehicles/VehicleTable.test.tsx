import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import VehicleTable from "./VehicleTable";

// Mock AuthContext
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: "CUSTOMER", fullName: "Test Customer" },
  }),
}));

const mockVehicles = [
  {
    id: "1",
    make: "Honda",
    model: "Civic",
    category: "SEDAN",
    price: 2800000,
    quantity: 2,
  },
  {
    id: "2",
    make: "Toyota",
    model: "Camry",
    category: "SEDAN",
    price: 4500000,
    quantity: 0, // Out of stock
  },
];

describe("VehicleTable Component", () => {
  it("should render purchase buttons for customer role", () => {
    const handlePurchase = vi.fn();
    render(<VehicleTable vehicles={mockVehicles} onPurchase={handlePurchase} />);

    // Check that both items are rendered
    expect(screen.getByText("Honda")).toBeInTheDocument();
    expect(screen.getByText("Toyota")).toBeInTheDocument();

    // Check purchase buttons
    const buttons = screen.getAllByRole("button", { name: /purchase/i });
    expect(buttons).toHaveLength(2);
  });

  it("should disable the purchase button when quantity is 0", () => {
    render(<VehicleTable vehicles={mockVehicles} onPurchase={vi.fn()} />);

    // Honda Civic has quantity 2, so its button should be enabled
    const civicRow = screen.getByText("Honda").closest("tr");
    const civicButton = civicRow?.querySelector("button");
    expect(civicButton).not.toBeDisabled();

    // Toyota Camry has quantity 0, so its button should be disabled
    const camryRow = screen.getByText("Toyota").closest("tr");
    const camryButton = camryRow?.querySelector("button");
    expect(camryButton).toBeDisabled();
  });
});
