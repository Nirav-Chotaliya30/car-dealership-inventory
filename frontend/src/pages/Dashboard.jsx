import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadVehicles(params = {}) {
    setLoading(true);
    setError("");
    try {
      const data = Object.keys(params).length
        ? await api.searchVehicles(params)
        : await api.getVehicles();
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  async function handlePurchase(id) {
    try {
      await api.purchaseVehicle(id);
      loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this vehicle?")) return;
    try {
      await api.deleteVehicle(id);
      loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Vehicle Inventory</h1>
        <div className="flex items-center gap-4">
          {user?.is_admin && (
            <button
              onClick={() => navigate("/vehicles/new")}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
            >
              + Add Vehicle
            </button>
          )}
          <span className="text-sm text-slate-600">
            {user?.sub} {user?.is_admin ? "(Admin)" : ""}
          </span>
          <button onClick={logout} className="text-sm text-red-600">Log out</button>
        </div>
      </div>

      <SearchBar onSearch={loadVehicles} />

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : vehicles.length === 0 ? (
        <p className="text-slate-500">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isAdmin={user?.is_admin}
              onPurchase={handlePurchase}
              onEdit={(v) => navigate(`/vehicles/${v.id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}