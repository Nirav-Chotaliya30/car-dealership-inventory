import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import VehicleCard from "../components/VehicleCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const { user } = useAuth();
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

  async function handleRestock(id) {
    const amount = prompt("How many units to add?");
    if (!amount) return;

    const parsed = Number(amount);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      alert("Please enter a positive whole number.");
      return;
    }

    try {
      await api.restockVehicle(id, parsed);
      loadVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-bold text-navy">Vehicle Inventory</h1>
          {user?.is_admin && (
            <button
              onClick={() => navigate("/vehicles/new")}
              className="bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
            >
              + Add Vehicle
            </button>
          )}
        </div>

        <SearchBar onSearch={loadVehicles} />

        {error && <p className="text-stock-out text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : vehicles.length === 0 ? (
          <p className="text-muted">No vehicles found.</p>
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
                onRestock={handleRestock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}