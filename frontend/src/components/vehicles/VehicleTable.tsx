import React from "react";
import Badge from "../shared/Badge";
import { getStockStatus } from "../../utils/stockStatus";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  imageUrl?: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
  onPurchase?: (id: string) => void;
  purchasingId?: string | null;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  deletingId?: string | null;
}

const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  onPurchase,
  purchasingId = null,
  onEdit,
  onDelete,
  deletingId = null,
}) => {
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full border border-border rounded-standard overflow-x-auto bg-bg-primary">
      <table className="w-full border-collapse text-[14px]">
        <thead>
          <tr className="bg-bg-secondary border-b border-border text-left">
            <th className="py-2.5 px-3.5 text-[12px] font-medium text-text-secondary uppercase tracking-[0.02em] w-[140px]">
              Category
            </th>
            <th className="py-2.5 px-3.5 text-[12px] font-medium text-text-secondary uppercase tracking-[0.02em]">
              Make
            </th>
            <th className="py-2.5 px-3.5 text-[12px] font-medium text-text-secondary uppercase tracking-[0.02em]">
              Model
            </th>
            <th className="py-2.5 px-3.5 text-[12px] font-medium text-text-secondary uppercase tracking-[0.02em] text-right pr-6">
              Price
            </th>
            <th className="py-2.5 px-3.5 text-[12px] font-medium text-text-secondary uppercase tracking-[0.02em] w-[140px]">
              Status
            </th>
            <th className="py-2.5 px-3.5 text-[12px] font-medium text-text-secondary uppercase tracking-[0.02em] text-right w-[180px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => {
            const { label, variant } = getStockStatus(vehicle.quantity);
            const isOutOfStock = vehicle.quantity === 0;
            const isPNode = purchasingId === vehicle.id;

            return (
              <tr
                key={vehicle.id}
                className="border-b border-border hover:bg-bg-hover transition-colors last:border-0 align-middle"
              >
                <td className="py-3 px-3.5">
                  <Badge variant="neutral" label={vehicle.category} />
                </td>
                <td className="py-3 px-3.5 text-text-primary font-medium">
                  {vehicle.make}
                </td>
                <td className="py-3 px-3.5 text-text-primary">
                  {vehicle.model}
                </td>
                <td className="py-3 px-3.5 text-right font-mono text-text-primary pr-6">
                  {formatCurrency(Number(vehicle.price))}
                </td>
                <td className="py-3 px-3.5">
                  <Badge variant={variant} label={label} />
                </td>
                <td className="py-3 px-3.5 text-right pr-4">
                  {user?.role === "CUSTOMER" && onPurchase && (
                    <button
                      onClick={() => onPurchase(vehicle.id)}
                      disabled={isOutOfStock || isPNode}
                      className={`h-[38px] px-4 rounded-standard text-[13px] font-medium transition-all focus:ring-2 focus:ring-brand focus:outline-none cursor-pointer ${
                        isOutOfStock
                          ? "bg-bg-secondary text-text-muted cursor-not-allowed border border-border"
                          : "bg-brand hover:bg-brand-hover text-white"
                      }`}
                    >
                      {isPNode ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Buying...</span>
                        </div>
                      ) : (
                        "Purchase"
                      )}
                    </button>
                  )}
                  {user?.role === "ADMIN" && (
                    <div className="flex justify-end gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(vehicle)}
                          className="h-[32px] px-3 rounded-standard border border-border-strong text-text-secondary hover:text-text-primary hover:bg-bg-hover text-[12px] font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(vehicle)}
                          disabled={deletingId === vehicle.id}
                          className="h-[32px] px-3 rounded-standard bg-status-critical hover:bg-[#b82319] text-white text-[12px] font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-status-critical focus:border-transparent"
                        >
                          {deletingId === vehicle.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      )}
                      {!onEdit && !onDelete && (
                        <span className="text-[12px] text-text-secondary italic pr-2">
                          Admin View
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
