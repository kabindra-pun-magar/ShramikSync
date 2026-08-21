import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Login.css";

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError(
        "Please enter your email address and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post<LoginResponse>(
        "/auth/login",
        {
          email: email.trim(),
          password,
        }
      );

      if (!response.data.success || !response.data.token) {
        setError(
          response.data.message || "Login failed."
        );
        return;
      }

      localStorage.setItem(
        "token",
        response.data.token
      );

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 500);

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
    <div className="login-page">

      <div className="login-brand">
        <Link to="/" className="login-brand-link">
          <div className="login-brand-icon">
            S
          </div>

          <strong>ShramikSync</strong>
        </Link>
      </div>


      <main className="login-container">

        <section className="login-card">

          <div className="login-header">

            <span className="login-eyebrow">
              RECRUITMENT MANAGEMENT PLATFORM
            </span>

            <h1>Welcome back</h1>

            <p>
              Sign in to your ShramikSync account.
            </p>

          </div>


          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group">

              <label
                htmlFor="email"
                className="form-label"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                className={`form-input ${
                  error ? "error" : ""
                }`}
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Enter your email"
                autoComplete="email"
              />

            </div>


            <div className="form-group">

              <label
                htmlFor="password"
                className="form-label"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                className={`form-input ${
                  error ? "error" : ""
                }`}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
              />

            </div>


            {error && (
              <div
                className="login-message login-error"
                role="alert"
              >
                {error}
              </div>
            )}


            {success && (
              <div
                className="login-message login-success"
                role="status"
              >
                {success}
              </div>
            )}


            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>


          <div className="login-footer">

            <span>
              Don't have an account?
            </span>

            <Link to="/signup">
              Create an account
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Login;