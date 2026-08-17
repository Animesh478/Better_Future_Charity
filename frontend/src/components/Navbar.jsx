import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  console.log("inside navbar");
  console.log("useAuth=", useAuth());
  const { user, setUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    // makes an api call to clear the cookie containing the jwt token when the user logs out
    const logout = async function () {
      try {
        // make a req to the backend to clear the HttpOnly cookie
        // await fetch("http://localhost:8000/api/user/logout", {
        //   method: "POST",
        // });
        console.log("logout initiated");

        // update the state
        setUser(null);

        // redirect the user to the login screen
        navigate("/login");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };
    logout();
    navigate("/");
  }

  return (
    <header className="gwl-navbar">
      {/* navigate to dashboard */}
      <Link to="/" className="gwl-navbar-mark">
        <span className="dot" />
        GIVEWELL LEDGER
      </Link>

      <nav className="gwl-navbar-links">
        <Link to="/">Browse Charities</Link>
        {/* show My Donations link if the user is authenticated */}
        {isAuthenticated && <Link to="/donations">My Donations</Link>}
      </nav>

      <div className="gwl-navbar-actions">
        {isAuthenticated ? (
          <>
            <span className="gwl-navbar-user">
              Hi, {user?.name?.split(" ")[0] || "there"}
            </span>
            <button className="gwl-btn-ghost" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="gwl-btn-ghost">
              Sign In
            </Link>
            <Link to="/login?mode=signup" className="gwl-btn-solid">
              Join
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
