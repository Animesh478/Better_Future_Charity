import axios from "axios";

const API_BASE = "http://localhost:8001/api";

// instead of attaching interceptors to the global axios object, we are creating an Axios instance
const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // max amount of time that the client will wait for a response from the server. After that axios automatically aborts the request and throws an error
  withCredentials: true, // required so the httpOnly auth cookie is sent/received cross-origin
  headers: { "Content-Type": "application/json" },
});

// Without this, every catch(err) across the app would see Axios's generic
// "Request failed with status code 400" instead of the backend's actual
// { message } / { error } — which is what every new error banner (admin
// actions, charity registration, project/report forms) displays to the user.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        // auth.middleware.js already clears the cookie on an expired/invalid
        // token — this just lets AuthProvider know to drop the cached user.
        window.dispatchEvent(new Event("gwl:unauthorized"));
      }

      const message =
        data?.message || data?.error || `Request failed (${status})`;
      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error("Could not reach the server. Please try again."),
      );
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
