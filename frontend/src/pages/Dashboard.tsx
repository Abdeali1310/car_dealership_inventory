import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import VehicleTable, { Vehicle } from "../components/vehicles/VehicleTable";
import { toast } from "sonner";
import { Car } from "lucide-react";

const Dashboard: React.FC = () => {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const { data: vehicles, isLoading, refetch } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await api.get("/vehicles");
      return response.data.data;
    },
  });

  const handlePurchase = async (vehicleId: string) => {
    setPurchasingId(vehicleId);
    try {
      await api.post(`/vehicles/${vehicleId}/purchase`);
      toast.success("Vehicle purchased successfully!");
      refetch();
    } catch (error: any) {
      console.error("Purchase error:", error);
      const msg = error.response?.data?.message || "Purchase failed.";
      toast.error(msg);
    } finally {
      setPurchasingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 font-sans flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-[22px] font-semibold text-text-primary">Vehicles Inventory</h1>
            <p className="text-[12px] text-text-secondary mt-1">Browse and purchase vehicles</p>
          </div>
        </div>
        {/* Table skeleton */}
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
      </div>
    );
  }

  const hasVehicles = vehicles && vehicles.length > 0;

  return (
    <div className="p-6 font-sans flex flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-semibold text-text-primary">Vehicles Inventory</h1>
        <p className="text-[12px] text-text-secondary mt-1">Browse and purchase vehicles</p>
      </div>

      {!hasVehicles ? (
        <div className="border border-border rounded-standard p-12 bg-bg-primary flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-pill bg-bg-secondary flex items-center justify-center">
            <Car className="w-6 h-6 text-text-secondary" />
          </div>
          <h2 className="text-[16px] font-semibold text-text-primary">No Vehicles Available</h2>
          <p className="text-[14px] text-text-secondary max-w-[400px]">
            There are currently no vehicles registered in the dealership inventory. Please check back later.
          </p>
        </div>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onPurchase={handlePurchase}
          purchasingId={purchasingId}
        />
      )}
    </div>
  );
};

export default Dashboard;
