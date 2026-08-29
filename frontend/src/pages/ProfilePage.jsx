import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/authApi";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, login } = useAuth(); // login() just sets context state — reused here to sync it after a successful edit
  const [form, setForm] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
  });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name can't be empty.";
    if (!/^\d{10}$/.test(form.phoneNumber.trim())) {
      errs.phoneNumber = "Enter a 10-digit phone number.";
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
      const updatedUser = await updateUserProfile({
        name: form.name,
        phoneNumber: form.phoneNumber,
      });
      login(updatedUser); // refresh AuthContext so the navbar greeting updates immediately
      setBanner({ type: "success", text: "Profile updated." });
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="profile-root">
      <Navbar />

      <div className="profile-wrap">
        <div className="profile-card">
          <div className="profile-tag">Account settings</div>
          <h1>My profile</h1>

          <div className="profile-role-line">
            Signed in as <span>{user?.role}</span>
          </div>

          <div className="profile-divider" />

          {banner && (
            <div className={`profile-banner ${banner.type}`}>{banner.text}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="pf-field">
              <label>Email</label>
              <input type="email" value={user?.email || ""} disabled />
              <span className="pf-hint">Email can't be changed here.</span>
            </div>

            <div className="pf-field">
              <label>Full name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
              {errors.name && <div className="pf-error">{errors.name}</div>}
            </div>

            <div className="pf-field">
              <label>Phone number</label>
              <input
                type="tel"
                value={form.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                placeholder="10-digit mobile number"
              />
              {errors.phoneNumber && (
                <div className="pf-error">{errors.phoneNumber}</div>
              )}
            </div>

            <button type="submit" className="pf-submit" disabled={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
