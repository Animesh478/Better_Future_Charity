import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchMyCharity } from "../services/charityApi";
import { createProject } from "../services/projectApi";
import {
  generateImpactReport,
  fetchProjectReports,
} from "../services/impactReportApi";
import "./CharityDashboardPage.css";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function NewProjectForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    goalAmount: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const goalAmount = Number(form.goalAmount);
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !goalAmount ||
      goalAmount <= 0
    ) {
      setError(
        "Fill in a title, description, and a goal amount greater than 0.",
      );
      return;
    }
    setSubmitting(true);
    try {
      const project = await createProject({
        title: form.title,
        description: form.description,
        goalAmount,
      });
      onCreated(project);
      setForm({ title: "", description: "", goalAmount: "" });
      setOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button className="cd-new-project-toggle" onClick={() => setOpen(true)}>
        + Start a new project
      </button>
    );
  }

  return (
    <form className="cd-new-project-form" onSubmit={handleSubmit}>
      <div className="cd-field">
        <label>Project title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="e.g. Bore-well installation, Phase 2"
        />
      </div>
      <div className="cd-field">
        <label>Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="What will this project fund?"
        />
      </div>
      <div className="cd-field">
        <label>Goal amount (INR)</label>
        <input
          type="number"
          min="1"
          value={form.goalAmount}
          onChange={(e) =>
            setForm((f) => ({ ...f, goalAmount: e.target.value }))
          }
          placeholder="500000"
        />
      </div>
      {error && <div className="cd-error">{error}</div>}
      <div className="cd-new-project-actions">
        <button
          type="button"
          className="cd-btn-ghost"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button type="submit" className="cd-btn-solid" disabled={submitting}>
          {submitting ? "Creating…" : "Create project"}
        </button>
      </div>
    </form>
  );
}

function ImpactReportsPanel({ project }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    fundsUtilized: "",
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadReports = useCallback(async () => {
    // setLoading(true);
    try {
      const data = await fetchProjectReports(project.id);
      // setReports(data.reports || []);
      return data.reports || [];
    } catch {
      return [];
      // setReports([]);
    }
    // finally {
    //   setLoading(false);
    // }
  }, [project.id]);

  useEffect(() => {
    let isMounted = true;
    const doInitialLoad = async function () {
      const result = await loadReports();
      // this check is used so that if the component has unmounted before the api call fetches the data,then isMounted will be false (because the cleanup function will run) and the state updating functions will not run. hence it will not result in state leaks
      if (isMounted) {
        setReports(result);
        setLoading(false);
      }
    };
    if (project?.id) {
      doInitialLoad();
    }

    // so if the user navigated away while the data was loading,React will have already executed the cleanup function, flipping the isMounted value to false. so the if(isMounted) check will fail and the state updates are safely skipped.
    return () => {
      isMounted = false;
    };
  }, [loadReports, project?.id]);

  const refreshReports = async function () {
    setLoading(true);
    const data = await loadReports();
    setReports(data);
    setLoading(false);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const fundsUtilized = Number(form.fundsUtilized);
    if (
      !form.title.trim() ||
      !form.content.trim() ||
      !fundsUtilized ||
      fundsUtilized <= 0
    ) {
      setError(
        "Fill in a title, an update, and funds utilized greater than 0.",
      );
      return;
    }
    setSubmitting(true);
    try {
      await generateImpactReport(project.id, {
        title: form.title,
        content: form.content,
        fundsUtilized,
      });
      setForm({ title: "", content: "", fundsUtilized: "" });
      setShowForm(false);
      refreshReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="cd-reports-panel">
      {loading ? (
        <div className="cd-reports-status">Loading updates…</div>
      ) : reports.length === 0 ? (
        <div className="cd-reports-status">No impact updates posted yet.</div>
      ) : (
        <ul className="cd-reports-list">
          {reports.map((r) => (
            <li key={r.id}>
              <div className="cd-reports-list-top">
                <strong>{r.title}</strong>
                <span>{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <p>{r.content}</p>
              <span className="cd-reports-funds">
                Funds utilized: {formatINR(r.fundsUtilized)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <form className="cd-report-form" onSubmit={handleSubmit}>
          <div className="cd-field">
            <label>Update title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="e.g. Well #3 completed"
            />
          </div>
          <div className="cd-field">
            <label>What happened</label>
            <textarea
              rows={3}
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              placeholder="Describe the progress donors funded"
            />
          </div>
          <div className="cd-field">
            <label>Funds utilized (INR)</label>
            <input
              type="number"
              min="1"
              value={form.fundsUtilized}
              onChange={(e) =>
                setForm((f) => ({ ...f, fundsUtilized: e.target.value }))
              }
              placeholder="120000"
            />
          </div>
          {error && <div className="cd-error">{error}</div>}
          <div className="cd-new-project-actions">
            <button
              type="button"
              className="cd-btn-ghost"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cd-btn-solid"
              disabled={submitting}
            >
              {submitting ? "Posting…" : "Post update"}
            </button>
          </div>
        </form>
      ) : (
        <button
          className="cd-new-project-toggle small"
          onClick={() => setShowForm(true)}
        >
          + Post an impact update
        </button>
      )}
    </div>
  );
}

export default function CharityDashboardPage() {
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyCharity()
      .then((data) => {
        if (!cancelled) setCharity(data);
      })
      .catch((err) => {
        if (
          !cancelled &&
          err.message?.toLowerCase().includes("not registered")
        ) {
          setNotFound(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleProjectCreated(project) {
    setCharity((c) => ({ ...c, projects: [project, ...(c.projects || [])] }));
  }

  if (loading) {
    return (
      <div className="cd-root">
        <Navbar />
        <div className="cd-status">Loading your charity…</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="cd-root">
        <Navbar />
        <div className="cd-empty">
          <h1>You haven't registered a charity yet</h1>
          <p>Set up your organization's profile to start listing projects.</p>
          <Link to="/charity/register" className="cd-btn-solid">
            Register a charity
          </Link>
        </div>
      </div>
    );
  }

  const statusClass = charity.status.toLowerCase();

  return (
    <div className="cd-root">
      <Navbar />

      <section className="cd-hero">
        <span className={`cd-status-badge ${statusClass}`}>
          {charity.status}
        </span>
        <h1>{charity.name}</h1>
        <p>{charity.description}</p>
        <div className="cd-reg">Reg. No. {charity.registrationNumber}</div>
      </section>

      <section className="cd-body">
        {charity.status === "Pending" && (
          <div className="cd-notice">
            Your charity is awaiting admin approval. You'll be able to create
            projects once it's approved.
          </div>
        )}
        {charity.status === "Rejected" && (
          <div className="cd-notice error">
            Your charity's registration was rejected. Contact support for
            details.
          </div>
        )}
        {charity.status === "Suspended" && (
          <div className="cd-notice error">
            Your charity is currently suspended and isn't visible to donors.
          </div>
        )}

        {charity.status === "Approved" && (
          <>
            <h2>Your projects</h2>
            <NewProjectForm onCreated={handleProjectCreated} />

            {!charity.projects || charity.projects.length === 0 ? (
              <div className="cd-status">
                No projects yet — create your first one above.
              </div>
            ) : (
              <div className="cd-project-list">
                {charity.projects.map((project) => {
                  const pct = Math.min(
                    100,
                    Math.round(
                      (project.raisedAmount / project.goalAmount) * 100,
                    ),
                  );
                  const isExpanded = expandedProjectId === project.id;
                  return (
                    <div className="cd-project-card" key={project.id}>
                      <div className="cd-project-top">
                        <h3>{project.title}</h3>
                        <span
                          className={`cd-project-status ${project.status?.toLowerCase()}`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p>{project.description}</p>
                      <div className="cd-project-progress-track">
                        <div
                          className="cd-project-progress-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="cd-project-progress-labels">
                        <span>{formatINR(project.raisedAmount)} raised</span>
                        <span>
                          {pct}% of {formatINR(project.goalAmount)}
                        </span>
                      </div>

                      <button
                        className="cd-toggle-reports"
                        onClick={() =>
                          setExpandedProjectId(isExpanded ? null : project.id)
                        }
                      >
                        {isExpanded
                          ? "Hide impact updates"
                          : "Manage impact updates"}
                      </button>

                      {isExpanded && <ImpactReportsPanel project={project} />}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
