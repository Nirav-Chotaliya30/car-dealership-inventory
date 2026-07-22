import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <button onClick={logout} className="text-sm text-red-600">Log out</button>
      </div>
      <p className="text-slate-600">Logged in as: {user?.sub} {user?.is_admin ? "(Admin)" : ""}</p>
    </div>
  );
}