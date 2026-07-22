import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.register(email, password, false);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  }

  const inputClass = "w-full border border-slate-200 rounded-lg px-3 py-2.5 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition";

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-accent">
            <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13M5 13h14v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            <circle cx="7.5" cy="16.5" r="1.2" fill="currentColor"/>
            <circle cx="16.5" cy="16.5" r="1.2" fill="currentColor"/>
          </svg>
          <span className="font-display font-bold text-navy">Dealership<span className="text-accent">OS</span></span>
        </div>

        <h1 className="font-display text-xl font-bold text-navy mb-6">Create an account</h1>

        {error && <p className="text-stock-out text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <label className="block text-xs font-medium text-muted mb-1">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />

        <label className="block text-xs font-medium text-muted mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />

        <button type="submit" className="w-full bg-navy text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition mt-2">
          Register
        </button>

        <p className="text-sm text-muted mt-5 text-center">
          Already have an account? <Link to="/login" className="text-accent font-medium">Log in</Link>
        </p>
      </form>
    </div>
  );
}