import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { fetchProjectReports } from "../services/impactReportApi";
import Navbar from "../components/Navbar";
import "./ProjectReportsPage.css";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Public page — no auth required, matches GET /api/public/projects/:projectId/reports
// having no authenticateUser in front of it. Reachable by anyone: a guest, a
// donor, or the charity's own owner.
export default function ProjectReportsPage() {
  const { projectId } = useParams();
  const location = useLocation();

  // Passed from CharityDetailPage's Link so this page can show the project's
  // title and which charity it belongs to. There's no public GET
  // /projects/:id endpoint yet, so on a direct link/refresh this is just
  // absent and the page falls back to showing the report list alone.
  const project = location.state?.project;
  const charityName = location.state?.charityName;
  const charityId = location.state?.charityId;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadImpactReports = async function () {
      try {
        const result = await fetchProjectReports(projectId);
        if (!cancelled) {
          setReports(result.reports || []);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadImpactReports();

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return (
    <div className="reports-root">
      <Navbar />

      <section className="reports-hero">
        <Link
          to={charityId ? `/charity/${charityId}` : "/"}
          className="reports-back"
        >
          ← Back to {charityName || "charity"}
        </Link>
        <div className="reports-tag">Impact reports</div>
        <h1>{project?.title || "Project updates"}</h1>
        {project?.description && <p>{project.description}</p>}
      </section>

      <section className="reports-body">
        {loading && <div className="reports-status">Loading updates…</div>}
        {error && <div className="reports-status error">{error}</div>}

        {!loading && !error && reports.length === 0 && (
          <div className="reports-status">No impact updates posted yet.</div>
        )}

        {!loading && !error && reports.length > 0 && (
          <ul className="reports-list">
            {reports.map((r) => (
              <li key={r.id} className="reports-list-item">
                <div className="reports-list-top">
                  <h3>{r.title}</h3>
                  <span>
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <p>{r.content}</p>
                <span className="reports-funds">
                  Funds utilized: {formatINR(r.fundsUtilized)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
