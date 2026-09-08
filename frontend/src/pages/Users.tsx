import { useState } from "react";
import type { FormEvent } from "react";
import API from "../services/api";
import "../styles/Users.css";

interface UserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "USER" | "ADMIN";
}

function Users() {
  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role,
      });

      setSuccess(
        response.data.message || "User created successfully."
      );

      resetForm();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <span className="users-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Create and manage ShramikSync system users.
          </p>
        </div>
      </div>

      <div className="users-content">
        <section className="users-card">
          <div className="users-card-header">
            <div>
              <h2>Create New User</h2>

              <p>
                Add a new user account to the ShramikSync
                system.
              </p>
            </div>
          </div>

          {success && (
            <div className="users-alert users-alert-success">
              {success}
            </div>
          )}

          {error && (
            <div className="users-alert users-alert-error">
              {error}
            </div>
          )}

          <form
            className="users-form"
            onSubmit={handleSubmit}
          >
            <div className="users-form-row">
              <div className="users-form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  disabled={loading}
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="users-form-row">
              <div className="users-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <span className="users-help">
                  Password must contain at least 6 characters.
                </span>
              </div>

              <div className="users-form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="users-form-group users-role-group">
              <label htmlFor="role">
                User Role
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="USER">
                  USER
                </option>

                <option value="ADMIN">
                  ADMIN
                </option>
              </select>

              <span className="users-help">
                ADMIN users can create and manage system
                users.
              </span>
            </div>

            <div className="users-form-actions">
              <button
                type="button"
                className="users-secondary-btn"
                disabled={loading}
                onClick={resetForm}
              >
                Clear
              </button>

              <button
                type="submit"
                className="users-primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating User..."
                  : "Create User"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Users;