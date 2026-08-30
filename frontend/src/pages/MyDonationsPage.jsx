import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import { fetchMyDonations, downloadReceipt } from "../services/donationApi";
import "./MyDonationsPage.css";

function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function MyDonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchMyDonations()
      .then((data) => {
        if (!cancelled) setDonations(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Group by charity so "the contribution made to each charity" is visible
  // at a glance, not just as a flat transaction list.
  const byCharity = useMemo(() => {
    const map = new Map();
    for (const donation of donations) {
      const charity = donation.project?.charity;
      const key = charity?.registrationNumber || charity?.name || "Unknown";
      if (!map.has(key)) {
        map.set(key, {
          name: charity?.name || "Unknown charity",
          total: 0,
          count: 0,
        });
      }
      const entry = map.get(key);
      entry.total += donation.donationAmount;
      entry.count += 1;
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [donations]);

  const grandTotal = donations.reduce((sum, d) => sum + d.donationAmount, 0);

  async function handleDownload(donationId) {
    setDownloadingId(donationId);
    try {
      await downloadReceipt(donationId);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="my-donations-root">
      <Navbar />

      <section className="md-hero">
        <div className="md-hero-tag">Your giving record</div>
        <h1>My Donations</h1>
        <p>
          {donations.length > 0
            ? `You've given ${formatINR(grandTotal)} across ${byCharity.length} ${byCharity.length === 1 ? "charity" : "charities"}.`
            : "Every successful donation you make will show up here, with a downloadable receipt."}
        </p>
      </section>

      <section className="md-body">
        {loading && <div className="md-status">Loading your donations…</div>}
        {error && <div className="md-status error">{error}</div>}

        {!loading && !error && donations.length === 0 && (
          <div className="md-status">You haven't made a donation yet.</div>
        )}

        {!loading && !error && donations.length > 0 && (
          <>
            <h2>By charity</h2>
            <div className="md-charity-grid">
              {byCharity.map((c) => (
                <div className="md-charity-card" key={c.name}>
                  <div className="md-charity-name">{c.name}</div>
                  <div className="md-charity-total">{formatINR(c.total)}</div>
                  <div className="md-charity-count">
                    {c.count} {c.count === 1 ? "donation" : "donations"}
                  </div>
                </div>
              ))}
            </div>

            <h2>All transactions</h2>
            <div className="md-table">
              <div className="md-table-head">
                <span>Date</span>
                <span>Charity</span>
                <span>Project</span>
                <span>Amount</span>
                <span></span>
              </div>
              {donations.map((donation) => (
                <div className="md-table-row" key={donation.id}>
                  <span>
                    {new Date(donation.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  <span>{donation.project?.charity?.name}</span>
                  <span>{donation.project?.title}</span>
                  <span>{formatINR(donation.donationAmount)}</span>
                  <span>
                    <button
                      className="md-receipt-btn"
                      onClick={() => handleDownload(donation.id)}
                      disabled={downloadingId === donation.id}
                    >
                      {downloadingId === donation.id ? "…" : "Receipt"}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
