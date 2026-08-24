import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyDonationStatus } from "../services/donationApi";

export default function DonationStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const donationId = searchParams.get("donation_id");

  const [status, setStatus] = useState("checking"); // checking, success, failed

  useEffect(() => {
    if (!donationId) {
      navigate("/");
      return;
    }

    // Optional but recommended: Ask your backend for the real-time status
    // of this order to ensure it actually succeeded.
    async function verifyStatus() {
      try {
        const status = await verifyDonationStatus(donationId);
        // const data = await response.json();

        if (status === "Success") {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
      }
    }

    verifyStatus();
  }, [donationId, navigate]);

  if (status === "checking") {
    return (
      <div className="donate-wrap">
        <h2>Verifying payment...</h2>
      </div>
    );
  }

  return (
    <div className="donate-wrap">
      <div className="donate-card">
        {status === "success" ? (
          <>
            <h1 style={{ color: "green" }}>Payment Successful!</h1>
            <p>
              Thank you for your donation. Your transaction ID is{" "}
              <code>{donationId}</code>.
            </p>
            {/* The webhook handles sending the email receipt */}
            <p>A receipt has been sent to your email.</p>
          </>
        ) : (
          <>
            <h1 style={{ color: "red" }}>Payment Failed or Pending</h1>
            <p>
              We could not verify your payment immediately. If money was
              deducted, it will be refunded or updated shortly.
            </p>
          </>
        )}

        <div className="donate-divider" />

        {/* Button to navigate back to the charities list or specific project */}
        <Link
          to="/"
          className="donate-submit"
          style={{
            display: "block",
            textAlign: "center",
            textDecoration: "none",
          }}
        >
          Continue Browsing Charities
        </Link>
      </div>
    </div>
  );
}
