import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VehicleForm from "./pages/VehicleForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/new"
        element={
          <ProtectedRoute>
            <VehicleForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/:id/edit"
        element={
          <ProtectedRoute>
            <VehicleForm />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;