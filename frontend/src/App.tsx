import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import ManageVehicles from "./pages/admin/ManageVehicles";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="max-w-[1200px] mx-auto">
                    <Dashboard />
                  </main>
                </>
              }
            />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route
              path="/admin/vehicles"
              element={
                <>
                  <Navbar />
                  <main className="max-w-[1200px] mx-auto">
                    <ManageVehicles />
                  </main>
                </>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
