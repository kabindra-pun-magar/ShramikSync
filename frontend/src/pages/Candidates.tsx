import {
  useCallback,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import "../styles/Candidates.css";


// ========================================
// TYPES
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
}


interface CandidatesResponse {
  success: boolean;
  count: number;
  candidates: Candidate[];
}


interface CandidateResponse {
  success: boolean;
  candidate: Candidate;
  message?: string;
}


interface CandidateForm {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  address: string;
  passportNumber: string;
  passportExpiry: string;
  education: string;
  experience: string;
  skills: string;
  status: string;
}


// ========================================
// INITIAL FORM
// ========================================

const initialForm: CandidateForm = {
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  address: "",
  passportNumber: "",
  passportExpiry: "",
  education: "",
  experience: "",
  skills: "",
  status: "REGISTERED",
};


// ========================================
// STATUS OPTIONS
// ========================================

const statusOptions = [
  "REGISTERED",
  "SCREENING",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
  "PLACED",
];


// ========================================
// COMPONENT
// ========================================

function Candidates() {

  // ========================================
  // CANDIDATES
  // ========================================

  const [candidates, setCandidates] =
    useState<Candidate[]>([]);


  // ========================================
  // FORM
  // ========================================

  const [form, setForm] =
    useState<CandidateForm>(initialForm);


  const [showForm, setShowForm] =
    useState(false);


  const [editingId, setEditingId] =
    useState<number | null>(null);


  // ========================================
  // VIEW / DELETE
  // ========================================

  const [
    viewingCandidate,
    setViewingCandidate,
  ] = useState<Candidate | null>(null);


  const [deletingId, setDeletingId] =
    useState<number | null>(null);


  // ========================================
  // UI STATES
  // ========================================

  const [loading, setLoading] =
    useState(true);


  const [submitting, setSubmitting] =
    useState(false);


  const [error, setError] =
    useState("");


  const [success, setSuccess] =
    useState("");


  // ========================================
  // SEARCH / FILTER
  // ========================================

  const [search, setSearch] =
    useState("");


  const [statusFilter, setStatusFilter] =
    useState("");


  // ========================================
  // FETCH CANDIDATES
  // ========================================

  const fetchCandidates = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");


        const response =
          await api.get<CandidatesResponse>(
            "/candidates",
            {
              params: {
                search:
                  search.trim() || undefined,

                status:
                  statusFilter || undefined,
              },
            }
          );


        if (response.data.success) {

          setCandidates(
            response.data.candidates
          );

        }

      } catch (error: any) {

        console.error(
          "Failed to fetch candidates:",
          error
        );


        if (
          error.response?.status === 401
        ) {
          return;
        }


        setError(
          error.response?.data?.message ||
          "Failed to load candidates."
        );

      } finally {

        setLoading(false);

      }

    },
    [search, statusFilter]
  );


  // ========================================
  // FETCH WHEN SEARCH / FILTER CHANGES
  // ========================================

  useEffect(() => {

    fetchCandidates();

  }, [fetchCandidates]);


  // ========================================
  // FORM HANDLING
  // ========================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;


    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  // ========================================
  // CREATE / UPDATE
  // ========================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault();


    setSubmitting(true);
    setError("");
    setSuccess("");


    try {

      // ========================================
      // UPDATE
      // ========================================

      if (editingId !== null) {

        const response =
          await api.put<CandidateResponse>(
            `/candidates/${editingId}`,
            form
          );


        if (response.data.success) {

          setSuccess(
            "Candidate updated successfully."
          );

        }

      }

      // ========================================
      // CREATE
      // ========================================

      else {

        const response =
          await api.post<CandidateResponse>(
            "/candidates",
            form
          );


        if (response.data.success) {

          setSuccess(
            "Candidate created successfully."
          );

        }

      }


      // ========================================
      // RESET FORM
      // ========================================

      setForm(initialForm);

      setEditingId(null);

      setShowForm(false);


      // ========================================
      // REFRESH CANDIDATES
      // ========================================

      await fetchCandidates();

    } catch (error: any) {

      console.error(
        "Candidate save error:",
        error
      );


      if (
        error.response?.status === 401
      ) {
        return;
      }


      setError(
        error.response?.data?.message ||
        "Failed to save candidate."
      );

    } finally {

      setSubmitting(false);

    }

  };


  // ========================================
  // VIEW CANDIDATE
  // ========================================

  const handleView = async (
    id: number
  ) => {

    try {

      setError("");


      const response =
        await api.get<CandidateResponse>(
          `/candidates/${id}`
        );


      if (response.data.success) {

        setViewingCandidate(
          response.data.candidate
        );

      }

    } catch (error: any) {

      console.error(
        "Failed to fetch candidate:",
        error
      );


      if (
        error.response?.status === 401
      ) {
        return;
      }


      setError(
        error.response?.data?.message ||
        "Failed to load candidate."
      );

    }

  };


  // ========================================
  // EDIT CANDIDATE
  // ========================================

  const handleEdit = async (
    id: number
  ) => {

    try {

      setError("");
      setSuccess("");


      const response =
        await api.get<CandidateResponse>(
          `/candidates/${id}`
        );


      if (!response.data.success) {
        return;
      }


      const candidate =
        response.data.candidate;


      setForm({

        fullName:
          candidate.fullName || "",

        email:
          candidate.email || "",

        phone:
          candidate.phone || "",

        dateOfBirth:
          candidate.dateOfBirth
            ? candidate.dateOfBirth.slice(0, 10)
            : "",

        gender:
          candidate.gender || "",

        nationality:
          candidate.nationality || "",

        address:
          candidate.address || "",

        passportNumber:
          candidate.passportNumber || "",

        passportExpiry:
          candidate.passportExpiry
            ? candidate.passportExpiry.slice(0, 10)
            : "",

        education:
          candidate.education || "",

        experience:
          candidate.experience || "",

        skills:
          candidate.skills || "",

        status:
          candidate.status ||
          "REGISTERED",

      });


      setEditingId(candidate.id);

      setShowForm(true);


      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (error: any) {

      console.error(
        "Failed to load candidate for editing:",
        error
      );


      setError(
        error.response?.data?.message ||
        "Failed to load candidate."
      );

    }

  };


  // ========================================
  // DELETE CANDIDATE
  // ========================================

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this candidate? This action cannot be undone."
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);

      setError("");

      setSuccess("");


      const response =
        await api.delete(
          `/candidates/${id}`
        );


      if (response.data.success) {

        setSuccess(
          "Candidate deleted successfully."
        );


        await fetchCandidates();

      }

    } catch (error: any) {

      console.error(
        "Failed to delete candidate:",
        error
      );


      if (
        error.response?.status === 401
      ) {
        return;
      }


      setError(
        error.response?.data?.message ||
        "Failed to delete candidate."
      );

    } finally {

      setDeletingId(null);

    }

  };


  // ========================================
  // OPEN CREATE FORM
  // ========================================

  const openCreateForm = () => {

    setForm(initialForm);

    setEditingId(null);

    setShowForm(true);

    setError("");

    setSuccess("");

  };


  // ========================================
  // CLOSE FORM
  // ========================================

  const closeForm = () => {

    setForm(initialForm);

    setEditingId(null);

    setShowForm(false);

  };


  // ========================================
  // CLEAR SEARCH / FILTER
  // ========================================

  const clearFilters = () => {

    setSearch("");

    setStatusFilter("");

  };


  // ========================================
  // RENDER
  // ========================================

  return (

    <div className="candidates-page">


      {/* ========================================
          HEADER
      ======================================== */}

      <header className="candidates-header">

        <div>

          <span className="candidates-eyebrow">
            RECRUITMENT MANAGEMENT
          </span>


          <h1>
            Candidates
          </h1>


          <p>
            Manage candidates registered in your
            recruitment system.
          </p>

        </div>


        <button
          type="button"
          className="btn btn-primary"
          onClick={
            showForm
              ? closeForm
              : openCreateForm
          }
        >

          {showForm
            ? "Close Form"
            : "Add Candidate"}

        </button>

      </header>


      {/* ========================================
          MESSAGES
      ======================================== */}

      {success && (

        <div className="candidate-message candidate-success">
          {success}
        </div>

      )}


      {error && (

        <div className="candidate-message candidate-error">
          {error}
        </div>

      )}


      {/* ========================================
          SEARCH AND FILTERS
      ======================================== */}

      <section className="candidate-filters">

        {/* SEARCH */}

        <div className="candidate-search">

          <label htmlFor="candidate-search">
            Search Candidates
          </label>


          <input
            id="candidate-search"
            type="text"
            placeholder="Search name, email, phone or passport..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        {/* STATUS */}

        <div className="candidate-status-filter">

          <label htmlFor="candidate-status-filter">
            Status
          </label>


          <select
            id="candidate-status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="">
              All Statuses
            </option>


            <option value="REGISTERED">
              Registered
            </option>


            <option value="SCREENING">
              Screening
            </option>


            <option value="INTERVIEW">
              Interview
            </option>


            <option value="SELECTED">
              Selected
            </option>


            <option value="REJECTED">
              Rejected
            </option>


            <option value="PLACED">
              Placed
            </option>

          </select>

        </div>


        {/* CLEAR */}

        {(search || statusFilter) && (

          <button
            type="button"
            className="btn btn-secondary candidate-clear-filter"
            onClick={clearFilters}
          >
            Clear
          </button>

        )}

      </section>


      {/* ========================================
          CREATE / EDIT FORM
      ======================================== */}

      {showForm && (

        <section className="card candidate-form-panel">

          <div className="candidate-panel-header">

            <div>

              <h2>

                {editingId !== null
                  ? "Edit Candidate"
                  : "Add Candidate"}

              </h2>


              <p>

                {editingId !== null
                  ? "Update candidate information."
                  : "Enter the candidate's recruitment information."}

              </p>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="candidate-form-grid">


              {/* FULL NAME */}

              <div className="candidate-field">

                <label htmlFor="fullName">
                  Full Name *
                </label>


                <input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

              </div>


              {/* EMAIL */}

              <div className="candidate-field">

                <label htmlFor="email">
                  Email
                </label>


                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="candidate@example.com"
                />

              </div>


              {/* PHONE */}

              <div className="candidate-field">

                <label htmlFor="phone">
                  Phone
                </label>


                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+977..."
                />

              </div>


              {/* GENDER */}

              <div className="candidate-field">

                <label htmlFor="gender">
                  Gender
                </label>


                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >

                  <option value="">
                    Select gender
                  </option>


                  <option value="MALE">
                    Male
                  </option>


                  <option value="FEMALE">
                    Female
                  </option>


                  <option value="OTHER">
                    Other
                  </option>

                </select>

              </div>


              {/* NATIONALITY */}

              <div className="candidate-field">

                <label htmlFor="nationality">
                  Nationality
                </label>


                <input
                  id="nationality"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleChange}
                  placeholder="Nepali"
                />

              </div>


              {/* PASSPORT */}

              <div className="candidate-field">

                <label htmlFor="passportNumber">
                  Passport Number
                </label>


                <input
                  id="passportNumber"
                  name="passportNumber"
                  value={form.passportNumber}
                  onChange={handleChange}
                  placeholder="Passport number"
                />

              </div>


              {/* DATE OF BIRTH */}

              <div className="candidate-field">

                <label htmlFor="dateOfBirth">
                  Date of Birth
                </label>


                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                />

              </div>


              {/* PASSPORT EXPIRY */}

              <div className="candidate-field">

                <label htmlFor="passportExpiry">
                  Passport Expiry
                </label>


                <input
                  id="passportExpiry"
                  name="passportExpiry"
                  type="date"
                  value={form.passportExpiry}
                  onChange={handleChange}
                />

              </div>


              {/* EDUCATION */}

              <div className="candidate-field">

                <label htmlFor="education">
                  Education
                </label>


                <input
                  id="education"
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  placeholder="Bachelor's degree"
                />

              </div>


              {/* EXPERIENCE */}

              <div className="candidate-field">

                <label htmlFor="experience">
                  Experience
                </label>


                <input
                  id="experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="3 years"
                />

              </div>


              {/* ADDRESS */}

              <div className="candidate-field candidate-field-full">

                <label htmlFor="address">
                  Address
                </label>


                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Candidate address"
                  rows={3}
                />

              </div>


              {/* SKILLS */}

              <div className="candidate-field candidate-field-full">

                <label htmlFor="skills">
                  Skills
                </label>


                <textarea
                  id="skills"
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="Construction, Electrical..."
                  rows={3}
                />

              </div>


              {/* STATUS */}

              <div className="candidate-field">

                <label htmlFor="status">
                  Status
                </label>


                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >

                  {statusOptions.map(
                    (status) => (

                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>

                    )
                  )}

                </select>

              </div>

            </div>


            {/* FORM ACTIONS */}

            <div className="candidate-form-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeForm}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >

                {submitting
                  ? "Saving..."
                  : editingId !== null
                    ? "Update Candidate"
                    : "Create Candidate"}

              </button>

            </div>

          </form>

        </section>

      )}


      {/* ========================================
          CANDIDATE LIST
      ======================================== */}

      <section className="card candidates-list-panel">

        <div className="candidate-panel-header">

          <div>

            <h2>
              Registered Candidates
            </h2>


            <p>

              {candidates.length} candidate
              {candidates.length !== 1
                ? "s"
                : ""}{" "}
              found.

            </p>

          </div>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="candidate-empty-state">

            Loading candidates...

          </div>

        )


        /* EMPTY */

        : candidates.length === 0 ? (

          <div className="candidate-empty-state">

            <h3>
              {search || statusFilter
                ? "No matching candidates"
                : "No candidates yet"}
            </h3>


            <p>

              {search || statusFilter
                ? "Try changing your search or status filter."
                : "Create your first candidate to begin managing recruitment records."}

            </p>


            {(search || statusFilter) && (

              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            )}

          </div>

        )


        /* CANDIDATE TABLE */

        : (

          <div className="candidates-table-wrapper">

            <table className="candidates-table">

              <thead>

                <tr>

                  <th>
                    Name
                  </th>

                  <th>
                    Contact
                  </th>

                  <th>
                    Passport
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {candidates.map(
                  (candidate) => (

                    <tr
                      key={candidate.id}
                    >

                      {/* NAME */}

                      <td>

                        <strong>
                          {candidate.fullName}
                        </strong>


                        <span className="candidate-id">
                          ID #{candidate.id}
                        </span>

                      </td>


                      {/* CONTACT */}

                      <td>

                        <span>
                          {candidate.email ||
                            "—"}
                        </span>


                        <span className="candidate-secondary">
                          {candidate.phone ||
                            "—"}
                        </span>

                      </td>


                      {/* PASSPORT */}

                      <td>

                        {candidate.passportNumber ||
                          "—"}

                      </td>


                      {/* STATUS */}

                      <td>

                        <span className="status-badge status-active">
                          {candidate.status}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="candidate-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            className="candidate-action-btn"
                            onClick={() =>
                              handleView(
                                candidate.id
                              )
                            }
                          >
                            View
                          </button>


                          {/* EDIT */}

                          <button
                            type="button"
                            className="candidate-action-btn"
                            onClick={() =>
                              handleEdit(
                                candidate.id
                              )
                            }
                          >
                            Edit
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            className="candidate-action-btn candidate-delete-btn"
                            onClick={() =>
                              handleDelete(
                                candidate.id
                              )
                            }
                            disabled={
                              deletingId ===
                              candidate.id
                            }
                          >

                            {deletingId ===
                            candidate.id
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
          VIEW CANDIDATE MODAL
      ======================================== */}

      {viewingCandidate && (

        <div className="candidate-modal-overlay">

          <div className="candidate-modal">


            {/* MODAL HEADER */}

            <div className="candidate-modal-header">

              <div>

                <span className="candidates-eyebrow">
                  CANDIDATE DETAILS
                </span>


                <h2>
                  {viewingCandidate.fullName}
                </h2>

              </div>


              <button
                type="button"
                className="candidate-modal-close"
                onClick={() =>
                  setViewingCandidate(null)
                }
              >
                ×
              </button>

            </div>


            {/* DETAILS */}

            <div className="candidate-details-grid">


              <div>

                <span>
                  Email
                </span>

                <strong>
                  {viewingCandidate.email ||
                    "—"}
                </strong>

              </div>


              <div>

                <span>
                  Phone
                </span>

                <strong>
                  {viewingCandidate.phone ||
                    "—"}
                </strong>

              </div>


              <div>

                <span>
                  Gender
                </span>

                <strong>
                  {viewingCandidate.gender ||
                    "—"}
                </strong>

              </div>


              <div>

                <span>
                  Nationality
                </span>

                <strong>
                  {viewingCandidate.nationality ||
                    "—"}
                </strong>

              </div>


              <div>

                <span>
                  Passport
                </span>

                <strong>
                  {viewingCandidate.passportNumber ||
                    "—"}
                </strong>

              </div>


              <div>

                <span>
                  Education
                </span>

                <strong>
                  {viewingCandidate.education ||
                    "—"}
                </strong>

              </div>


              <div>

                <span>
                  Experience
                </span>

                <strong>
                  {viewingCandidate.experience ||
                    "—"}
                </strong>

              </div>


              <div>

                <span>
                  Status
                </span>

                <strong>
                  {viewingCandidate.status}
                </strong>

              </div>


              <div className="candidate-detail-full">

                <span>
                  Address
                </span>

                <strong>
                  {viewingCandidate.address ||
                    "—"}
                </strong>

              </div>


              <div className="candidate-detail-full">

                <span>
                  Skills
                </span>

                <strong>
                  {viewingCandidate.skills ||
                    "—"}
                </strong>

              </div>

            </div>


            {/* MODAL ACTIONS */}

            <div className="candidate-modal-actions">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setViewingCandidate(null)
                }
              >
                Close
              </button>


              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {

                  const id =
                    viewingCandidate.id;


                  setViewingCandidate(null);


                  handleEdit(id);

                }}
              >
                Edit Candidate
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );
}


export default Candidates;