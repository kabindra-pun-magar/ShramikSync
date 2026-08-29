import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/DemandLetters.css";

// ========================================
// TYPES
// ========================================

type DemandLetterStatus =
  | "DRAFT"
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED"
  | "COMPLETED";

interface DemandLetter {
  id: number;

  referenceNumber: string;

  jobTitle: string;

  numberOfWorkers: number;

  salary: string | null;

  contractDuration: string | null;

  country: string;

  city: string | null;

  description: string | null;

  status: DemandLetterStatus;

  issueDate: string | null;

  expiryDate: string | null;

  createdAt: string;

  updatedAt: string;

  createdById: number;
}

interface DemandLettersResponse {
  success: boolean;
  count: number;
  demandLetters: DemandLetter[];
}

// ========================================
// FORM TYPE
// ========================================

interface DemandLetterForm {
  referenceNumber: string;
  jobTitle: string;
  numberOfWorkers: string;
  salary: string;
  contractDuration: string;
  country: string;
  city: string;
  description: string;
  status: DemandLetterStatus;
  issueDate: string;
  expiryDate: string;
}

// ========================================
// INITIAL FORM
// ========================================

const initialForm: DemandLetterForm = {
  referenceNumber: "",
  jobTitle: "",
  numberOfWorkers: "",
  salary: "",
  contractDuration: "",
  country: "",
  city: "",
  description: "",
  status: "DRAFT",
  issueDate: "",
  expiryDate: "",
};

// ========================================
// COMPONENT
// ========================================

function DemandLetters() {
  const [demandLetters, setDemandLetters] = useState<
    DemandLetter[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] =
    useState<DemandLetterForm>(initialForm);

  // ========================================
  // FETCH DEMAND LETTERS
  // ========================================

  const fetchDemandLetters = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<DemandLettersResponse>(
          "/demand-letters"
        );

      if (!response.data.success) {
        setError(
          "Failed to load demand letters."
        );
        return;
      }

      setDemandLetters(
        response.data.demandLetters
      );
    } catch (error: any) {
      console.error(
        "Get demand letters error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load demand letters."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchDemandLetters();
  }, []);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // CREATE DEMAND LETTER
  // ========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/demand-letters",
        {
          referenceNumber:
            form.referenceNumber.trim(),

          jobTitle:
            form.jobTitle.trim(),

          numberOfWorkers:
            Number(form.numberOfWorkers),

          salary:
            form.salary.trim() || null,

          contractDuration:
            form.contractDuration.trim() || null,

          country:
            form.country.trim(),

          city:
            form.city.trim() || null,

          description:
            form.description.trim() || null,

          status: form.status,

          issueDate:
            form.issueDate || null,

          expiryDate:
            form.expiryDate || null,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to create demand letter."
        );
        return;
      }

      setSuccess(
        "Demand letter created successfully."
      );

      setForm(initialForm);

      setShowForm(false);

      await fetchDemandLetters();
    } catch (error: any) {
      console.error(
        "Create demand letter error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to create demand letter."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString();
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="demand-letters-page">
        <div className="demand-letters-state">
          <h2>
            Loading Demand Letters
          </h2>

          <p>
            Fetching demand letters from
            the database...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="demand-letters-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="demand-letters-header">

        <div>
          <span className="demand-letters-eyebrow">
            RECRUITMENT MANAGEMENT
          </span>

          <h1>
            Demand Letters
          </h1>

          <p>
            Manage employer job demands and
            workforce requirements.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setError("");
            setSuccess("");
          }}
        >
          {showForm
            ? "Cancel"
            : "Add Demand Letter"}
        </button>

      </header>

      {/* ========================================
          MESSAGES
      ======================================== */}

      {success && (
        <div className="demand-letter-message demand-letter-success">
          {success}
        </div>
      )}

      {error && (
        <div className="demand-letter-message demand-letter-error">
          {error}
        </div>
      )}

      {/* ========================================
          CREATE FORM
      ======================================== */}

      {showForm && (
        <section className="card demand-letter-form-panel">

          <div className="demand-letter-panel-header">

            <div>
              <h2>
                Create Demand Letter
              </h2>

              <p>
                Enter the job and workforce
                requirements.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="demand-letter-form-grid">

              {/* Reference Number */}

              <div className="demand-letter-field">
                <label htmlFor="referenceNumber">
                  Reference Number *
                </label>

                <input
                  id="referenceNumber"
                  name="referenceNumber"
                  type="text"
                  value={form.referenceNumber}
                  onChange={handleChange}
                  placeholder="DL-2026-001"
                  required
                />
              </div>

              {/* Job Title */}

              <div className="demand-letter-field">
                <label htmlFor="jobTitle">
                  Job Title *
                </label>

                <input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Construction Worker"
                  required
                />
              </div>

              {/* Number of Workers */}

              <div className="demand-letter-field">
                <label htmlFor="numberOfWorkers">
                  Number of Workers *
                </label>

                <input
                  id="numberOfWorkers"
                  name="numberOfWorkers"
                  type="number"
                  min="1"
                  value={form.numberOfWorkers}
                  onChange={handleChange}
                  placeholder="10"
                  required
                />
              </div>

              {/* Salary */}

              <div className="demand-letter-field">
                <label htmlFor="salary">
                  Salary
                </label>

                <input
                  id="salary"
                  name="salary"
                  type="text"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="NPR 40,000"
                />
              </div>

              {/* Contract Duration */}

              <div className="demand-letter-field">
                <label htmlFor="contractDuration">
                  Contract Duration
                </label>

                <input
                  id="contractDuration"
                  name="contractDuration"
                  type="text"
                  value={form.contractDuration}
                  onChange={handleChange}
                  placeholder="2 Years"
                />
              </div>

              {/* Country */}

              <div className="demand-letter-field">
                <label htmlFor="country">
                  Country *
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Saudi Arabia"
                  required
                />
              </div>

              {/* City */}

              <div className="demand-letter-field">
                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Riyadh"
                />
              </div>

              {/* Status */}

              <div className="demand-letter-field">
                <label htmlFor="status">
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="DRAFT">
                    Draft
                  </option>

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="EXPIRED">
                    Expired
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>

              {/* Issue Date */}

              <div className="demand-letter-field">
                <label htmlFor="issueDate">
                  Issue Date
                </label>

                <input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  value={form.issueDate}
                  onChange={handleChange}
                />
              </div>

              {/* Expiry Date */}

              <div className="demand-letter-field">
                <label htmlFor="expiryDate">
                  Expiry Date
                </label>

                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}

              <div className="demand-letter-field demand-letter-field-full">

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Additional job requirements..."
                />

              </div>

              {/* Actions */}

              <div className="demand-letter-form-actions">

                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowForm(false);
                    setForm(initialForm);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Creating..."
                    : "Create Demand Letter"}
                </button>

              </div>

            </div>

          </form>

        </section>
      )}

      {/* ========================================
          DEMAND LETTER LIST
      ======================================== */}

      <section className="card demand-letters-list-panel">

        <div className="demand-letter-panel-header">

          <div>
            <h2>
              Registered Demand Letters
            </h2>

            <p>
              {demandLetters.length} demand
              letter
              {demandLetters.length !== 1
                ? "s"
                : ""} found.
            </p>
          </div>

        </div>

        {/* ========================================
            EMPTY STATE
        ======================================== */}

        {demandLetters.length === 0 ? (

          <div className="demand-letter-empty-state">

            <h3>
              No Demand Letters Found
            </h3>

            <p>
              No demand letters have been
              registered yet.
            </p>

          </div>

        ) : (

          <div className="demand-letters-table-wrapper">

            <table className="demand-letters-table">

              <thead>
                <tr>

                  <th>
                    Reference
                  </th>

                  <th>
                    Job
                  </th>

                  <th>
                    Workers
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Expiry
                  </th>

                </tr>
              </thead>

              <tbody>

                {demandLetters.map(
                  (letter) => (

                    <tr key={letter.id}>

                      <td>
                        <strong>
                          {letter.referenceNumber}
                        </strong>

                        <span className="demand-letter-id">
                          ID #{letter.id}
                        </span>
                      </td>

                      <td>

                        <strong>
                          {letter.jobTitle}
                        </strong>

                        <span className="demand-letter-secondary">
                          {letter.salary ||
                            "Salary not specified"}
                        </span>

                      </td>

                      <td>
                        {letter.numberOfWorkers}
                      </td>

                      <td>

                        <strong>
                          {letter.city ||
                            "—"}
                        </strong>

                        <span className="demand-letter-secondary">
                          {letter.country}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`demand-letter-status demand-letter-status-${letter.status.toLowerCase()}`}
                        >
                          {letter.status}
                        </span>

                      </td>

                      <td>
                        {formatDate(
                          letter.expiryDate
                        )}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default DemandLetters;