import { useState } from "react";
import "./AuthPage.css";
import { loginUser, signupUser } from "../services/authApi";

const today = new Date().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// for each form field
function Field({ label, error, children }) {
  return (
    <div className="auth-field">
      <label className="auth-label">{label}</label>
      <div className="auth-input-row">{children}</div>
      {error && <div className="auth-error-text">{error}</div>}
    </div>
  );
}

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'error' | 'success', text }
  const [justSucceeded, setJustSucceeded] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (fieldErrors[key]) setFieldErrors((e) => ({ ...e, [key]: null }));
  }

  function switchMode(next) {
    setMode(next);
    setBanner(null);
    setFieldErrors({});
  }

  // this is executed when submitting the form
  function validate() {
    const errs = {};
    if (mode === "signup") {
      errs.name = "Please enter your name.";
    }
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!form.password) {
      errs.password = "Password is required.";
    } else if (mode === "signup" && form.password.length < 8) {
      errs.password = "Use at least 8 characters.";
    }
    if (mode === "signup" && form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    if (mode === "signup" && !form.agree) {
      errs.agree = "You must accept the terms to continue.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0; // returns true if no error, else returns false
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBanner(null);
    if (!validate()) return; // does not submit the form if there are validation errors

    setSubmitting(true);
    try {
      if (mode === "login") {
        const data = await loginUser({
          email: form.email,
          password: form.password,
        });
        setJustSucceeded(true);
        setBanner({
          type: "success",
          text: "Signed in. Redirecting to your dashboard…",
        });
        onAuthSuccess?.(data);
      } else {
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
        };
        const data = await signupUser(payload);
        setJustSucceeded(true);
        setBanner({
          type: "success",
          text: "Account created. Welcome aboard!",
        });
        onAuthSuccess?.(data);
      }
    } catch (err) {
      setBanner({ type: "error", text: err.message });
    } finally {
      setSubmitting(false);
      setTimeout(() => setJustSucceeded(false), 1600);
    }
  }

  return (
    <div className="auth-root">
      <div className="auth-shell">
        {/* Left panel */}
        <div className="auth-side">
          <div>
            <div className="auth-mark">
              <span className="dot" />
              BE THE CHANGE LEDGER
            </div>
            <h1 className="auth-headline">
              Every donation
              <br />
              writes a line in <em>someone's</em> story.
            </h1>
            <p className="auth-subcopy">
              Track what you give, see where it lands, and get a clean receipt
              for every rupee — from the first donation to the thousandth.
            </p>
          </div>
        </div>

        {/* Right card */}
        <div className="auth-card-wrap">
          <div className="auth-card">
            <div className="auth-card-inner">
              <div className="auth-receipt-meta">
                <span>{today}</span>
              </div>

              <div className={`auth-stamp ${justSucceeded ? "show" : ""}`}>
                VERIFIED
                <br />✓
              </div>

              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${mode === "login" ? "active" : ""}`}
                  onClick={() => switchMode("login")}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab ${mode === "signup" ? "active" : ""}`}
                  onClick={() => switchMode("signup")}
                >
                  Join
                </button>
              </div>
              <div className="auth-perforation" />

              {banner && (
                <div className={`auth-banner ${banner.type}`}>
                  {banner.text}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* {mode === "signup" && (
                  <div className="auth-role-toggle">
                    <button
                      type="button"
                      className={role === "donor" ? "active" : ""}
                      onClick={() => setRole("donor")}
                    >
                      Donor
                    </button>
                    <button
                      type="button"
                      className={role === "charity" ? "active" : ""}
                      onClick={() => setRole("charity")}
                    >
                      Charity Partner
                    </button>
                  </div>
                )} */}

                {mode === "signup" && (
                  <Field label="Full name" error={fieldErrors.name}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="As it should appear on receipts"
                      autoComplete="name"
                    />
                  </Field>
                )}

                <Field label="Email address" error={fieldErrors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Password" error={fieldErrors.password}>
                  <input
                    // depending on whether we want to show or hide the password, we are switching the input type between text and password
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder={
                      mode === "signup" ? "At least 8 characters" : "••••••••"
                    }
                    autoComplete={
                      mode === "signup" ? "new-password" : "current-password"
                    }
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </Field>

                {mode === "signup" && (
                  <Field
                    label="Confirm password"
                    error={fieldErrors.confirmPassword}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        update("confirmPassword", e.target.value)
                      }
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                  </Field>
                )}

                {mode === "signup" && (
                  <div className="auth-checkbox-row">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => update("agree", e.target.checked)}
                      id="agree"
                    />
                    <label htmlFor="agree">
                      I agree to the terms of service and privacy policy, and
                      confirm the information above is accurate.
                    </label>
                  </div>
                )}
                {mode === "signup" && fieldErrors.agree && (
                  <div
                    className="auth-error-text"
                    style={{ marginTop: "-12px", marginBottom: "16px" }}
                  >
                    {fieldErrors.agree}
                  </div>
                )}

                <button
                  type="submit"
                  className="auth-submit"
                  disabled={submitting}
                >
                  {submitting
                    ? "Please wait…"
                    : mode === "login"
                      ? "Sign In"
                      : "Create Account"}
                </button>
              </form>

              <div className="auth-switch-line">
                {mode === "login" ? (
                  <>
                    New here?{" "}
                    <button type="button" onClick={() => switchMode("signup")}>
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button type="button" onClick={() => switchMode("login")}>
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
