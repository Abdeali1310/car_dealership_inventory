import React from "react";

export interface FilterState {
  make: string;
  model: string;
  category: string;
  minPrice: string;
  maxPrice: string;
}

interface SearchFilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "TRUCK", label: "Truck" },
  { value: "COUPE", label: "Coupe" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "CONVERTIBLE", label: "Convertible" },
  { value: "VAN", label: "Van" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
];

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({ filters, onChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...filters,
      [name]: value,
    });
  };

  const handleClear = () => {
    onChange({
      make: "",
      model: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="bg-bg-primary border border-border rounded-standard p-4 font-sans flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Make Input */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.02em]">Make</label>
          <input
            type="text"
            name="make"
            value={filters.make}
            onChange={handleInputChange}
            className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px] w-full"
            placeholder="e.g. Toyota"
          />
        </div>

        {/* Model Input */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.02em]">Model</label>
          <input
            type="text"
            name="model"
            value={filters.model}
            onChange={handleInputChange}
            className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px] w-full"
            placeholder="e.g. Camry"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.02em]">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px] w-full"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.02em]">Min Price (₹)</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleInputChange}
            className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px] w-full"
            placeholder="Min"
            min="0"
          />
        </div>

        {/* Max Price */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-text-secondary uppercase tracking-[0.02em]">Max Price (₹)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleInputChange}
            className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px] w-full"
            placeholder="Max"
            min="0"
          />
        </div>
      </div>

      {/* Clear Filters Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="px-4 h-[32px] border border-border-strong text-text-secondary hover:text-brand hover:border-brand rounded-standard text-[12px] font-medium bg-white transition-all cursor-pointer"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
