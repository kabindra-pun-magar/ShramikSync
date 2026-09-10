import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Countries.css";

type CountryStatus = "ACTIVE" | "INACTIVE";

interface Country {
  id: number;
  name: string;
  iso2Code: string | null;
  iso3Code: string | null;
  callingCode: string | null;
  status: CountryStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: number;
    name: string;
    email: string;
  };
}

interface CountryFormData {
  name: string;
  iso2Code: string;
  iso3Code: string;
  callingCode: string;
  status: CountryStatus;
}

const emptyForm: CountryFormData = {
  name: "",
  iso2Code: "",
  iso3Code: "",
  callingCode: "",
  status: "ACTIVE",
};

const Countries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "" | CountryStatus
  >("");

  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] =
    useState<Country | null>(null);

  const [formData, setFormData] =
    useState<CountryFormData>(emptyForm);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [currentUser, setCurrentUser] =
    useState<any>(null);

  // ============================================================
  // CURRENT USER
  // ============================================================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error(
        "Failed to read current user:",
        error
      );
    }
  }, []);

  // ============================================================
  // PERMISSIONS
  // ============================================================

  const canManage =
    currentUser?.role === "ADMIN" ||
    currentUser?.role === "SUPER_ADMIN";

  const isSuperAdmin =
    currentUser?.role === "SUPER_ADMIN";

  // ============================================================
  // FETCH COUNTRIES
  // ============================================================

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError("");

      const params: Record<string, string> = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await api.get("/countries", {
        params,
      });

      setCountries(response.data.countries || []);
    } catch (error: any) {
      console.error(
        "Failed to fetch countries:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load countries."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchCountries();
  }, [search, statusFilter]);

  // ============================================================
  // CLEAR MESSAGES
  // ============================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ============================================================
  // OPEN CREATE MODAL
  // ============================================================

  const handleAddCountry = () => {
    clearMessages();

    setEditingCountry(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const handleEditCountry = (country: Country) => {
    clearMessages();

    setEditingCountry(country);

    setFormData({
      name: country.name,
      iso2Code: country.iso2Code || "",
      iso3Code: country.iso3Code || "",
      callingCode: country.callingCode || "",
      status: country.status,
    });

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCloseModal = () => {
    if (submitting) return;

    setShowModal(false);
    setEditingCountry(null);
    setFormData(emptyForm);
  };

  // ============================================================
  // FORM INPUT
  // ============================================================

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "iso2Code" || name === "iso3Code"
          ? value.toUpperCase()
          : value,
    }));
  };

  // ============================================================
  // SUBMIT FORM
  // ============================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    clearMessages();

    if (!formData.name.trim()) {
      setError("Country name is required.");
      return;
    }

    if (
      formData.iso2Code &&
      !/^[A-Z]{2}$/.test(formData.iso2Code)
    ) {
      setError(
        "ISO 2 code must contain exactly 2 letters."
      );
      return;
    }

    if (
      formData.iso3Code &&
      !/^[A-Z]{3}$/.test(formData.iso3Code)
    ) {
      setError(
        "ISO 3 code must contain exactly 3 letters."
      );
      return;
    }

    if (
      formData.callingCode &&
      !/^\+[1-9][0-9]{0,3}$/.test(
        formData.callingCode
      )
    ) {
      setError(
        "Calling code must be in a valid format such as +977."
      );
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: formData.name.trim(),
        iso2Code:
          formData.iso2Code.trim() || null,
        iso3Code:
          formData.iso3Code.trim() || null,
        callingCode:
          formData.callingCode.trim() || null,
        status: formData.status,
      };

      if (editingCountry) {
        await api.put(
          `/countries/${editingCountry.id}`,
          payload
        );

        setSuccess(
          "Country updated successfully."
        );
      } else {
        await api.post(
          "/countries",
          payload
        );

        setSuccess(
          "Country created successfully."
        );
      }

      handleCloseModal();

      await fetchCountries();
    } catch (error: any) {
      console.error(
        "Country save error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save country."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // TOGGLE STATUS
  // ============================================================

  const handleToggleStatus = async (
    country: Country
  ) => {
    const nextStatus =
      country.status === "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        nextStatus === "ACTIVE"
          ? "activate"
          : "deactivate"
      } ${country.name}?`
    );

    if (!confirmed) return;

    try {
      clearMessages();

      await api.patch(
        `/countries/${country.id}/status`,
        {
          status: nextStatus,
        }
      );

      setSuccess(
        `${country.name} is now ${nextStatus.toLowerCase()}.`
      );

      await fetchCountries();
    } catch (error: any) {
      console.error(
        "Country status update error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update country status."
      );
    }
  };

  // ============================================================
  // DELETE COUNTRY
  // ============================================================

  const handleDeleteCountry = async (
    country: Country
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${country.name}?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      clearMessages();

      await api.delete(
        `/countries/${country.id}`
      );

      setSuccess(
        `${country.name} deleted successfully.`
      );

      await fetchCountries();
    } catch (error: any) {
      console.error(
        "Country delete error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete country."
      );
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="countries-page">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="countries-header">

        <div>
          <h1>Country Management</h1>

          <p>
            Manage countries used across
            ShramikSync recruitment operations.
          </p>
        </div>

        {canManage && (
          <button
            className="countries-primary-btn"
            onClick={handleAddCountry}
          >
            <span>+</span>
            Add Country
          </button>
        )}

      </div>

      {/* ======================================================
          MESSAGES
      ====================================================== */}

      {error && (
        <div className="countries-alert countries-alert-error">
          <span>⚠</span>
          <span>{error}</span>

          <button
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="countries-alert countries-alert-success">
          <span>✓</span>
          <span>{success}</span>

          <button
            onClick={() => setSuccess("")}
          >
            ×
          </button>
        </div>
      )}

      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <div className="countries-toolbar">

        <div className="countries-search-wrapper">
          <span className="countries-search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="countries-status-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as
                | ""
                | CountryStatus
            )
          }
        >
          <option value="">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>
        </select>

        <button
          className="countries-refresh-btn"
          onClick={fetchCountries}
          disabled={loading}
        >
          ↻ Refresh
        </button>

      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="countries-summary">
        <div className="countries-summary-card">
          <span className="countries-summary-label">
            Total Countries
          </span>

          <strong>
            {countries.length}
          </strong>
        </div>

        <div className="countries-summary-card">
          <span className="countries-summary-label">
            Active
          </span>

          <strong>
            {
              countries.filter(
                (country) =>
                  country.status === "ACTIVE"
              ).length
            }
          </strong>
        </div>

        <div className="countries-summary-card">
          <span className="countries-summary-label">
            Inactive
          </span>

          <strong>
            {
              countries.filter(
                (country) =>
                  country.status === "INACTIVE"
              ).length
            }
          </strong>
        </div>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="countries-table-card">

        <div className="countries-table-header">
          <div>
            <h2>Countries</h2>

            <p>
              {countries.length}{" "}
              {countries.length === 1
                ? "country"
                : "countries"}{" "}
              found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="countries-loading">
            <div className="countries-spinner"></div>

            <p>
              Loading countries...
            </p>
          </div>
        ) : countries.length === 0 ? (
          <div className="countries-empty">
            <div className="countries-empty-icon">
              🌍
            </div>

            <h3>
              No countries found
            </h3>

            <p>
              {search || statusFilter
                ? "Try changing your search or filter."
                : "Add your first country to get started."}
            </p>

            {canManage &&
              !search &&
              !statusFilter && (
                <button
                  className="countries-primary-btn"
                  onClick={
                    handleAddCountry
                  }
                >
                  + Add Country
                </button>
              )}
          </div>
        ) : (
          <div className="countries-table-wrapper">

            <table className="countries-table">

              <thead>
                <tr>
                  <th>Country</th>
                  <th>ISO-2</th>
                  <th>ISO-3</th>
                  <th>Calling Code</th>
                  <th>Status</th>
                  <th>Created</th>
                  {canManage && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {countries.map(
                  (country) => (
                    <tr key={country.id}>

                      <td>
                        <div className="countries-name-cell">
                          <div className="countries-flag-placeholder">
                            {country.iso2Code
                              ? country.iso2Code
                                  .substring(
                                    0,
                                    2
                                  )
                              : "—"}
                          </div>

                          <div>
                            <strong>
                              {country.name}
                            </strong>

                            {country.createdBy && (
                              <span>
                                Added by{" "}
                                {
                                  country
                                    .createdBy
                                    .name
                                }
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="countries-code">
                          {country.iso2Code ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        <span className="countries-code">
                          {country.iso3Code ||
                            "—"}
                        </span>
                      </td>

                      <td>
                        {country.callingCode ||
                          "—"}
                      </td>

                      <td>
                        <span
                          className={`countries-status-badge ${
                            country.status ===
                            "ACTIVE"
                              ? "countries-status-active"
                              : "countries-status-inactive"
                          }`}
                        >
                          <span className="countries-status-dot"></span>

                          {country.status ===
                          "ACTIVE"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {formatDate(
                          country.createdAt
                        )}
                      </td>

                      {canManage && (
                        <td>
                          <div className="countries-actions">

                            <button
                              className="countries-action-btn"
                              onClick={() =>
                                handleEditCountry(
                                  country
                                )
                              }
                              title="Edit country"
                            >
                              Edit
                            </button>

                            <button
                              className={`countries-action-btn ${
                                country.status ===
                                "ACTIVE"
                                  ? "countries-action-danger"
                                  : "countries-action-success"
                              }`}
                              onClick={() =>
                                handleToggleStatus(
                                  country
                                )
                              }
                              title={
                                country.status ===
                                "ACTIVE"
                                  ? "Deactivate country"
                                  : "Activate country"
                              }
                            >
                              {country.status ===
                              "ACTIVE"
                                ? "Deactivate"
                                : "Activate"}
                            </button>

                            {isSuperAdmin && (
                              <button
                                className="countries-action-btn countries-action-delete"
                                onClick={() =>
                                  handleDeleteCountry(
                                    country
                                  )
                                }
                                title="Delete country"
                              >
                                Delete
                              </button>
                            )}

                          </div>
                        </td>
                      )}

                    </tr>
                  )
                )}
              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ======================================================
          CREATE / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div
          className="countries-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              handleCloseModal();
            }
          }}
        >

          <div className="countries-modal">

            <div className="countries-modal-header">

              <div>
                <h2>
                  {editingCountry
                    ? "Edit Country"
                    : "Add Country"}
                </h2>

                <p>
                  {editingCountry
                    ? "Update country information."
                    : "Add a new country to the system."}
                </p>
              </div>

              <button
                className="countries-modal-close"
                onClick={
                  handleCloseModal
                }
                disabled={submitting}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="countries-form"
            >

              {/* Country Name */}

              <div className="countries-form-group">
                <label>
                  Country Name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Nepal"
                  value={formData.name}
                  onChange={
                    handleInputChange
                  }
                  disabled={submitting}
                  autoFocus
                />
              </div>

              {/* ISO Codes */}

              <div className="countries-form-row">

                <div className="countries-form-group">
                  <label>
                    ISO-2 Code
                  </label>

                  <input
                    type="text"
                    name="iso2Code"
                    placeholder="e.g. NP"
                    value={
                      formData.iso2Code
                    }
                    onChange={
                      handleInputChange
                    }
                    maxLength={2}
                    disabled={submitting}
                  />

                  <small>
                    Two-letter country code
                  </small>
                </div>

                <div className="countries-form-group">
                  <label>
                    ISO-3 Code
                  </label>

                  <input
                    type="text"
                    name="iso3Code"
                    placeholder="e.g. NPL"
                    value={
                      formData.iso3Code
                    }
                    onChange={
                      handleInputChange
                    }
                    maxLength={3}
                    disabled={submitting}
                  />

                  <small>
                    Three-letter country code
                  </small>
                </div>

              </div>

              {/* Calling Code */}

              <div className="countries-form-group">
                <label>
                  Calling Code
                </label>

                <input
                  type="text"
                  name="callingCode"
                  placeholder="e.g. +977"
                  value={
                    formData.callingCode
                  }
                  onChange={
                    handleInputChange
                  }
                  disabled={submitting}
                />

                <small>
                  International calling code
                </small>
              </div>

              {/* Status */}

              <div className="countries-form-group">
                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleInputChange
                  }
                  disabled={submitting}
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </div>

              {/* Form Actions */}

              <div className="countries-form-actions">

                <button
                  type="button"
                  className="countries-cancel-btn"
                  onClick={
                    handleCloseModal
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="countries-primary-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Saving..."
                    : editingCountry
                    ? "Update Country"
                    : "Create Country"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Countries;