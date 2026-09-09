import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Register.css";

interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ========================================
    // VALIDATION
    // ========================================

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response =
        await api.post<RegisterResponse>(
          "/auth/register",
          {
            name: name.trim(),
            email: email.trim(),
            password,
            confirmPassword,
          }
        );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Registration failed."
        );
        return;
      }

      setSuccess(
        response.data.message ||
          "Account created successfully. Redirecting to login..."
      );

      // Clear form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login
      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Unable to connect to the server. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* ========================================
          BRAND
      ======================================== */}

      <div className="register-brand">
        <Link
          to="/"
          className="register-brand-link"
        >
          <div className="register-brand-icon">
            S
          </div>

          <strong>ShramikSync</strong>
        </Link>
      </div>

      {/* ========================================
          REGISTER CONTAINER
      ======================================== */}

      <main className="register-container">

        <section className="register-card">

          {/* ========================================
              HEADER
          ======================================== */}

          <div className="register-header">

            <span className="register-eyebrow">
              RECRUITMENT MANAGEMENT PLATFORM
            </span>

            <h1>Create an account</h1>

            <p>
              Create your ShramikSync account to get
              started.
            </p>

          </div>

          {/* ========================================
              FORM
          ======================================== */}

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="register-form-group">

              <label
                htmlFor="register-name"
                className="register-form-label"
              >
                Full Name
              </label>

              <input
                id="register-name"
                type="text"
                className="register-form-input"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
              />

            </div>

            {/* EMAIL */}

            <div className="register-form-group">

              <label
                htmlFor="register-email"
                className="register-form-label"
              >
                Email
              </label>

              <input
                id="register-email"
                type="email"
                className="register-form-input"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
              />

            </div>

            {/* PASSWORD */}

            <div className="register-form-group">

              <label
                htmlFor="register-password"
                className="register-form-label"
              >
                Password
              </label>

              <input
                id="register-password"
                type="password"
                className="register-form-input"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                placeholder="Enter your password"
                autoComplete="new-password"
                disabled={loading}
              />

              <span className="register-help">
                Password must contain at least 6
                characters.
              </span>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-form-group">

              <label
                htmlFor="register-confirm-password"
                className="register-form-label"
              >
                Confirm Password
              </label>

              <input
                id="register-confirm-password"
                type="password"
                className="register-form-input"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );
                  setError("");
                  setSuccess("");
                }}
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
              />

            </div>

            {/* MESSAGES */}

            {error && (
              <div
                className="register-message register-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="register-message register-success"
                role="status"
              >
                {success}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="btn btn-primary register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>

          {/* ========================================
              FOOTER
          ======================================== */}

          <div className="register-footer">

            <span>
              Already have an account?
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Register;