// authApi.js
// Thin wrapper around the Express + Sequelize auth endpoints.
// Adjust API_BASE to match how your app exposes env vars (Vite: import.meta.env.VITE_API_URL,
// Create React App: process.env.REACT_APP_API_URL).

const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "http://localhost:5000/api";

async function request(path, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send/receive httpOnly cookie if you issue the JWT that way
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return data;
}

// Expected backend contract (adjust to match your routes):
// POST /api/auth/signup { name, email, password, role: 'donor' | 'charity', orgName? }
//   -> 201 { user: { id, name, email, role }, token }
// POST /api/auth/login  { email, password }
//   -> 200 { user: { id, name, email, role }, token }

export function signupUser(payload) {
  return request("/auth/signup", payload);
}

export function loginUser(payload) {
  return request("/auth/login", payload);
}
