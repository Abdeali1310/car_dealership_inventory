import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../../api/axios";
import { toast } from "sonner";
import { Loader2, X, Upload, Car } from "lucide-react";
import type { Vehicle } from "./VehicleTable";

const VEHICLE_CATEGORIES = [
  { value: "SEDAN", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "TRUCK", label: "Truck" },
  { value: "COUPE", label: "Coupe" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "CONVERTIBLE", label: "Convertible" },
  { value: "VAN", label: "Van" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
];

const vehicleFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  category: z.enum(
    ["SEDAN", "SUV", "TRUCK", "COUPE", "HATCHBACK", "CONVERTIBLE", "VAN", "MOTORCYCLE"],
    { required_error: "Category is required" }
  ),
  price: z.coerce.number().positive("Price must be a positive number"),
  quantity: z.coerce.number().int().nonnegative("Quantity must be a non-negative integer"),
  description: z.string().optional(),
  imageUrl: z.string().optional().or(z.literal("")),
});

type VehicleFormInput = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  initialData?: Vehicle | null;
  onClose: () => void;
  onSuccess: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData = null,
  onClose,
  onSuccess,
}) => {
  const isEditMode = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormInput>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: initialData?.make || "",
      model: initialData?.model || "",
      category: (initialData?.category as any) || "SEDAN",
      price: initialData?.price || 0,
      quantity: initialData?.quantity || 0,
      description: initialData?.description || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/vehicles/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.success) {
        const uploadedUrl = response.data.data.url;
        setValue("imageUrl", uploadedUrl, { shouldValidate: true });
        setPreviewUrl(uploadedUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (error: any) {
      console.error("Image upload error:", error);
      const msg = error.response?.data?.message || "Failed to upload image.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: VehicleFormInput) => {
    try {
      if (isEditMode && initialData) {
        await api.put(`/vehicles/${initialData.id}`, data);
        toast.success(`Successfully updated ${data.make} ${data.model}!`);
      } else {
        await api.post("/vehicles", data);
        toast.success(`Successfully added ${data.make} ${data.model}!`);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Vehicle submit error:", error);
      const msg = error.response?.data?.message || "Failed to save vehicle details.";
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-[500px] bg-bg-primary border border-border rounded-standard p-6 shadow-xl flex flex-col gap-4 animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-form-title"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 id="vehicle-form-title" className="text-[18px] font-semibold text-text-primary">
            {isEditMode ? "Edit Vehicle Details" : "Add New Vehicle"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 text-text-muted hover:text-text-primary rounded-standard hover:bg-bg-secondary transition-all cursor-pointer"
            aria-label="Close form"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <input type="hidden" {...register("imageUrl")} />

          <div className="grid grid-cols-2 gap-3.5">
            {/* Make */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-text-secondary">Make</label>
              <input
                type="text"
                {...register("make")}
                className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
                placeholder="e.g. Toyota"
              />
              {errors.make && (
                <span className="text-status-critical text-[11px] mt-0.5">{errors.make.message}</span>
              )}
            </div>

            {/* Model */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-text-secondary">Model</label>
              <input
                type="text"
                {...register("model")}
                className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
                placeholder="e.g. Camry"
              />
              {errors.model && (
                <span className="text-status-critical text-[11px] mt-0.5">{errors.model.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-text-secondary">Category</label>
              <select
                {...register("category")}
                className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
              >
                {VEHICLE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="text-status-critical text-[11px] mt-0.5">{errors.category.message}</span>
              )}
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-text-secondary">Price (₹)</label>
              <input
                type="number"
                {...register("price")}
                className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
                placeholder="0"
                min="0.01"
                step="any"
              />
              {errors.price && (
                <span className="text-status-critical text-[11px] mt-0.5">{errors.price.message}</span>
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Initial Stock Quantity</label>
            <input
              type="number"
              {...register("quantity")}
              disabled={isEditMode}
              className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px] disabled:bg-bg-secondary disabled:text-text-muted disabled:cursor-not-allowed"
              placeholder="0"
              min="0"
            />
            {isEditMode && (
              <span className="text-text-secondary text-[11px]">
                Stock quantity must be modified via Restock actions.
              </span>
            )}
            {errors.quantity && (
              <span className="text-status-critical text-[11px] mt-0.5">{errors.quantity.message}</span>
            )}
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Vehicle Image</label>
            <div className="flex items-center gap-4 p-3 border border-border rounded-standard bg-bg-secondary">
              {/* Preview Thumbnail */}
              <div className="w-14 h-14 rounded-standard border border-border-strong overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="Vehicle preview" className="w-full h-full object-cover" />
                ) : (
                  <Car className="w-6 h-6 text-text-muted" />
                )}
              </div>

              {/* Upload Action */}
              <div className="flex flex-col gap-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || isSubmitting}
                  className="h-[34px] px-3 border border-border-strong hover:bg-bg-hover hover:text-text-primary bg-white rounded-standard text-[12px] font-medium transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 animate-bounce-slow" />
                      <span>Upload Local Image</span>
                    </>
                  )}
                </button>
                <p className="text-[10px] text-text-secondary">
                  PNG, JPG or WEBP. Uploads to local public folder.
                </p>
              </div>
            </div>
            {errors.imageUrl && (
              <span className="text-status-critical text-[11px] mt-0.5">{errors.imageUrl.message}</span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Description</label>
            <textarea
              {...register("description")}
              className="h-[70px] p-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px] resize-none"
              placeholder="Details about the vehicle..."
            />
            {errors.description && (
              <span className="text-status-critical text-[11px] mt-0.5">{errors.description.message}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-1 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting || uploading}
              className="h-[38px] px-4 border border-border-strong text-text-secondary hover:bg-bg-hover hover:text-text-primary rounded-standard text-[13px] font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="h-[38px] px-5 bg-brand hover:bg-brand-hover text-white rounded-standard text-[13px] font-medium transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditMode ? "Save Changes" : "Add Vehicle"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
