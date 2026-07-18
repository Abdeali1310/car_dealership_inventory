import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import VehicleTable, { type Vehicle } from "../components/vehicles/VehicleTable";
import SearchFilterBar, { type FilterState } from "../components/vehicles/SearchFilterBar";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Car, AlertTriangle } from "lucide-react";

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [vehicleToPurchase, setVehicleToPurchase] = useState<Vehicle | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    make: "",
    model: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [debouncedFilters, setDebouncedFilters] = useState<FilterState>(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [filters]);

  const { data: vehicles, isLoading, isError, refetch } = useQuery<Vehicle[]>({
    queryKey: ["vehicles", debouncedFilters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (debouncedFilters.make) params.make = debouncedFilters.make;
      if (debouncedFilters.model) params.model = debouncedFilters.model;
      if (debouncedFilters.category) params.category = debouncedFilters.category;
      if (debouncedFilters.minPrice) params.minPrice = Number(debouncedFilters.minPrice);
      if (debouncedFilters.maxPrice) params.maxPrice = Number(debouncedFilters.maxPrice);

      const response = await api.get("/vehicles/search", { params });
      return response.data.data;
    },
  });

  const handlePurchaseClick = (vehicleId: string) => {
    const vehicle = vehicles?.find((v) => v.id === vehicleId);
    if (vehicle) {
      setVehicleToPurchase(vehicle);
    }
  };

  const handleConfirmPurchase = async () => {
    if (!vehicleToPurchase) return;
    setIsPurchasing(true);
    try {
      await api.post(`/vehicles/${vehicleToPurchase.id}/purchase`);
      toast.success(`Successfully purchased ${vehicleToPurchase.make} ${vehicleToPurchase.model}!`);
      setVehicleToPurchase(null);
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    } catch (error: any) {
      console.error("Purchase error:", error);
      const msg = error.response?.data?.message || "Purchase failed.";
      toast.error(msg);
      setVehicleToPurchase(null);
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const hasVehicles = vehicles && vehicles.length > 0;

  return (
    <div className="p-6 font-sans flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-text-primary">Vehicles Inventory</h1>
        <p className="text-[12px] text-text-secondary mt-1">Browse and purchase vehicles</p>
      </div>

      <SearchFilterBar filters={filters} onChange={setFilters} />

      {isLoading ? (
        /* Table skeleton */
        <div className="w-full border border-border rounded-standard bg-bg-primary overflow-hidden animate-pulse">
          <div className="h-[40px] bg-bg-secondary border-b border-border" />
          <div className="flex flex-col">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="h-[58px] border-b border-border flex items-center px-4 justify-between">
                <div className="h-4 bg-bg-hover w-[80px] rounded-standard" />
                <div className="h-4 bg-bg-hover w-[120px] rounded-standard" />
                <div className="h-4 bg-bg-hover w-[100px] rounded-standard" />
                <div className="h-4 bg-bg-hover w-[70px] rounded-standard" />
                <div className="h-4 bg-bg-hover w-[90px] rounded-standard" />
                <div className="h-[38px] bg-bg-hover w-[90px] rounded-standard" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="border border-status-critical/20 rounded-standard p-12 bg-bg-primary flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-pill bg-[#fef2f2] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-status-critical" />
          </div>
          <h2 className="text-[16px] font-semibold text-text-primary">Failed to Load Inventory</h2>
          <p className="text-[14px] text-text-secondary max-w-[400px]">
            There was an error communicating with the server. Please check your network connection and try again.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="h-[38px] px-5 bg-brand hover:bg-brand-hover text-white rounded-standard text-[13px] font-medium transition-all cursor-pointer mt-2"
          >
            Retry Connection
          </button>
        </div>
      ) : !hasVehicles ? (
        <div className="border border-border rounded-standard p-12 bg-bg-primary flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-pill bg-bg-secondary flex items-center justify-center">
            <Car className="w-6 h-6 text-text-secondary" />
          </div>
          <h2 className="text-[16px] font-semibold text-text-primary">No Vehicles Found</h2>
          <p className="text-[14px] text-text-secondary max-w-[400px]">
            No vehicles match your current search and filter criteria. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onPurchase={handlePurchaseClick}
          purchasingId={vehicleToPurchase?.id || null}
        />
      )}

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={vehicleToPurchase !== null}
        title="Confirm Purchase"
        description={
          vehicleToPurchase ? (
            <span>
              Buy this <strong>{vehicleToPurchase.make} {vehicleToPurchase.model}</strong> for{" "}
              <strong>{formatCurrency(Number(vehicleToPurchase.price))}</strong>?
            </span>
          ) : (
            ""
          )
        }
        confirmLabel="Purchase"
        cancelLabel="Cancel"
        onConfirm={handleConfirmPurchase}
        onCancel={() => setVehicleToPurchase(null)}
        isProcessing={isPurchasing}
        variant="brand"
      />
    </div>
  );
};

export default Dashboard;
