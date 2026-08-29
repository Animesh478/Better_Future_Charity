import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "./NotFoundPage.css";

function NotFoundPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="notfound-root">
      <Navbar />

      <div className="notfound-wrap">
        <div className="notfound-card">
          <div className="notfound-stub">
            <span>No. 404</span>
            <span>VOID</span>
          </div>

          <div className="notfound-perforation" />

          <div className="notfound-body">
            <div className="notfound-tag">Page not found</div>
            <h1>This entry isn't in the ledger.</h1>
            <p>
              The page you're looking for may have moved, been renamed, or never
              existed. Let's get you back to somewhere real.
            </p>

            <div className="notfound-actions">
              <Link to="/" className="notfound-btn-solid">
                Browse charities
              </Link>
              {isAuthenticated ? (
                <Link to="/donations" className="notfound-btn-ghost">
                  My donations
                </Link>
              ) : (
                <Link to="/login" className="notfound-btn-ghost">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
