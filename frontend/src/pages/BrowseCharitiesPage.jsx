import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import { fetchCharities, getCategories } from "../services/charityApi";
import Navbar from "../components/Navbar";
// import CharityCard from "../components/charity/CharityCard";
import "./BrowseCharitiesPage.css";
import { useAuth } from "../context/AuthContext";

export default function BrowseCharitiesPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // const categories = getCategories(); // fetch all the categories
  // const [search, setSearch] = useState("");
  // const [activeCategory, setActiveCategory] = useState("All");
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCharities = useCallback(async () => {
    setLoading(true);
    const data = await fetchCharities({ search, category: activeCategory });
    setCharities(data);
    setLoading(false);
  }, [search, activeCategory]);

  // useEffect(() => {
  //   const timeout = setTimeout(loadCharities, 250); // light debounce for search typing
  //   return () => clearTimeout(timeout);
  // }, [loadCharities]);

  // function handleDonateClick(charity) {
  //   // if (!isAuthenticated) {
  //   //   navigate("/login", { state: { from: `/donate/${charity.id}` } });
  //   //   return;
  //   // }
  //   navigate(`/donate/${charity.id}`);
  // }

  return (
    <div className="browse-root">
      <Navbar />

      <section className="browse-hero">
        <div className="browse-hero-tag">
          <span className="dot" />
          {/* {isAuthenticated ? "Welcome back" : "Browsing is open to everyone"} */}
        </div>
        <h1>Charities you can support today</h1>
        <p>
          Explore verified organizations, see how far each goal has come, and
          donate directly.
          {/* {!isAuthenticated &&
            " Sign in when you\u2019re ready to make a donation."} */}
        </p>
      </section>

      <section className="browse-controls">
        <div className="browse-search-row">
          {/* <input
            type="text"
            placeholder="Search charities by name or cause…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          /> */}
        </div>
        <div className="browse-categories">
          {/* {categories.map((cat) => (
            <button
              key={cat}
              className={`browse-pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))} */}
        </div>
      </section>

      <section className="browse-grid-section">
        {/* {loading ? (
          <div className="browse-status">Loading charities…</div>
        ) : charities.length === 0 ? (
          <div className="browse-status">No charities match your search.</div>
        ) : (
          <div className="browse-grid">
            {charities.map((charity) => (
              <CharityCard
                key={charity.id}
                charity={charity}
                onDonateClick={handleDonateClick}
              />
            ))}
          </div>
        )} */}
      </section>
    </div>
  );
}
