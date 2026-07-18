import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Car, Loader2 } from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormInput = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormInput) => {
    setServerError(null);
    try {
      await register(data.fullName, data.email, data.password);
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      const message = error.response?.data?.message || "Registration failed. Please try again.";
      setServerError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-6 font-sans">
      <div className="w-full max-w-[400px] bg-bg-primary border border-border rounded-standard p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-pill bg-brand-subtle-bg flex items-center justify-center">
            <Car className="w-5 h-5 text-brand" />
          </div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">Create Account</h1>
          <p className="text-[12px] text-text-secondary">Join DriveDealer Inventory System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="p-3 bg-red-50 border border-status-critical/20 text-status-critical text-[13px] rounded-standard">
              {serverError}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Full Name</label>
            <input
              type="text"
              {...registerField("fullName")}
              className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
              placeholder="John Doe"
            />
            {errors.fullName && (
              <span className="text-status-critical text-[12px] mt-0.5">{errors.fullName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Email Address</label>
            <input
              type="email"
              {...registerField("email")}
              className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
              placeholder="john@example.com"
            />
            {errors.email && (
              <span className="text-status-critical text-[12px] mt-0.5">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Password</label>
            <input
              type="password"
              {...registerField("password")}
              className="h-[38px] px-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
              placeholder="••••••••"
            />
            {errors.password && (
              <span className="text-status-critical text-[12px] mt-0.5">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[40px] w-full bg-brand hover:bg-brand-hover disabled:bg-bg-secondary disabled:text-text-muted text-white text-[14px] font-medium rounded-standard transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border flex justify-center">
          <Link to="/login" className="text-brand hover:text-brand-hover text-[14px] font-medium transition-colors">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
