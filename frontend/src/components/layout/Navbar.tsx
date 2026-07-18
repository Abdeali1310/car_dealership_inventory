import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Car } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="h-[60px] bg-bg-secondary border-b border-border px-6 flex items-center justify-between font-sans">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-text-primary text-[16px]">
          <Car className="w-4 h-4 text-brand" />
          <span>DriveDealer</span>
        </Link>
        <div className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-[14px] font-medium transition-colors hover:text-brand ${
                isActive ? "text-brand" : "text-text-secondary"
              }`
            }
          >
            Dashboard
          </NavLink>
          {user.role === "ADMIN" && (
            <NavLink
              to="/admin/vehicles"
              className={({ isActive }) =>
                `text-[14px] font-medium transition-colors hover:text-brand ${
                  isActive ? "text-brand" : "text-text-secondary"
                }`
              }
            >
              Manage Vehicles
            </NavLink>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[14px] text-text-primary font-medium">{user.fullName}</span>
          <span
            className={`px-2 py-0.5 text-[11px] font-medium rounded-pill ${
              user.role === "ADMIN"
                ? "bg-brand-subtle-bg text-brand"
                : "bg-bg-hover text-text-secondary border border-border"
            }`}
          >
            {user.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border-strong text-text-secondary hover:text-brand hover:border-brand rounded-standard text-[12px] font-medium bg-white transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
