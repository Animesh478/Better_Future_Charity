import axiosClient from "./axiosClient";

export async function signupUser(payload) {
  const result = await axiosClient.post("/auth/signup", payload);
  return result;
}

export async function loginUser(payload) {
  const result = await axiosClient.post("/auth/login", payload);
  return result;
}

// clears the http only cookie on the server side
export async function logoutUser() {
  await axiosClient.post("/auth/logout");
}

// GET /api/auth/me -> { user } if the cookie is present and valid, otherwise 401.
// Called once on app load to restore the session, since there's no token in localStorage
// to read anymore — the cookie is the only source of truth.
export async function fetchCurrentUser() {
  const { data } = await axiosClient.get("/user/profile");
  return data;
}
