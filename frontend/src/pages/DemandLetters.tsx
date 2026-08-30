import { useEffect, useMemo, useState } from "react";
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
// CANDIDATE TYPES
// ========================================

interface Candidate {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  nationality: string | null;
  address: string | null;
  passportNumber: string | null;
  passportExpiry: string | null;
  education: string | null;
  experience: string | null;
  skills: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdById: number;
}

interface CandidatesResponse {
  success: boolean;
  message?: string;
  count?: number;
  candidates: Candidate[];
}

interface AssignedCandidate {
  assignmentId: number;
  assignedAt: string;
  candidate: Candidate;
}

interface AssignedCandidatesResponse {
  success: boolean;
  count: number;
  candidates: AssignedCandidate[];
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
  // ========================================
  // DEMAND LETTER STATE
  // ========================================

  const [demandLetters, setDemandLetters] = useState<DemandLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ========================================
  // FORM STATE
  // ========================================

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] =
    useState<DemandLetterForm>(initialForm);

  const [editingLetter, setEditingLetter] =
    useState<DemandLetter | null>(null);

  // ========================================
  // SEARCH / FILTER STATE
  // ========================================

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<"ALL" | DemandLetterStatus>("ALL");

  // ========================================
  // CANDIDATE STATE
  // ========================================

  const [selectedLetter, setSelectedLetter] =
    useState<DemandLetter | null>(null);

  const [assignedCandidates, setAssignedCandidates] =
    useState<Candidate[]>([]);

  const [showCandidates, setShowCandidates] =
    useState(false);

  const [loadingCandidates, setLoadingCandidates] =
    useState(false);

  // ========================================
  // ASSIGN CANDIDATE STATE
  // ========================================

  const [selectedDemandLetterId, setSelectedDemandLetterId] =
    useState<number | null>(null);

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [selectedCandidateId, setSelectedCandidateId] =
    useState<number | null>(null);

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [candidateLoading, setCandidateLoading] =
    useState(false);

  const [assigning, setAssigning] =
    useState(false);
  const [removingCandidateId, setRemovingCandidateId] =
    useState<number | null>(null);

  const availableCandidates = candidates.filter(
    (candidate) =>
      !assignedCandidates.some(
        (assignedCandidate) =>
          assignedCandidate.id === candidate.id
      )
  );

  const assignedCount = assignedCandidates.length;

  const workerLimit =
    selectedLetter?.numberOfWorkers ?? 0;

  const remainingSlots =
    Math.max(workerLimit - assignedCount, 0);

  const workerLimitReached =
    assignedCount >= workerLimit;

  // ========================================
  // DELETE STATE
  // ========================================

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

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

      if (error.response?.status === 401) {
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
  // FETCH ASSIGNED CANDIDATES
  // ========================================

  // ========================================
  // FETCH ASSIGNED CANDIDATES
  // ========================================

  const fetchAssignedCandidates = async (
    demandLetterId: number
  ) => {
    try {
      setLoadingCandidates(true);
      setError("");

      const response =
        await api.get<AssignedCandidatesResponse>(
          `/demand-letters/${demandLetterId}/candidates`
        );

      if (!response.data.success) {
        setError(
          "Failed to load assigned candidates."
        );
        return;
      }

      // Backend returns:
      // {
      //   assignmentId,
      //   assignedAt,
      //   candidate: {...}
      // }
      //
      // React UI expects Candidate objects directly.
      // Extract the nested candidate object here.

      const candidates =
        response.data.candidates.map(
          (assignment) => assignment.candidate
        );

      setAssignedCandidates(candidates);

      // Successful fetch = clear stale errors
      setError("");
    } catch (error: any) {
      console.error(
        "Get assigned candidates error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load assigned candidates."
      );
    } finally {
      setLoadingCandidates(false);
    }
  };;;

  // ========================================
  // FETCH ALL CANDIDATES
  // ========================================

  const fetchCandidates = async () => {
    try {
      setCandidateLoading(true);
      // Clear stale errors before loading candidates
      setError("");

      const response = await api.get<CandidatesResponse>(
        "/candidates"
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to load candidates."
        );
        return;
      }

      setCandidates(response.data.candidates);
    } catch (error: any) {
      console.error(
        "Fetch candidates error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load candidates."
      );
    } finally {
      setCandidateLoading(false);
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
  // OPEN CREATE FORM
  // ========================================

  const openCreateForm = () => {
    setEditingLetter(null);
    setForm(initialForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  // ========================================
  // CLOSE FORM
  // ========================================

  const closeForm = () => {
    if (submitting) {
      return;
    }

    setShowForm(false);
    setEditingLetter(null);
    setForm(initialForm);
  };

  // ========================================
  // CONVERT DATE FOR INPUT
  // ========================================

  const formatDateForInput = (
    date: string | null
  ) => {
    if (!date) {
      return "";
    }

    return new Date(date)
      .toISOString()
      .split("T")[0];
  };

  // ========================================
  // OPEN EDIT FORM
  // ========================================

  const handleEdit = (
    letter: DemandLetter
  ) => {
    setEditingLetter(letter);

    setForm({
      referenceNumber:
        letter.referenceNumber,

      jobTitle:
        letter.jobTitle,

      numberOfWorkers:
        String(letter.numberOfWorkers),

      salary:
        letter.salary || "",

      contractDuration:
        letter.contractDuration || "",

      country:
        letter.country,

      city:
        letter.city || "",

      description:
        letter.description || "",

      status:
        letter.status,

      issueDate:
        formatDateForInput(
          letter.issueDate
        ),

      expiryDate:
        formatDateForInput(
          letter.expiryDate
        ),
    });

    setShowForm(true);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // CREATE / UPDATE DEMAND LETTER
  // ========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const payload = {
        referenceNumber:
          form.referenceNumber.trim(),

        jobTitle:
          form.jobTitle.trim(),

        numberOfWorkers:
          Number(form.numberOfWorkers),

        salary:
          form.salary.trim() || null,

        contractDuration:
          form.contractDuration.trim() ||
          null,

        country:
          form.country.trim(),

        city:
          form.city.trim() || null,

        description:
          form.description.trim() ||
          null,

        status:
          form.status,

        issueDate:
          form.issueDate || null,

        expiryDate:
          form.expiryDate || null,
      };

      // ====================================
      // UPDATE
      // ====================================

      if (editingLetter) {
        const response =
          await api.put(
            `/demand-letters/${editingLetter.id}`,
            payload
          );

        if (!response.data.success) {
          setError(
            response.data.message ||
              "Failed to update demand letter."
          );

          return;
        }

        setSuccess(
          "Demand letter updated successfully."
        );
      }

      // ====================================
      // CREATE
      // ====================================

      else {
        const response =
          await api.post(
            "/demand-letters",
            payload
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
      }

      setForm(initialForm);
      setEditingLetter(null);
      setShowForm(false);

      await fetchDemandLetters();

    } catch (error: any) {
      console.error(
        "Save demand letter error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to save demand letter."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ========================================
  // DELETE DEMAND LETTER
  // ========================================

  const handleDelete = async (
    letter: DemandLetter
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete demand letter "${letter.referenceNumber}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(letter.id);
      setError("");
      setSuccess("");

      const response =
        await api.delete(
          `/demand-letters/${letter.id}`
        );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to delete demand letter."
        );

        return;
      }

      setSuccess(
        "Demand letter deleted successfully."
      );

      await fetchDemandLetters();

    } catch (error: any) {
      console.error(
        "Delete demand letter error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete demand letter."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // SEARCH + FILTER
  // ========================================

  const filteredDemandLetters =
    useMemo(() => {
      const search =
        searchTerm.trim().toLowerCase();

      return demandLetters.filter(
        (letter) => {
          const matchesSearch =
            !search ||
            letter.referenceNumber
              .toLowerCase()
              .includes(search) ||
            letter.jobTitle
              .toLowerCase()
              .includes(search) ||
            letter.country
              .toLowerCase()
              .includes(search) ||
            (letter.city || "")
              .toLowerCase()
              .includes(search);

          const matchesStatus =
            statusFilter === "ALL" ||
            letter.status === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      demandLetters,
      searchTerm,
      statusFilter,
    ]);

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
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

    return new Date(
      date
    ).toLocaleDateString();
  };

  // ========================================
  // CLOSE CANDIDATE MODAL
  // ========================================

  const closeCandidatesModal = () => {
    setShowCandidates(false);
    setSelectedLetter(null);
    setAssignedCandidates([]);
    setSelectedDemandLetterId(null);
    setRemovingCandidateId(null);
  };

  const closeAssignModal = () => {
    if (assigning) {
      return;
    }

    setShowAssignModal(false);
    setSelectedDemandLetterId(null);
    setSelectedCandidateId(null);
    setCandidates([]);
  };

  // ========================================
  // OPEN CANDIDATES
  // ========================================

  const handleViewCandidates = async (
    letter: DemandLetter
  ) => {
    setSelectedLetter(letter);
    setSelectedDemandLetterId(letter.id);
    setShowCandidates(true);
    setAssignedCandidates([]);
    setError("");
    setSuccess("");

    await fetchAssignedCandidates(
      letter.id
    );
  };

  // ========================================
  // OPEN ASSIGN MODAL
  // ========================================

  const openAssignModal = async (
    demandLetterId: number
  ) => {
    const demandLetter = demandLetters.find(
      (letter) => letter.id === demandLetterId
    );

    // Clear any previous operation messages
    setError("");
    setSuccess("");

    setSelectedLetter(
      demandLetter || null
    );

    setSelectedDemandLetterId(
      demandLetterId
    );

    setSelectedCandidateId(null);

    setShowAssignModal(true);

    try {
      await Promise.all([
        fetchCandidates(),
        fetchAssignedCandidates(demandLetterId),
      ]);

      // Make sure an old error does not remain
      // after successfully preparing the modal.
      setError("");
    } catch (error) {
      console.error(
        "Failed to prepare candidate assignment:",
        error
      );
    }
  };;

  // ========================================
  // ASSIGN CANDIDATE
  // ========================================

  const assignCandidate = async () => {
    if (
      !selectedDemandLetterId ||
      !selectedCandidateId
    ) {
      setError("Please select a candidate.");
      return;
    }

    try {
      setAssigning(true);

      // Clear old messages before a new operation
      setError("");
      setSuccess("");

      const demandLetterId =
        selectedDemandLetterId;

      const response = await api.post(
        `/demand-letters/${demandLetterId}/candidates`,
        {
          candidateId: selectedCandidateId,
        }
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to assign candidate."
        );
        return;
      }

      // Close assignment modal
      setShowAssignModal(false);
      setSelectedCandidateId(null);

      // Refresh assigned candidates
      await fetchAssignedCandidates(
        demandLetterId
      );

      // Refresh demand letters
      await fetchDemandLetters();

      // Clear any stale error after success
      setError("");

      setSuccess(
        "Candidate assigned successfully."
      );
    } catch (error: any) {
      console.error(
        "Assign candidate error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to assign candidate."
      );
    } finally {
      setAssigning(false);
    }
  };;

  // ========================================
  // UNASSIGN CANDIDATE
  // ========================================

  const handleUnassignCandidate = async (
    candidateId: number
  ) => {
    if (!selectedDemandLetterId) {
      setError("No demand letter selected.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove this candidate from the demand letter?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingCandidateId(candidateId);
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/demand-letters/${selectedDemandLetterId}/candidates/${candidateId}`
      );

      if (!response.data.success) {
        setError(
          response.data.message ||
            "Failed to remove candidate."
        );
        return;
      }

      await fetchAssignedCandidates(
        selectedDemandLetterId
      );

      setError("");

      setSuccess(
        "Candidate removed from demand letter successfully."
      );
    } catch (error: any) {
      console.error(
        "Remove candidate error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to remove candidate."
      );
    } finally {
      setRemovingCandidateId(null);
    }
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
            if (showForm) {
              closeForm();
            } else {
              openCreateForm();
            }
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
          CREATE / EDIT FORM
      ======================================== */}

      {showForm && (
        <section className="card demand-letter-form-panel">

          <div className="demand-letter-panel-header">

            <div>
              <h2>
                {editingLetter
                  ? "Edit Demand Letter"
                  : "Create Demand Letter"}
              </h2>

              <p>
                {editingLetter
                  ? "Update the demand letter information."
                  : "Enter the job and workforce requirements."}
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="demand-letter-form-grid">

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

              <div className="demand-letter-form-actions">

                <button
                  type="button"
                  className="btn"
                  onClick={closeForm}
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
                    ? editingLetter
                      ? "Updating..."
                      : "Creating..."
                    : editingLetter
                    ? "Update Demand Letter"
                    : "Create Demand Letter"}
                </button>

              </div>

            </div>

          </form>

        </section>
      )}

      {/* ========================================
          SEARCH & FILTERS
      ======================================== */}

      <section className="demand-letter-filters">

        <div className="demand-letter-search">

          <label htmlFor="demandLetterSearch">
            Search
          </label>

          <input
            id="demandLetterSearch"
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            placeholder="Search reference, job, country or city..."
          />

        </div>

        <div className="demand-letter-status-filter">

          <label htmlFor="demandLetterStatus">
            Status
          </label>

          <select
            id="demandLetterStatus"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as
                  | "ALL"
                  | DemandLetterStatus
              )
            }
          >
            <option value="ALL">
              All Statuses
            </option>

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

        <button
          type="button"
          className="btn demand-letter-clear-filter"
          onClick={clearFilters}
          disabled={
            !searchTerm &&
            statusFilter === "ALL"
          }
        >
          Clear Filters
        </button>

      </section>

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
              {filteredDemandLetters.length} of{" "}
              {demandLetters.length} demand
              letter
              {demandLetters.length !== 1
                ? "s"
                : ""}{" "}
              shown.
            </p>

          </div>

        </div>

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

        ) : filteredDemandLetters.length === 0 ? (

          <div className="demand-letter-empty-state">

            <h3>
              No Matching Demand Letters
            </h3>

            <p>
              Try changing your search or
              status filter.
            </p>

            <button
              type="button"
              className="btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>

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

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredDemandLetters.map(
                  (letter) => (

                    <tr
                      key={letter.id}
                    >

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

                      <td>

                        <div className="demand-letter-actions">

                          <button
                            type="button"
                            className="demand-letter-action-btn"
                            onClick={() =>
                              handleViewCandidates(
                                letter
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="demand-letter-action-btn"
                            onClick={() =>
                              openAssignModal(
                                letter.id
                              )
                            }
                          >
                            Assign Candidate
                          </button>

                          <button
                            type="button"
                            className="demand-letter-action-btn"
                            onClick={() =>
                              handleEdit(
                                letter
                              )
                            }
                            disabled={
                              deletingId ===
                              letter.id
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="demand-letter-action-btn demand-letter-delete-btn"
                            onClick={() =>
                              handleDelete(
                                letter
                              )
                            }
                            disabled={
                              deletingId ===
                              letter.id
                            }
                          >
                            {deletingId ===
                            letter.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ========================================
          ASSIGN CANDIDATE MODAL
      ======================================== */}

      {showAssignModal && (
        <div
          className="assign-modal-overlay"
          onClick={closeAssignModal}
        >
          <div
            className="assign-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="assign-modal-header">
              <h2>Assign Candidate</h2>

              <button
                type="button"
                onClick={closeAssignModal}
                className="modal-close-btn"
                disabled={assigning}
              >
                ×
              </button>
            </div>

            <div className="worker-capacity">
              <span>
                Workers Required:{" "}
                <strong>{workerLimit}</strong>
              </span>

              <span>
                Assigned:{" "}
                <strong>{assignedCount}</strong>
              </span>

              <span>
                Remaining:{" "}
                <strong>{remainingSlots}</strong>
              </span>
            </div>

            <div className="assign-modal-body">
              {candidateLoading ? (
                <p>Loading candidates...</p>
              ) : availableCandidates.length === 0 ? (
                <p className="no-candidates-message">
                  No available candidates.
                </p>
              ) : (
                <div className="candidate-selection-list">
                  {availableCandidates.map((candidate) => (
                    <label
                      key={candidate.id}
                      className="candidate-selection-item"
                    >
                      <input
                        type="radio"
                        name="candidate"
                        value={candidate.id}
                        checked={
                          selectedCandidateId ===
                          candidate.id
                        }
                        onChange={() =>
                          setSelectedCandidateId(
                            candidate.id
                          )
                        }
                      />

                      <div>
                        <strong>
                          {candidate.fullName}
                        </strong>

                        <span>
                          {candidate.email ||
                            "No email"}
                        </span>

                        <span>
                          Status: {candidate.status}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="assign-modal-footer">
              <button
                type="button"
                onClick={closeAssignModal}
                className="cancel-btn"
                disabled={assigning}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={assignCandidate}
                disabled={
                  !selectedCandidateId ||
                  assigning ||
                  workerLimitReached
                }
                className="confirm-assign-btn"
              >
                {workerLimitReached
                  ? "Worker Limit Reached"
                  : assigning
                  ? "Assigning..."
                  : "Assign Candidate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          ASSIGNED CANDIDATES MODAL
      ======================================== */}

      {showCandidates &&
        selectedLetter && (

          <div
            className="demand-letter-modal-overlay"
            onClick={
              closeCandidatesModal
            }
          >

            <div
              className="demand-letter-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* ====================================
                  MODAL HEADER
              ==================================== */}

              <div className="demand-letter-modal-header">

                <div>

                  <h2>
                    Assigned Candidates
                  </h2>

                  <p>
                    {
                      selectedLetter.referenceNumber
                    }{" "}
                    —{" "}
                    {
                      selectedLetter.jobTitle
                    }
                  </p>

                </div>

                <button
                  type="button"
                  className="demand-letter-modal-close"
                  onClick={
                    closeCandidatesModal
                  }
                >
                  ×
                </button>

              </div>

              {/* ====================================
                  WORKER CAPACITY
              ==================================== */}

              <div className="demand-letter-worker-summary">

                <div>

                  <span>
                    Assigned Workers
                  </span>

                  <strong>
                    {assignedCandidates.length} /{" "}
                    {selectedLetter.numberOfWorkers}
                  </strong>

                </div>

                <div
                  className={
                    assignedCandidates.length >=
                    selectedLetter.numberOfWorkers
                      ? "demand-letter-capacity-full"
                      : "demand-letter-capacity-available"
                  }
                >
                  {assignedCandidates.length >=
                  selectedLetter.numberOfWorkers
                    ? "Worker limit reached"
                    : `${
                        selectedLetter.numberOfWorkers -
                        assignedCandidates.length
                      } position${
                        selectedLetter.numberOfWorkers -
                          assignedCandidates.length !==
                        1
                          ? "s"
                          : ""
                      } available`}
                </div>

              </div>

              {/* ====================================
                  ASSIGNED CANDIDATES
              ==================================== */}

              <div className="demand-letter-assigned-section">

                <div className="demand-letter-section-title">

                  <h3>
                    Assigned Candidates
                  </h3>

                  <span>
                    {assignedCandidates.length}
                  </span>

                </div>

                {loadingCandidates ? (

                  <div className="demand-letter-modal-state">

                    <p>
                      Loading assigned
                      candidates...
                    </p>

                  </div>

                ) : assignedCandidates.length ===
                  0 ? (

                  <div className="demand-letter-modal-state">

                    <h3>
                      No Candidates Assigned
                    </h3>

                    <p>
                      No candidates have been
                      assigned to this demand
                      letter yet.
                    </p>

                  </div>

                ) : (

                  <div className="demand-letter-candidates-list">

                    {assignedCandidates.map(
                      (candidate) => (

                        <div
                          className="demand-letter-candidate-item"
                          key={candidate.id}
                        >

                          <div>

                            <strong>
                              {candidate.fullName}
                            </strong>

                            <span>
                              ID #{candidate.id}
                            </span>

                          </div>

                          <div>
                            <span>
                              Email:{" "}
                              {candidate.email ||
                                "Not provided"}
                            </span>

                            <span>
                              Phone:{" "}
                              {candidate.phone ||
                                "Not provided"}
                            </span>

                            <small>
                              {candidate.status}
                            </small>
                          </div>

                                                  <button
                            type="button"
                            onClick={() =>
                              handleUnassignCandidate(
                                candidate.id
                              )
                            }
                            disabled={
                              removingCandidateId ===
                              candidate.id
                            }
                            className="remove-candidate-btn"
                          >
                            {removingCandidateId ===
                            candidate.id
                              ? "Removing..."
                              : "Remove"}
                          </button>

</div>

                      )
                    )}

                  </div>

                )}

              </div>

              {/* ====================================
                  MODAL ACTIONS
              ==================================== */}

              <div className="demand-letter-modal-actions">

                <button
                  type="button"
                  className="btn"
                  onClick={
                    closeCandidatesModal
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default DemandLetters;