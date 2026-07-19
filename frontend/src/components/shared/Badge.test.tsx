import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge Component", () => {
  it("should render the label correctly", () => {
    render(<Badge variant="neutral" label="Test Badge" />);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("should render a dot for success variant", () => {
    const { container } = render(<Badge variant="success" label="Active" />);
    const dot = container.querySelector(".bg-status-success");
    expect(dot).toBeInTheDocument();
  });

  it("should render a dot for warning variant", () => {
    const { container } = render(<Badge variant="warning" label="Pending" />);
    const dot = container.querySelector(".bg-status-warning-text");
    expect(dot).toBeInTheDocument();
  });

  it("should NOT render a dot for neutral variant", () => {
    const { container } = render(<Badge variant="neutral" label="Info" />);
    const dot = container.querySelector(".rounded-pill.w-1\\.5");
    expect(dot).not.toBeInTheDocument();
  });

  it("should render correctly for brand variant", () => {
    const { container } = render(<Badge variant="brand" label="Brand Name" />);
    const span = container.querySelector(".text-brand");
    expect(span).toBeInTheDocument();
  });
});
