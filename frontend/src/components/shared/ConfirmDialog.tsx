import React, { useEffect } from "react";
import { Loader2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: React.ReactNode | string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
  variant?: "brand" | "critical";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isProcessing = false,
  variant = "brand",
}) => {
  // Support Escape key to close the dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[440px] bg-bg-primary border border-border rounded-standard p-6 shadow-xl flex flex-col gap-4 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3
            id="confirm-dialog-title"
            className="text-[18px] font-semibold text-text-primary leading-snug"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1 text-text-muted hover:text-text-primary rounded-standard hover:bg-bg-secondary transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="text-[14px] text-text-secondary leading-relaxed">
          {description}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="h-[38px] px-4 border border-border-strong text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-standard text-[13px] font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`h-[38px] px-4 text-white rounded-standard text-[13px] font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${
              variant === "critical"
                ? "bg-status-critical hover:bg-[#b82319]"
                : "bg-brand hover:bg-brand-hover"
            }`}
          >
            {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
