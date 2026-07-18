import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { Car, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormInput = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInput) => {
    setServerError(null);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      const message = "Invalid email or password";
      setServerError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-6 font-sans">
      <div className="w-full max-w-[400px] bg-bg-primary border border-border rounded-standard p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-pill bg-brand-subtle-bg flex items-center justify-center">
            <Car className="w-5 h-5 text-brand" />
          </div>
          <h1 className="text-[22px] font-semibold text-text-primary tracking-tight">Sign In</h1>
          <p className="text-[12px] text-text-secondary">DriveDealer Inventory System</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {serverError && (
            <div className="p-3 bg-red-50 border border-status-critical/20 text-status-critical text-[13px] rounded-standard text-center">
              {serverError}
            </div>
          )}

          {/* Email Address */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-text-muted" />
              <input
                type="email"
                {...register("email")}
                className="h-[38px] w-full pl-9 pr-3 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
                placeholder="john@example.com"
              />
            </div>
            {errors.email && (
              <span className="text-status-critical text-[12px] mt-0.5">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[12px] font-medium text-text-secondary">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="h-[38px] w-full pl-9 pr-10 border border-border-strong rounded-standard text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-[14px]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-text-muted hover:text-text-secondary focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
                <span>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border flex justify-center">
          <p className="text-text-secondary text-[14px] mr-2">Don't have an account?</p>
          <Link to="/register" className="text-brand hover:text-brand-hover text-[14px] font-medium transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
