const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Request failed: ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  register: (email, password, isAdmin) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, is_admin: isAdmin }),
    }),

  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getVehicles: () => request("/api/vehicles"),

  searchVehicles: (params) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/vehicles/search?${query}`);
  },

  createVehicle: (vehicle) =>
    request("/api/vehicles", { method: "POST", body: JSON.stringify(vehicle) }),

  updateVehicle: (id, vehicle) =>
    request(`/api/vehicles/${id}`, { method: "PUT", body: JSON.stringify(vehicle) }),

  deleteVehicle: (id) =>
    request(`/api/vehicles/${id}`, { method: "DELETE" }),

  purchaseVehicle: (id) =>
    request(`/api/vehicles/${id}/purchase`, { method: "POST" }),

  restockVehicle: (id, amount) =>
    request(`/api/vehicles/${id}/restock`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
};