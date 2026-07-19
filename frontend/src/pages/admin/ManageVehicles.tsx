import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import { type Vehicle } from "../../components/vehicles/VehicleTable";
import VehicleCard from "../../components/vehicles/VehicleCard";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import VehicleForm from "../../components/vehicles/VehicleForm";
import RestockDialog from "../../components/vehicles/RestockDialog";
import SearchFilterBar, { type FilterState } from "../../components/vehicles/SearchFilterBar";
import { toast } from "sonner";
import { Plus, Settings, AlertTriangle, Car } from "lucide-react";

const ManageVehicles: React.FC = () => {
  const queryClient = useQueryClient();

  // Search & Filter State
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

  // Delete dialog state
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState<Vehicle | null>(null);

  // Restock dialog state
  const [vehicleToRestock, setVehicleToRestock] = useState<Vehicle | null>(null);

  // Fetch filtered vehicles
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
    setSelectedVehicleForEdit(vehicle);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setSelectedVehicleForEdit(null);
    setIsFormOpen(true);
  };

  const handleRestockClick = (vehicle: Vehicle) => {
    setVehicleToRestock(vehicle);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
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

      {/* KPI Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="border border-border rounded-standard p-4 bg-bg-primary flex flex-col gap-2 h-[80px]">
              <div className="h-3 bg-bg-hover rounded-standard w-1/2" />
              <div className="h-6 bg-bg-hover rounded-standard w-1/4 mt-1" />
            </div>
          ))}
        </div>
      ) : vehicles ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-bg-primary border border-border rounded-standard p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-wider">Total Vehicles</span>
            <span className="text-2xl font-bold text-text-primary">{vehicles.length}</span>
          </div>
          <div className="bg-bg-primary border border-border rounded-standard p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-wider">Low Stock</span>
            <span className="text-2xl font-bold text-status-warning-text">
              {vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length}
            </span>
          </div>
          <div className="bg-bg-primary border border-border rounded-standard p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-wider">Out of Stock</span>
            <span className="text-2xl font-bold text-status-critical">
              {vehicles.filter((v) => v.quantity === 0).length}
            </span>
          </div>
          <div className="bg-bg-primary border border-border rounded-standard p-4 flex flex-col gap-1 shadow-sm">
            <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-wider">Categories</span>
            <span className="text-2xl font-bold text-brand">
              {new Set(vehicles.map((v) => v.category)).size}
            </span>
          </div>
        </div>
      ) : null}

      {/* Search & Filter Bar */}
      <SearchFilterBar filters={filters} onChange={setFilters} />

      {isLoading ? (
        /* Card skeleton grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className="border border-border rounded-standard overflow-hidden bg-bg-secondary flex flex-col h-[370px]">
              <div className="h-[210px] bg-bg-hover" />
              <div className="p-4 flex flex-col gap-3 flex-grow">
                <div className="h-5 bg-bg-hover rounded-standard w-3/4" />
                <div className="h-3 bg-bg-hover rounded-standard w-1/4" />
                <div className="h-4 bg-bg-hover rounded-standard w-full mt-2" />
                <div className="h-4 bg-bg-hover rounded-standard w-5/6" />
                <div className="mt-auto pt-3 border-t border-border flex justify-between items-center">
                  <div className="h-3 bg-bg-hover rounded-standard w-10" />
                  <div className="h-4 bg-bg-hover rounded-standard w-20" />
                </div>
                <div className="h-[38px] bg-bg-hover rounded-standard w-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="border border-status-critical/20 rounded-standard p-12 bg-bg-primary flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 rounded-pill bg-[#fef2f2] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-status-critical" />
          </div>
          <h2 className="text-[16px] font-semibold text-text-primary">Failed to Load Inventory</h2>
          <p className="text-[14px] text-text-secondary max-w-[400px]">
            Could not fetch the vehicle catalog. Please verify your connection or admin permissions.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              onRestock={handleRestockClick}
              isDeleting={vehicleToDelete?.id === vehicle.id && isDeleting}
            />
          ))}
        </div>
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

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <VehicleForm
          initialData={selectedVehicleForEdit}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedVehicleForEdit(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Restock Dialog Modal */}
      {vehicleToRestock && (
        <RestockDialog
          isOpen={vehicleToRestock !== null}
          vehicle={vehicleToRestock}
          onClose={() => setVehicleToRestock(null)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ManageVehicles;
