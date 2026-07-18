import React from "react";
import Badge from "../shared/Badge";
import { getStockStatus } from "../../utils/stockStatus";
import { getVehicleVisual } from "../../utils/vehicleImage";
import { Loader2, X } from "lucide-react";
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
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isPreviewOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen]);

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
      <div
        onClick={() => visual.type === "image" && visual.url && setIsPreviewOpen(true)}
        className={`h-[180px] bg-card-photo-bg flex items-center justify-center overflow-hidden relative border-b border-border select-none ${
          visual.type === "image" && visual.url ? "cursor-zoom-in" : ""
        }`}
      >
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
        <div className="absolute top-3 right-3 shadow-sm" onClick={(e) => e.stopPropagation()}>
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
          <div className="flex gap-1.5 w-full mt-1.5">
            {onRestock && (
              <button
                type="button"
                onClick={() => onRestock(vehicle)}
                className="flex-grow h-[34px] rounded-standard border border-border-strong text-text-secondary hover:text-brand hover:border-brand hover:bg-bg-hover text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <span>📦</span>
                <span>Restock</span>
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(vehicle)}
                title="Edit Details"
                className="w-[34px] h-[34px] rounded-standard border border-border-strong text-text-secondary hover:text-text-primary hover:bg-bg-hover text-[14px] flex items-center justify-center flex-shrink-0 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(vehicle)}
                disabled={isDeleting}
                title="Delete Vehicle"
                className="w-[34px] h-[34px] rounded-standard bg-status-critical hover:bg-[#b82319] text-white text-[14px] flex items-center justify-center flex-shrink-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-status-critical focus:border-transparent"
              >
                {isDeleting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "🗑️"
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Image Lightbox Preview Modal */}
      {isPreviewOpen && visual.type === "image" && visual.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white rounded-pill hover:bg-white/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setIsPreviewOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-full max-h-full flex items-center justify-center rounded-standard overflow-hidden border border-white/10 shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={visual.url}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-standard"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white select-text">
              <h4 className="text-[16px] font-semibold">
                {vehicle.make} {vehicle.model}
              </h4>
              <p className="text-[12px] text-white/80 mt-0.5">
                {vehicle.category} • {formatCurrency(Number(vehicle.price))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleCard;
