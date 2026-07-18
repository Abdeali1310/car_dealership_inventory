import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import type { Vehicle } from "./VehicleTable";

interface RestockDialogProps {
  isOpen: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RestockDialog: React.FC<RestockDialogProps> = ({
  isOpen,
  vehicle,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>("10");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset input when vehicle changes
  useEffect(() => {
    if (isOpen) {
      setAmount("10");
      setError(null);
    }
  }, [isOpen, vehicle]);

  // Support Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseInt(amount, 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Restock amount must be a positive integer");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/vehicles/${vehicle.id}/restock`, { amount: parsedAmount });
      toast.success(`Successfully restocked ${parsedAmount} units for ${vehicle.make} ${vehicle.model}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Restock error:", err);
      const msg = err.response?.data?.message || "Failed to restock vehicle.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[400px] bg-bg-primary border border-border rounded-standard p-6 shadow-xl flex flex-col gap-4 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restock-dialog-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start border-b border-border pb-3">
          <div>
            <h3 id="restock-dialog-title" className="text-[16px] font-semibold text-text-primary">
              Restock Vehicle Inventory
            </h3>
            <p className="text-[12px] text-text-secondary mt-0.5">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-text-muted hover:text-text-primary rounded-standard hover:bg-bg-secondary transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-text-secondary">
              Amount to Restock
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
              placeholder="e.g. 10"
              min="1"
              step="1"
              required
              disabled={isSubmitting}
            />
            {error && (
              <span className="text-status-critical text-[11px] mt-0.5">{error}</span>
            )}
            <p className="text-[11px] text-text-secondary mt-1">
              Current stock: <strong className="text-text-primary">{vehicle.quantity}</strong> units.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-border pt-4 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-[38px] px-4 border border-border-strong text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-standard text-[13px] font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[38px] px-5 bg-brand hover:bg-brand-hover text-white rounded-standard text-[13px] font-medium transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Add Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockDialog;
