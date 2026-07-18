import React from "react";
import Badge from "../shared/Badge";
import { getStockStatus } from "../../utils/stockStatus";
import { getVehicleVisual } from "../../utils/vehicleImage";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { Vehicle } from "./VehicleTable";

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase?: (id: string) => void;
  isPurchasing?: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  isDeleting?: boolean;
  onRestock?: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onPurchase,
  isPurchasing = false,
  onEdit,
  onDelete,
  isDeleting = false,
  onRestock,
}) => {
  const { user } = useAuth();
  const { label, variant } = getStockStatus(vehicle.quantity);
  const visual = getVehicleVisual(vehicle);
  const isOutOfStock = vehicle.quantity === 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="border border-border rounded-standard overflow-hidden bg-bg-primary flex flex-col transition-all hover:border-border-strong">
      {/* Photo / Emoji Header Area */}
      <div className="h-[180px] bg-card-photo-bg flex items-center justify-center overflow-hidden relative border-b border-border select-none">
        {visual.type === "image" && visual.url ? (
          <img
            src={visual.url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <span className="text-[64px] animate-pulse-slow">{visual.icon}</span>
        )}

        {/* Stock Badge pinned top-right */}
        <div className="absolute top-3 right-3 shadow-sm">
          <Badge variant={variant} label={`${label} (${vehicle.quantity})`} />
        </div>
      </div>

      {/* Details Body Area */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        <div>
          <div className="text-[16px] font-semibold text-text-primary truncate">
            {vehicle.make} {vehicle.model}
          </div>
          <div className="text-[11px] font-medium text-text-muted uppercase tracking-wider mt-0.5">
            {vehicle.category}
          </div>
        </div>

        {vehicle.description && (
          <p className="text-[12px] text-text-secondary line-clamp-2 h-[36px] overflow-hidden leading-relaxed">
            {vehicle.description}
          </p>
        )}

        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[11px] font-medium text-text-secondary uppercase">Price</span>
          <span className="text-[15px] font-mono font-semibold text-text-primary">
            {formatCurrency(Number(vehicle.price))}
          </span>
        </div>

        {/* Actions based on role */}
        {user?.role === "CUSTOMER" && onPurchase && (
          <button
            type="button"
            onClick={() => onPurchase(vehicle.id)}
            disabled={isOutOfStock || isPurchasing}
            className={`w-full h-[38px] rounded-standard text-[13px] font-semibold transition-all focus:ring-2 focus:outline-none cursor-pointer flex items-center justify-center gap-1.5 ${
              isOutOfStock
                ? "bg-bg-secondary text-text-muted cursor-not-allowed border border-border"
                : "bg-accent hover:bg-accent-hover text-white focus:ring-accent"
            }`}
          >
            {isPurchasing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Buying...</span>
              </>
            ) : (
              "Purchase"
            )}
          </button>
        )}

        {user?.role === "ADMIN" && (
          <div className="flex gap-2 w-full mt-1.5">
            {onRestock && (
              <button
                type="button"
                onClick={() => onRestock(vehicle)}
                className="flex-1 h-[34px] rounded-standard border border-border-strong text-text-secondary hover:text-brand hover:border-brand hover:bg-bg-hover text-[11px] font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                Restock
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(vehicle)}
                className="flex-1 h-[34px] rounded-standard border border-border-strong text-text-secondary hover:text-text-primary hover:bg-bg-hover text-[11px] font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(vehicle)}
                disabled={isDeleting}
                className="flex-1 h-[34px] rounded-standard bg-status-critical hover:bg-[#b82319] text-white text-[11px] font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-status-critical focus:border-transparent"
              >
                {isDeleting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
