import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { createDonationCheckout } from "../services/donationApi";
import Navbar from "../components/Navbar";
import "./DonationPage.css";
import { fetchProjectDetails } from "../services/charityApi";

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// A Cashfree instance can be reused across the session — loading it is async
// and mildly expensive, so do it once, lazily, on first checkout attempt.
let cashfreePromise = null;
async function getCashfree() {
  if (!cashfreePromise) {
    const mode = import.meta.env?.VITE_CASHFREE_MODE || "sandbox";
    cashfreePromise = await load({ mode }); // initializing the SDK and returns a promise that will resolve to a newly created Cashfree object
  }
  return cashfreePromise;
}

export default function DonationPage() {
  const { projectId } = useParams();
  const location = useLocation();

  const [project, setProject] = useState(location.state?.project || null);
  const [charityName, setCharityName] = useState(
    location.state?.charityName || null,
  );
  const [charityId, setCharityId] = useState(location.state?.charityId || null);

  // we are loading only if we already do not have the project details
  const [isLoading, setIsLoading] = useState(!project);
  //   const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!project) {
      async function fetchProject() {
        setIsLoading(true);
        try {
          const data = await fetchProjectDetails(projectId);
          setProject(data.project);
          setCharityId(data.charityId);
          setCharityName(data.charityName);
        } catch {
          setFetchError("Could not fetch project details");
        } finally {
          setIsLoading(false);
        }
      }
      fetchProject();
    }
  }, [projectId, project]);

  const numericAmount = Number(amount);
  const isValidAmount =
    amount !== "" && Number.isFinite(numericAmount) && numericAmount >= 1;

  async function handleDonate(e) {
    e.preventDefault();
    if (!isValidAmount) {
      setError("Enter an amount of at least ₹1.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      // fetching the payment session id from the backend
      const { payment_session_id: paymentSessionId } =
        await createDonationCheckout({
          projectId,
          amount: numericAmount,
        });

      const cashfree = await getCashfree();

      // This redirects the whole tab to Cashfree's hosted checkout page.
      // After payment, Cashfree sends the browser to the backend's
      // GET /api/donations/verify?order_id=... (outside this SPA) while the
      // webhook fulfills the donation server-side in the background.
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
      // No further state updates here — the browser is navigating away.
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="donate-root">
      <Navbar />

      <div className="donate-wrap">
        <div className="donate-card">
          {isLoading ? (
            <div>
              <p>Loading project details...</p>
            </div>
          ) : fetchError ? (
            <div>
              <p>{fetchError}</p>
              {/* let the user donate anyway with the fallback UI */}
              <div className="donate-project-tag">Complete your donation</div>
              <h1>Make a donation</h1>
              <p className="donate-project-desc">
                Project reference: <code>{projectId}</code>
              </p>
            </div>
          ) : project ? (
            <>
              <Link
                to={charityId ? `/charities/${charityId}` : "/"}
                className="donate-back"
              >
                ← Back to project
              </Link>
              <div className="donate-project-tag">
                {charityName
                  ? `Supporting ${charityName}`
                  : "Supporting this project"}
              </div>
              <h1>{project.title}</h1>
              {project.description && (
                <p className="donate-project-desc">{project.description}</p>
              )}
              {project.goalAmount != null && (
                <div className="donate-project-goal">
                  Goal: {formatINR(project.goalAmount)}
                  {project.raisedAmount != null && (
                    <> · Raised so far: {formatINR(project.raisedAmount)}</>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="donate-project-tag">Complete your donation</div>
              <h1>Make a donation</h1>
              <p className="donate-project-desc">
                Project reference: <code>{projectId}</code>
              </p>
            </>
          )}

          <div className="donate-divider" />

          <form onSubmit={handleDonate}>
            <label className="donate-label">Choose an amount (INR)</label>
            <div className="donate-quick-amounts">
              {QUICK_AMOUNTS.map((val) => (
                <button
                  type="button"
                  key={val}
                  className={`donate-chip ${numericAmount === val ? "active" : ""}`}
                  onClick={() => setAmount(String(val))}
                >
                  {formatINR(val)}
                </button>
              ))}
            </div>

            <div className="donate-input-row">
              <span>₹</span>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Enter a custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {error && <div className="donate-error">{error}</div>}

            <button
              type="submit"
              className="donate-submit"
              disabled={submitting || !isValidAmount} // it is either true or false
            >
              {submitting
                ? "Redirecting to Cashfree…"
                : `Donate ${amount ? formatINR(numericAmount || 0) : ""}`}
            </button>

            <p className="donate-fineprint">
              You'll be redirected to Cashfree's secure checkout to complete
              payment.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
