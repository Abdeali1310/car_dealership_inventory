import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VehicleCard from "./VehicleCard";
import type { Vehicle } from "./VehicleTable";

let mockRole = "CUSTOMER";

// Mock AuthContext
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: mockRole, fullName: "Test User" },
  }),
}));

const mockVehicleWithImage: Vehicle = {
  id: "1",
  make: "Porsche",
  model: "911 Carrera",
  category: "COUPE",
  price: 18000000,
  quantity: 5,
  description: "A fast sports car.",
  imageUrl: "https://example.com/porsche.jpg",
};

const mockVehicleWithEmoji: Vehicle = {
  id: "2",
  make: "Mahindra",
  model: "Thar",
  category: "SUV",
  price: 1680000,
  quantity: 0, // Out of stock
  description: "Off-road SUV.",
  imageUrl: "",
};

describe("VehicleCard Component", () => {
  beforeEach(() => {
    mockRole = "CUSTOMER";
  });

  it("should render vehicle details correctly", () => {
    render(
      <VehicleCard
        vehicle={mockVehicleWithImage}
        onPurchase={vi.fn()}
        isPurchasing={false}
      />
    );

    expect(screen.getByText("Porsche 911 Carrera")).toBeInTheDocument();
    expect(screen.getByText("COUPE")).toBeInTheDocument();
    expect(screen.getByText("A fast sports car.")).toBeInTheDocument();
    expect(screen.getByText(/₹1,80,00,000/)).toBeInTheDocument();
  });

  it("should render image if imageUrl is provided", () => {
    render(
      <VehicleCard
        vehicle={mockVehicleWithImage}
        onPurchase={vi.fn()}
        isPurchasing={false}
      />
    );

    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/porsche.jpg");
  });

  it("should render category emoji if imageUrl is empty", () => {
    render(
      <VehicleCard
        vehicle={mockVehicleWithEmoji}
        onPurchase={vi.fn()}
        isPurchasing={false}
      />
    );

    expect(screen.getByText("🚙")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should disable Purchase button and show Out of Stock badge when quantity is 0", () => {
    render(
      <VehicleCard
        vehicle={mockVehicleWithEmoji}
        onPurchase={vi.fn()}
        isPurchasing={false}
      />
    );

    const button = screen.getByRole("button", { name: /purchase/i });
    expect(button).toBeDisabled();
    expect(screen.getByText("Out of Stock (0)")).toBeInTheDocument();
  });

  it("should call onPurchase handler when Purchase button is clicked", () => {
    const handlePurchase = vi.fn();
    render(
      <VehicleCard
        vehicle={mockVehicleWithImage}
        onPurchase={handlePurchase}
        isPurchasing={false}
      />
    );

    const button = screen.getByRole("button", { name: /purchase/i });
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(handlePurchase).toHaveBeenCalledWith("1");
  });

  it("should show loading spinner and disable button when isPurchasing is true", () => {
    render(
      <VehicleCard
        vehicle={mockVehicleWithImage}
        onPurchase={vi.fn()}
        isPurchasing={true}
      />
    );

    const button = screen.getByRole("button", { name: /buying/i });
    expect(button).toBeDisabled();
  });

  it("should open Lightbox Modal when car image is clicked and close it on trigger", () => {
    const { container } = render(
      <VehicleCard
        vehicle={mockVehicleWithImage}
        onPurchase={vi.fn()}
        isPurchasing={false}
      />
    );

    const imgHeader = container.querySelector(".cursor-zoom-in");
    expect(imgHeader).toBeInTheDocument();

    // Before click, only 1 instance of the title
    expect(screen.getAllByText("Porsche 911 Carrera")).toHaveLength(1);

    // Click image to open Lightbox
    fireEvent.click(imgHeader!);
    // Now there should be 2 instances of the title (one in card, one in lightbox header)
    expect(screen.getAllByText("Porsche 911 Carrera")).toHaveLength(2);

    // Click close button to close Lightbox
    const closeBtn = screen.getByRole("button", { name: "" }); // Lucide X close button has no text
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    
    // After close, only 1 instance of the title remains
    expect(screen.getAllByText("Porsche 911 Carrera")).toHaveLength(1);
  });

  it("should render ADMIN actions and trigger click handlers", () => {
    mockRole = "ADMIN";
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();
    const handleRestock = vi.fn();

    render(
      <VehicleCard
        vehicle={mockVehicleWithImage}
        onPurchase={vi.fn()}
        isPurchasing={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestock={handleRestock}
      />
    );

    // Purchase button should be hidden for admin
    expect(screen.queryByRole("button", { name: /purchase/i })).not.toBeInTheDocument();

    // Restock button should be present
    const restockBtn = screen.getByRole("button", { name: /restock/i });
    expect(restockBtn).toBeInTheDocument();
    fireEvent.click(restockBtn);
    expect(handleRestock).toHaveBeenCalledWith(mockVehicleWithImage);

    // Edit button (pencil emoji)
    const editBtn = screen.getByRole("button", { name: /✏️/ });
    expect(editBtn).toBeInTheDocument();
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(mockVehicleWithImage);

    // Delete button (trash emoji)
    const deleteBtn = screen.getByRole("button", { name: /🗑️/ });
    expect(deleteBtn).toBeInTheDocument();
    fireEvent.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith(mockVehicleWithImage);
  });
});
