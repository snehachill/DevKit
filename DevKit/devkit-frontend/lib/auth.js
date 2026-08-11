// We store the JWT and basic user info in localStorage. This is a real,
// deployed app (not a sandboxed artifact) so localStorage is fine here -
// it persists login across page refreshes and browser restarts, which is
// exactly the behavior we want.

export function saveSession(token, user) {
  localStorage.setItem("devkit_token", token);
  localStorage.setItem("devkit_user", JSON.stringify(user));
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("devkit_token");
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("devkit_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem("devkit_token");
  localStorage.removeItem("devkit_user");
}
