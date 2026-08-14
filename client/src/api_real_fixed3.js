export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getAuthToken = () => localStorage.getItem("authToken");

export const getStoredUser = () => {
  const storedUser = localStorage.getItem("loggedInUser");
  if (!storedUser) return null;
  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("authToken");
};

export const apiFetch = async (path, options = {}) => {
  const headers = { ...(options.headers || {}) };

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const authToken = getAuthToken();
  if (authToken) {
    headers["Authorization"] = \u0060Bearer \u0024{authToken}\u0060;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
};
