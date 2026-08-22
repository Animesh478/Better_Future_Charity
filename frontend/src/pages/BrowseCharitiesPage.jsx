import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./BrowseCharitiesPage.css";
import { useAuth } from "../context/AuthContext";
import { fetchCharities } from "../services/charityApi";
import CharityCard from "../components/CharityCard";

export default function BrowseCharitiesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({
    charities: [],
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);

  const loadCharities = useCallback(async () => {
    // console.log("inside load charities function");
    setLoading(true);
    try {
      const data = await fetchCharities({ search, page, limit: 10 });
      console.log(data);
      setResult(data);
    } catch {
      setResult({ charities: [], totalPages: 1, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timeout = setTimeout(loadCharities, 250); // light debounce for search typing
    return () => clearTimeout(timeout);
  }, [loadCharities]);

  // useEffect(() => {
  //   setPage(1); // reset to page 1 whenever the search term changes
  // }, [search]);

  function handleViewCharity(charity) {
    // Viewing a charity's projects is public; the login gate now lives on the
    // per-project "Donate" button inside CharityDetailPage.
    navigate(`/charities/${charity.id}`);
  }

  const { charities, totalPages, totalItems } = result;
  // console.log("charities", charities);

  return (
    <div className="browse-root">
      <Navbar />

      <section className="browse-hero">
        <div className="browse-hero-tag">
          <span className="dot" />
          {isAuthenticated ? "Welcome back" : "Browsing is open to everyone"}
        </div>
        <h1>Charities you can support today</h1>
        <p>
          Explore verified organizations and donate directly.
          {!isAuthenticated &&
            " Sign in when you\u2019re ready to make a donation."}
        </p>
      </section>

      <section className="browse-controls">
        <div className="browse-search-row">
          <input
            type="text"
            placeholder="Search charities by name or cause…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <section className="browse-grid-section">
        {loading ? (
          <div className="browse-status">Loading charities…</div>
        ) : charities.length === 0 ? (
          <div className="browse-status">No charities match your search.</div>
        ) : (
          <>
            <div className="browse-grid">
              {charities.map((charity) => (
                <CharityCard
                  key={charity.id}
                  charity={charity}
                  onDonateClick={handleViewCharity}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="browse-pagination">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages} · {totalItems} charities
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
