import axios from "axios";

const API_BASE = "http://localhost:8001/api";

// instead of attaching interceptors to the global axios object, we are creating an Axios instance
const axiosClient = axios.create({
  baseURL: API_BASE,
  timeout: 15000, // max amount of time that the client will wait for a response from the server. After that axios automatically aborts the request and throws an error
  withCredentials: true, // required so the httpOnly auth cookie is sent/received cross-origin
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
