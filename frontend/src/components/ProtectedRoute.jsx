import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  // const navigate = useNavigate();

  // wait for the server to reply
  if (isLoading) {
    return <div>Loading your profile...</div>;
  }

  // if the user is not authenticated, redirect them to login
  if (!isAuthenticated) {
    // navigate("/login");
    return <Navigate to="/login" replace />;
  }

  // with this a donor cannot access an admin dashboard or charity owner dashboard
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // otherwise let the user see the requested page
  return <Outlet />;
}

export default ProtectedRoute;
