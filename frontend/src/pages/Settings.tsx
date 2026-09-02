import { useState } from "react";
import type { FormEvent } from "react";
import API from "../services/api";
import "../styles/Settings.css";

interface PasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

function Settings() {
    const [form, setForm] = useState<PasswordForm>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ========================================
        // FRONTEND VALIDATION
        // ========================================

        if (
            !form.currentPassword ||
            !form.newPassword ||
            !form.confirmPassword
        ) {
            setError("All password fields are required.");
            return;
        }

        if (form.newPassword.length < 6) {
            setError(
                "New password must be at least 6 characters long."
            );
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (form.currentPassword === form.newPassword) {
            setError(
                "New password must be different from the current password."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await API.put(
                "/auth/change-password",
                {
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                    confirmPassword: form.confirmPassword,
                }
            );

            setSuccess(
                response.data.message ||
                "Password changed successfully."
            );

            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                "Failed to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-header">
                <div>
                    <span className="settings-eyebrow">
                        ACCOUNT SETTINGS
                    </span>

                    <h1>Settings</h1>

                    <p>
                        Manage your account security and password.
                    </p>
                </div>
            </div>

            <div className="settings-content">
                <section className="settings-card">
                    <div className="settings-card-header">
                        <div>
                            <h2>Change Password</h2>

                            <p>
                                Update your account password to keep your
                                account secure.
                            </p>
                        </div>
                    </div>

                    {success && (
                        <div className="settings-alert settings-alert-success">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="settings-alert settings-alert-error">
                            {error}
                        </div>
                    )}

                    <form
                        className="settings-form"
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <div className="settings-form-group">
                            <label htmlFor="currentPassword">
                                Current Password
                            </label>

                            <input
  id="currentPassword"
  name="currentPassword"
  type="password"
  value={form.currentPassword}
  onChange={handleChange}
  placeholder="Enter current password"
  autoComplete="off"
/>
                        </div>

                        <div className="settings-form-group">
                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
  id="newPassword"
  name="newPassword"
  type="password"
  value={form.newPassword}
  onChange={handleChange}
  placeholder="Enter new password"
  autoComplete="off"
/>

                            <span className="settings-help">
                                Password must contain at least 6 characters.
                            </span>
                        </div>

                        <div className="settings-form-group">
                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
  id="confirmPassword"
  name="confirmPassword"
  type="password"
  value={form.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm new password"
  autoComplete="off"
/>
                        </div>

                        <div className="settings-form-actions">
                            <button
                                type="button"
                                className="settings-secondary-btn"
                                disabled={loading}
                                onClick={() => {
                                    setForm({
                                        currentPassword: "",
                                        newPassword: "",
                                        confirmPassword: "",
                                    });

                                    setError("");
                                    setSuccess("");
                                }}
                            >
                                Clear
                            </button>

                            <button
                                type="submit"
                                className="settings-primary-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Changing Password..."
                                    : "Change Password"}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Settings;