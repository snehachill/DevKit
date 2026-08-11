const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// A thin wrapper around fetch that:
//  - prefixes every call with the backend's base URL
//  - attaches the JWT (from localStorage) to the Authorization header
//  - throws a real Error with the server's message on non-2xx responses,
//    so calling code can just try/catch instead of checking res.ok everywhere
async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = typeof window !== "undefined" ? localStorage.getItem("devkit_token") : null;
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

export const api = {
  register: (email, password, name) =>
    apiFetch("/api/auth/register", { method: "POST", body: { email, password, name }, auth: false }),

  login: (email, password) =>
    apiFetch("/api/auth/login", { method: "POST", body: { email, password }, auth: false }),

  createLink: (longUrl) => apiFetch("/api/links", { method: "POST", body: { longUrl } }),

  listLinks: () => apiFetch("/api/links"),
};

export { API_URL };
