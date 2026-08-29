import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { registerCharity } from "../services/charityApi";
import "./CreateCharityPage.css";

export default function CreateCharityPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    registrationNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Charity name is required.";
    if (!form.description.trim() || form.description.trim().length < 20) {
      errs.description =
        "Give at least a couple of sentences (20+ characters).";
    }
    if (!form.registrationNumber.trim()) {
      errs.registrationNumber = "Registration number is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await registerCharity(form);
      // Redirect into the owner dashboard, which will show the new
      // "Pending" charity and its approval status.
      navigate("/charity/dashboard", { replace: true });
    } catch (err) {
      setBanner({ type: "error", text: err.message });
      setSubmitting(false);
    }
  }

  return (
    <div className="create-charity-root">
      <Navbar />
      <div className="create-charity-wrap">
        <div className="create-charity-card">
          <div className="create-charity-tag">Register your organization</div>
          <h1>Bring your charity onto GiveWell Ledger</h1>
          <p className="create-charity-sub">
            Submit your details below. An admin reviews every submission before
            it goes live — once approved, you'll be able to list projects and
            start accepting donations.
          </p>

          <div className="create-charity-divider" />

          {banner && <div className="create-charity-banner">{banner.text}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="cc-field">
              <label>Charity name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Clean Water Collective"
              />
              {errors.name && <div className="cc-error">{errors.name}</div>}
            </div>

            <div className="cc-field">
              <label>Registration number</label>
              <input
                type="text"
                value={form.registrationNumber}
                onChange={(e) => update("registrationNumber", e.target.value)}
                placeholder="Official registration / license number"
              />
              {errors.registrationNumber && (
                <div className="cc-error">{errors.registrationNumber}</div>
              )}
            </div>

            <div className="cc-field">
              <label>Description</label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="What does your organization do, and who does it serve?"
              />
              {errors.description && (
                <div className="cc-error">{errors.description}</div>
              )}
            </div>

            <button type="submit" className="cc-submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit for review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
