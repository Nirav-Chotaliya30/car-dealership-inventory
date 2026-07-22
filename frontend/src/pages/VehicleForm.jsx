import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function VehicleForm() {
  const { id } = useParams(); // undefined for "new", a number for "edit"
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (!isEditMode) return;

    async function loadVehicle() {
      try {
        const vehicles = await api.getVehicles();
        const vehicle = vehicles.find((v) => v.id === Number(id));
        if (!vehicle) throw new Error("Vehicle not found");
        setMake(vehicle.make);
        setModel(vehicle.model);
        setCategory(vehicle.category);
        setPrice(vehicle.price);
        setQuantity(vehicle.quantity);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadVehicle();
  }, [id, isEditMode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      make,
      model,
      category,
      price: Number(price),
      quantity: Number(quantity),
    };

    try {
      if (isEditMode) {
        await api.updateVehicle(id, payload);
      } else {
        await api.createVehicle(payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-canvas flex items-center justify-center text-muted">Loading...</div>;
  }

  const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition";

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-sm">
        <h1 className="font-display text-xl font-bold text-navy mb-6">
          {isEditMode ? "Edit Vehicle" : "Add Vehicle"}
        </h1>

        {error && <p className="text-stock-out text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <label className="block text-xs font-medium text-muted mb-1">Make</label>
        <input value={make} onChange={(e) => setMake(e.target.value)} className={inputClass} required />

        <label className="block text-xs font-medium text-muted mb-1">Model</label>
        <input value={model} onChange={(e) => setModel(e.target.value)} className={inputClass} required />

        <label className="block text-xs font-medium text-muted mb-1">Category</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} required />

        <label className="block text-xs font-medium text-muted mb-1">Price</label>
        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} required />

        <label className="block text-xs font-medium text-muted mb-1">Quantity</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClass} required />

        <div className="flex gap-3 mt-2">
          <button type="submit" className="flex-1 bg-navy text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition">
            {isEditMode ? "Save Changes" : "Add Vehicle"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard")} className="px-4 py-2.5 border border-slate-200 rounded-lg text-muted hover:bg-slate-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}