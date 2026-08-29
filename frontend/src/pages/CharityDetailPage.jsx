import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchCharityWithId } from "../services/charityApi";
import Navbar from "../components/Navbar";
import "./CharityDetailPage.css";
import { useAuth } from "../context/AuthContext";
// import { fetchProjectReports } from "../services/impactReportApi";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// function ProjectReportsViewer({ projectId }) {
//   const [reports, setReports] = useState(null); // null = not fetched yet
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     setError(null);

//     fetchProjectReports(projectId)
//       .then((data) => {
//         if (!cancelled) setReports(data.reports || []);
//       })
//       .catch((err) => {
//         if (!cancelled) setError(err.message);
//       })
//       .finally(() => {
//         if (!cancelled) setLoading(false);
//       });

//     return () => {
//       cancelled = true;
//     };
//   }, [projectId]);

//   if (loading)
//     return <div className="detail-reports-status">Loading updates…</div>;
//   if (error) return <div className="detail-reports-status error">{error}</div>;
//   if (reports.length === 0) {
//     return (
//       <div className="detail-reports-status">No impact updates posted yet.</div>
//     );
//   }

//   return (
//     <ul className="detail-reports-list">
//       {reports.map((r) => (
//         <li key={r.id}>
//           <div className="detail-reports-list-top">
//             <strong>{r.title}</strong>
//             <span>{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
//           </div>
//           <p>{r.content}</p>
//           <span className="detail-reports-funds">
//             Funds utilized: {formatINR(r.fundsUtilized)}
//           </span>
//         </li>
//       ))}
//     </ul>
//   );
// }

// Public page — anyone can view a charity's projects. Only the "Donate" click
// on an individual project is gated, matching the dashboard's pattern.
export default function CharityDetailPage() {
  const { charityId } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [prevCharityId, setPrevCharityId] = useState(charityId);
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [expandedReportsId, setExpandedReportsId] = useState(null);

  if (prevCharityId !== charityId) {
    setPrevCharityId(charityId);
    setCharity(null);
    setLoading(true);
    setError(null);
  }

  useEffect(() => {
    let cancelled = false;

    const fetchCharityDetail = async function () {
      try {
        const result = await fetchCharityWithId(charityId);
        setCharity(result);
      } catch (error) {
        if (!cancelled) setError(error.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCharityDetail();

    return () => {
      cancelled = true;
    };
  }, [charityId]);

  function handleDonateClick(project) {
    const destination = `/donate/${project.id}`;
    // if the user is not authenticated, he will be redirected to the login page
    if (!isAuthenticated) {
      navigate("/login", { state: { from: destination } });
      return;
    }
    // Pass the project + charity name along so DonationPage doesn't need its
    // own fetch — there's no public GET /projects/:id endpoint yet.
    navigate(destination, {
      state: { project, charityName: charity.name, charityId: charity.id },
    });
  }

  return (
    <div className="detail-root">
      <Navbar />

      {loading && <div className="detail-status">Loading charity…</div>}
      {error && <div className="detail-status error">{error}</div>}

      {charity && (
        <>
          <section className="detail-hero">
            <div>
              <Link to="/" className="detail-back">
                ← Back to all charities
              </Link>
              <span className="detail-verified">
                Verified · Reg. No. {charity.registrationNumber}
              </span>
            </div>
            <h1>{charity.name}</h1>
            <p>{charity.description}</p>
          </section>

          <section className="detail-projects">
            <h2>Active projects</h2>

            {charity.projects.length === 0 ? (
              <div className="detail-status">
                This charity hasn't listed any projects yet.
              </div>
            ) : (
              <div className="detail-project-list">
                {charity.projects.map((project) => {
                  const pct = Math.min(
                    100,
                    Math.round(
                      (project.raisedAmount / project.goalAmount) * 100,
                    ),
                  );
                  return (
                    <div className="detail-project-card" key={project.id}>
                      <div className="detail-project-top">
                        <h3>{project.title}</h3>
                        <span
                          className={`detail-project-status ${project.status.toLowerCase()}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p>{project.description}</p>

                      <div className="detail-project-progress-track">
                        <div
                          className="detail-project-progress-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="detail-project-progress-labels">
                        <span>{formatINR(project.raisedAmount)} raised</span>
                        <span>
                          {pct}% of {formatINR(project.goalAmount)}
                        </span>
                      </div>

                      <div className="detail-project-actions ">
                        <button
                          className="detail-project-donate"
                          onClick={() => handleDonateClick(project)}
                          disabled={project.status !== "Active"}
                        >
                          {project.status === "Active"
                            ? "Donate to this project"
                            : "Project completed"}
                        </button>

                        <Link
                          to={`/projects/${project.id}/reports`}
                          state={{
                            project,
                            charityName: charity.name,
                            charityId: charity.id,
                          }}
                          className="detail-project-reports-toggle"
                        >
                          View impact reports
                        </Link>
                      </div>

                      {/* {expandedReportsId === project.id && (
                        <div className="detail-reports-panel">
                          <ProjectReportsViewer projectId={project.id} />
                        </div>
                      )} */}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
