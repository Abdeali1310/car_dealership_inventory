import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import VehicleTable, { type Vehicle } from "../../components/vehicles/VehicleTable";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { toast } from "sonner";
import { Plus, Settings } from "lucide-react";

const ManageVehicles: React.FC = () => {
  const queryClient = useQueryClient();
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all vehicles
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await api.get("/vehicles");
      return response.data.data;
    },
  });

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
  };

  const handleConfirmDelete = async () => {
    if (!vehicleToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/vehicles/${vehicleToDelete.id}`);
      toast.success(`Successfully deleted ${vehicleToDelete.make} ${vehicleToDelete.model}!`);
      setVehicleToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    } catch (error: any) {
      console.error("Delete error:", error);
      const msg = error.response?.data?.message || "Failed to delete vehicle.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    toast.info(`Edit mode for ${vehicle.make} ${vehicle.model} (will be implemented in Task 8.2)`);
  };

  const handleAddClick = () => {
    toast.info("Add Vehicle form (will be implemented in Task 8.2)");
  };

  const hasVehicles = vehicles && vehicles.length > 0;

  return (
    <div className="p-6 font-sans flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-[22px] font-semibold text-text-primary flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand" />
            Manage Inventory
          </h1>
          <p className="text-[12px] text-text-secondary mt-1">
            Create, update, or remove vehicles from the active dealership database.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddClick}
          className="h-[38px] px-4 bg-brand hover:bg-brand-hover text-white rounded-standard text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

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
      ) : !hasVehicles ? (
        <div className="border border-border rounded-standard p-12 bg-bg-primary flex flex-col items-center justify-center text-center gap-3">
          <h2 className="text-[16px] font-semibold text-text-primary">No Vehicles in Inventory</h2>
          <p className="text-[14px] text-text-secondary max-w-[400px]">
            The inventory is empty. Click the "Add Vehicle" button above to add the first vehicle.
          </p>
        </div>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          deletingId={vehicleToDelete?.id || null}
        />
      )}

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={vehicleToDelete !== null}
        title="Delete Vehicle"
        description={
          vehicleToDelete ? (
            <span>
              Are you sure you want to delete the <strong>{vehicleToDelete.make} {vehicleToDelete.model}</strong>? This action cannot be undone.
            </span>
          ) : (
            ""
          )
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setVehicleToDelete(null)}
        isProcessing={isDeleting}
        variant="critical"
      />
    </div>
  );
};

export default ManageVehicles;
