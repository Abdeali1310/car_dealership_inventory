import React from "react";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary p-6 font-sans">
      <div className="w-full max-w-[400px] bg-white border border-border rounded-standard p-6 shadow-sm">
        <h1 className="text-[22px] font-semibold text-text-primary mb-4 text-center">Sign In</h1>
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary text-center">Login page placeholder</p>
          <Link to="/register" className="text-brand hover:text-brand-hover text-center text-[14px]">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
