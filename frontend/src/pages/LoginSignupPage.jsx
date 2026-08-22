import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import { useAuth } from "../context/AuthContext";
import { fetchCurrentUser } from "../services/authApi";

function LoginSignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSuccess = async function () {
    try {
      const result = await fetchCurrentUser();
      login(result);
      navigate("/");
    } catch (error) {
      console.error("Failed to load user profile", error);
    }
  };
  return <AuthPage onLoginSuccess={handleLoginSuccess}></AuthPage>;
}

export default LoginSignupPage;
