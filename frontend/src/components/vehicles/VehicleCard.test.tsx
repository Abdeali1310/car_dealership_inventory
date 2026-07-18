import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VehicleCard from "./VehicleCard";
import type { Vehicle } from "./VehicleTable";

// Mock AuthContext
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { role: "CUSTOMER", fullName: "Test Customer" },
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
    // Price formatted in INR (en-IN)
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

    // Should render SUV emoji fallback "🚙"
    expect(screen.getByText("🚙")).toBeInTheDocument();
    // Should not render an image element
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
});
