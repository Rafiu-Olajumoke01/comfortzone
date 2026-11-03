const API = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function getTokens() {
  if (typeof window === "undefined") return null;
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");
  return access ? { access, refresh } : null;
}

export function saveTokens({ access, refresh }) {
  localStorage.setItem("access", access);
  if (refresh) localStorage.setItem("refresh", refresh);
}

export function clearTokens() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}

export function errorText(err) {
  const d = err && err.data;
  if (!d) return "Something went wrong. Please try again.";
  if (typeof d === "string") return d;
  if (d.detail) return d.detail;
  return Object.values(d).flat().join(" ");
}

async function refreshAccess() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return false;
  const res = await fetch(`${API}/api/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return false;
  const data = await res.json();
  localStorage.setItem("access", data.access);
  return true;
}

export async function api(path, { method = "GET", body, auth = false } = {}) {
  const run = () => {
    const headers = { "Content-Type": "application/json" };
    if (auth) headers.Authorization = `Bearer ${localStorage.getItem("access")}`;
    return fetch(`${API}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  let res = await run();
  if (res.status === 401 && auth && (await refreshAccess())) res = await run();
  const data = await res.json().catch(() => null);
  if (!res.ok) throw { status: res.status, data };
  return data;
}