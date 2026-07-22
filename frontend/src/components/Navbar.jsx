import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-navy px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-accent">
          <path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13M5 13h14v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          <circle cx="7.5" cy="16.5" r="1.2" fill="currentColor"/>
          <circle cx="16.5" cy="16.5" r="1.2" fill="currentColor"/>
        </svg>
        <span className="font-display font-bold text-white text-lg tracking-tight">
          Dealership<span className="text-accent">OS</span>
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-5">
          <span className="text-sm text-slate-300">
            {user.sub} {user.is_admin && <span className="text-accent font-medium">· Admin</span>}
          </span>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="text-sm text-slate-300 hover:text-white transition"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}