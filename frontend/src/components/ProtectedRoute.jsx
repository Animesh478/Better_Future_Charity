import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticatd, isLoading } = useAuth();
  // const navigate = useNavigate();

  // wait for the server to reply
  if (isLoading) {
    return <div>Loading your profile...</div>;
  }

  // if the user is not authenticated, redirect them to login
  if (!isAuthenticatd) {
    // navigate("/login");
    <Navigate to="/login" replace />;
  }

  // otherwise let the user see the requested page
  return <Outlet />;
}

export default ProtectedRoute;
