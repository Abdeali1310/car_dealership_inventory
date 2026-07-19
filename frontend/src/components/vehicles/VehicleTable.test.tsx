import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VehicleTable from "./VehicleTable";

// Define a mutable role variable for dynamic role switching
let mockRole = "CUSTOMER";

// Mock AuthContext
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: mockRole, fullName: "Test User" },
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
  beforeEach(() => {
    // Reset role to CUSTOMER before each test to ensure test isolation
    mockRole = "CUSTOMER";
  });

  it("should render purchase buttons for customer role and call onPurchase", () => {
    const handlePurchase = vi.fn();
    render(<VehicleTable vehicles={mockVehicles} onPurchase={handlePurchase} />);

    // Check that both items are rendered
    expect(screen.getByText("Honda")).toBeInTheDocument();
    expect(screen.getByText("Toyota")).toBeInTheDocument();

    // Check purchase buttons
    const buttons = screen.getAllByRole("button", { name: /purchase/i });
    expect(buttons).toHaveLength(2);

    // Click the active purchase button (Honda Civic)
    fireEvent.click(buttons[0]);
    expect(handlePurchase).toHaveBeenCalledWith("1");
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

  it("should render Restock, Edit, and Delete controls for admin role, hiding Purchase options and triggers callbacks", () => {
    // Switch role to ADMIN for this test case
    mockRole = "ADMIN";

    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleRestock = vi.fn();

    render(
      <VehicleTable
        vehicles={mockVehicles}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestock={handleRestock}
      />
    );

    // Should NOT render purchase buttons under ADMIN role view
    const purchaseButtons = screen.queryAllByRole("button", { name: /purchase/i });
    expect(purchaseButtons).toHaveLength(0);

    // Should render Edit, Delete, and Restock buttons for every vehicle
    const editButtons = screen.getAllByRole("button", { name: /edit/i });
    expect(editButtons).toHaveLength(2);
    fireEvent.click(editButtons[0]);
    expect(handleEdit).toHaveBeenCalledWith(mockVehicles[0]);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(2);
    fireEvent.click(deleteButtons[0]);
    expect(handleDelete).toHaveBeenCalledWith(mockVehicles[0]);

    const restockButtons = screen.getAllByRole("button", { name: /restock/i });
    expect(restockButtons).toHaveLength(2);
    fireEvent.click(restockButtons[0]);
    expect(handleRestock).toHaveBeenCalledWith(mockVehicles[0]);
  });
});
