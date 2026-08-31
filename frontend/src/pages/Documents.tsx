import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import "../styles/Documents.css";

// ========================================
// TYPES
// ========================================

interface Candidate {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
}

interface CandidatesResponse {
  success: boolean;
  count: number;
  candidates: Candidate[];
}

interface Document {
  id: number;
  name: string;
  type: string;
  fileUrl: string;
  fileName: string;
  mimeType: string | null;
  fileSize: number | null;
  description: string | null;
  candidateId: number;
  createdAt: string;
  updatedAt: string;

  candidate?: Candidate;
}

interface DocumentsResponse {
  success: boolean;
  count: number;
  documents: Document[];
}

interface DocumentResponse {
  success: boolean;
  message?: string;
  document?: Document;
}

interface DocumentForm {
  name: string;
  type: string;
  description: string;
}

// ========================================
// DOCUMENT TYPES
// ========================================

const documentTypes = [
  {
    value: "PASSPORT",
    label: "Passport",
  },
  {
    value: "CITIZENSHIP",
    label: "Citizenship",
  },
  {
    value: "EDUCATION_CERTIFICATE",
    label: "Education Certificate",
  },
  {
    value: "EXPERIENCE_LETTER",
    label: "Experience Letter",
  },
  {
    value: "MEDICAL_REPORT",
    label: "Medical Report",
  },
  {
    value: "POLICE_CLEARANCE",
    label: "Police Clearance",
  },
  {
    value: "CONTRACT",
    label: "Contract",
  },
  {
    value: "VISA",
    label: "Visa",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

// ========================================
// INITIAL FORM
// ========================================

const initialForm: DocumentForm = {
  name: "",
  type: "PASSPORT",
  description: "",
};

// ========================================
// API BASE URL
// ========================================

const API_BASE_URL = "http://localhost:5000";

// ========================================
// HELPERS
// ========================================

const formatFileSize = (bytes: number | null) => {
  if (!bytes) {
    return "—";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDocumentTypeLabel = (type: string) => {
  const documentType = documentTypes.find(
    (item) => item.value === type
  );

  return documentType?.label || type;
};

const getFileUrl = (fileUrl: string) => {
  if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
    return fileUrl;
  }

  return `${API_BASE_URL}${fileUrl}`;
};

// ========================================
// COMPONENT
// ========================================

function Documents() {
  // ========================================
  // STATE
  // ========================================

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [documents, setDocuments] = useState<Document[]>([]);

  const [selectedCandidateId, setSelectedCandidateId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState<DocumentForm>(initialForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [loadingCandidates, setLoadingCandidates] =
    useState(true);

  const [loadingDocuments, setLoadingDocuments] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  // ========================================
  // FETCH CANDIDATES
  // ========================================

  const fetchCandidates = async () => {
    try {
      setLoadingCandidates(true);
      setError("");

      const response =
        await api.get<CandidatesResponse>(
          "/candidates"
        );

      if (response.data.success) {
        setCandidates(response.data.candidates);

        if (response.data.candidates.length > 0) {
          setSelectedCandidateId(
            response.data.candidates[0].id
          );
        } else {
          setSelectedCandidateId(null);
        }
      }
    } catch (error: any) {
      console.error(
        "Failed to fetch candidates:",
        error
      );

      if (error.response?.status === 401) {
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load candidates."
      );
    } finally {
      setLoadingCandidates(false);
    }
  };

  // ========================================
  // FETCH DOCUMENTS
  // ========================================

  const fetchDocuments = async (
    candidateId: number
  ) => {
    try {
      setLoadingDocuments(true);
      setError("");

      const response =
        await api.get<DocumentsResponse>(
          `/documents/candidate/${candidateId}`
        );

      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error: any) {
      console.error(
        "Failed to fetch documents:",
        error
      );

      if (error.response?.status === 401) {
        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load documents."
      );

      setDocuments([]);
    } finally {
      setLoadingDocuments(false);
    }
  };

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    fetchCandidates();
  }, []);

  // ========================================
  // LOAD DOCUMENTS WHEN CANDIDATE CHANGES
  // ========================================

  useEffect(() => {
    if (selectedCandidateId !== null) {
      fetchDocuments(selectedCandidateId);
    } else {
      setDocuments([]);
    }
  }, [selectedCandidateId]);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (
    event:
      React.ChangeEvent<
        HTMLInputElement |
          HTMLSelectElement |
          HTMLTextAreaElement
      >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ========================================
  // FILE CHANGE
  // ========================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // ========================================
    // MAX FILE SIZE
    // ========================================

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setError(
        "File size must be 10 MB or less."
      );

      event.target.value = "";
      setSelectedFile(null);

      return;
    }

    setError("");
    setSelectedFile(file);

    // Automatically use filename as document name
    if (!form.name.trim()) {
      const fileNameWithoutExtension =
        file.name.replace(/\.[^/.]+$/, "");

      setForm((previous) => ({
        ...previous,
        name: fileNameWithoutExtension,
      }));
    }
  };

  // ========================================
  // UPLOAD DOCUMENT
  // ========================================

  const handleUpload = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // ========================================
    // VALIDATE CANDIDATE
    // ========================================

    if (selectedCandidateId === null) {
      setError(
        "Please select a candidate."
      );

      return;
    }

    // ========================================
    // VALIDATE NAME
    // ========================================

    if (!form.name.trim()) {
      setError(
        "Please enter a document name."
      );

      return;
    }

    // ========================================
    // VALIDATE FILE
    // ========================================

    if (!selectedFile) {
      setError(
        "Please select a document file."
      );

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "type",
        form.type
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "file",
        selectedFile
      );

      const response =
        await api.post<DocumentResponse>(
          `/documents/candidate/${selectedCandidateId}`,
          formData
        );

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            "Document uploaded successfully."
        );

        // Reset form
        setForm(initialForm);

        setSelectedFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Reload documents
        await fetchDocuments(
          selectedCandidateId
        );
      }
    } catch (error: any) {
      console.error(
        "Document upload error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  // ========================================
  // DELETE DOCUMENT
  // ========================================

  const handleDelete = async (
    document: Document
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${document.name}"? This will permanently remove the document file.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(document.id);
      setError("");
      setSuccess("");

      const response =
        await api.delete<DocumentResponse>(
          `/documents/${document.id}`
        );

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            "Document deleted successfully."
        );

        setDocuments((previous) =>
          previous.filter(
            (item) =>
              item.id !== document.id
          )
        );
      }
    } catch (error: any) {
      console.error(
        "Document delete error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // OPEN DOCUMENT
  // ========================================

  const handleOpenDocument = (
    document: Document
  ) => {
    const url = getFileUrl(
      document.fileUrl
    );

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ========================================
  // SELECTED CANDIDATE
  // ========================================

  const selectedCandidate =
    candidates.find(
      (candidate) =>
        candidate.id ===
        selectedCandidateId
    );

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="documents-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="documents-header">

        <div>
          <span className="documents-eyebrow">
            DOCUMENT MANAGEMENT
          </span>

          <h1>Documents</h1>

          <p>
            Upload, view, and manage candidate
            documents securely.
          </p>
        </div>

      </div>

      {/* ========================================
          MESSAGES
      ======================================== */}

      {success && (
        <div className="document-message document-success">
          {success}
        </div>
      )}

      {error && (
        <div className="document-message document-error">
          {error}
        </div>
      )}

      {/* ========================================
          CANDIDATE SELECTOR
      ======================================== */}

      <section className="document-panel">

        <div className="document-panel-header">

          <div>
            <h2>Select Candidate</h2>

            <p>
              Choose the candidate whose
              documents you want to manage.
            </p>
          </div>

        </div>

        {loadingCandidates ? (
          <div className="document-loading">
            Loading candidates...
          </div>
        ) : candidates.length === 0 ? (
          <div className="document-empty-state">
            <h3>No candidates found</h3>

            <p>
              Create a candidate first before
              uploading documents.
            </p>
          </div>
        ) : (
          <div className="document-candidate-selector">

            <label htmlFor="candidate-select">
              Candidate
            </label>

            <select
              id="candidate-select"
              value={
                selectedCandidateId ?? ""
              }
              onChange={(event) => {
                const value =
                  Number(event.target.value);

                setSelectedCandidateId(
                  value
                );

                setSuccess("");
                setError("");
              }}
            >
              {candidates.map(
                (candidate) => (
                  <option
                    key={candidate.id}
                    value={candidate.id}
                  >
                    {candidate.fullName}
                    {" — ID "}
                    {candidate.id}
                  </option>
                )
              )}
            </select>

            {selectedCandidate && (
              <div className="selected-candidate-info">
                <strong>
                  {selectedCandidate.fullName}
                </strong>

                {selectedCandidate.email && (
                  <span>
                    {selectedCandidate.email}
                  </span>
                )}

                {selectedCandidate.phone && (
                  <span>
                    {selectedCandidate.phone}
                  </span>
                )}
              </div>
            )}

          </div>
        )}

      </section>

      {/* ========================================
          UPLOAD FORM
      ======================================== */}

      {selectedCandidateId !== null && (
        <section className="document-panel">

          <div className="document-panel-header">

            <div>
              <h2>Upload Document</h2>

              <p>
                Add a new document for{" "}
                <strong>
                  {selectedCandidate?.fullName}
                </strong>
                .
              </p>
            </div>

          </div>

          <form
            className="document-form"
            onSubmit={handleUpload}
          >

            <div className="document-form-grid">

              {/* NAME */}

              <div className="document-field">

                <label htmlFor="document-name">
                  Document Name
                </label>

                <input
                  id="document-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Passport"
                  value={form.name}
                  onChange={handleChange}
                  disabled={uploading}
                />

              </div>

              {/* TYPE */}

              <div className="document-field">

                <label htmlFor="document-type">
                  Document Type
                </label>

                <select
                  id="document-type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  disabled={uploading}
                >
                  {documentTypes.map(
                    (documentType) => (
                      <option
                        key={
                          documentType.value
                        }
                        value={
                          documentType.value
                        }
                      >
                        {documentType.label}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* FILE */}

              <div className="document-field document-field-full">

                <label htmlFor="document-file">
                  File
                </label>

                <input
                  ref={fileInputRef}
                  id="document-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={
                    handleFileChange
                  }
                  disabled={uploading}
                />

                <span className="document-help-text">
                  PDF, JPG, PNG, DOC, DOCX,
                  XLS and XLSX. Maximum size:
                  10 MB.
                </span>

                {selectedFile && (
                  <div className="selected-file">

                    <div>
                      <strong>
                        {selectedFile.name}
                      </strong>

                      <span>
                        {formatFileSize(
                          selectedFile.size
                        )}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="document-remove-file"
                      onClick={() => {
                        setSelectedFile(null);

                        if (
                          fileInputRef.current
                        ) {
                          fileInputRef.current.value =
                            "";
                        }
                      }}
                      disabled={uploading}
                    >
                      Remove
                    </button>

                  </div>
                )}

              </div>

              {/* DESCRIPTION */}

              <div className="document-field document-field-full">

                <label htmlFor="document-description">
                  Description
                  <span className="optional-label">
                    Optional
                  </span>
                </label>

                <textarea
                  id="document-description"
                  name="description"
                  rows={4}
                  placeholder="Add a short description about this document..."
                  value={
                    form.description
                  }
                  onChange={handleChange}
                  disabled={uploading}
                />

              </div>

            </div>

            <div className="document-form-actions">

              <button
                type="button"
                className="document-secondary-btn"
                onClick={() => {
                  setForm(initialForm);
                  setSelectedFile(null);

                  if (
                    fileInputRef.current
                  ) {
                    fileInputRef.current.value =
                      "";
                  }

                  setError("");
                  setSuccess("");
                }}
                disabled={uploading}
              >
                Clear
              </button>

              <button
                type="submit"
                className="document-primary-btn"
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : "Upload Document"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ========================================
          DOCUMENT LIST
      ======================================== */}

      {selectedCandidateId !== null && (
        <section className="document-panel">

          <div className="document-panel-header">

            <div>
              <h2>
                Candidate Documents
              </h2>

              <p>
                {selectedCandidate
                  ? `Documents belonging to ${selectedCandidate.fullName}.`
                  : "Manage candidate documents."}
              </p>
            </div>

            <div className="document-count">
              {documents.length}{" "}
              {documents.length === 1
                ? "document"
                : "documents"}
            </div>

          </div>

          {loadingDocuments ? (
            <div className="document-loading">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="document-empty-state">

              <div className="document-empty-icon">
                📄
              </div>

              <h3>
                No documents yet
              </h3>

              <p>
                Upload the first document
                for this candidate using
                the form above.
              </p>

            </div>
          ) : (
            <div className="documents-table-wrapper">

              <table className="documents-table">

                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Type</th>
                    <th>File</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {documents.map(
                    (document) => (
                      <tr
                        key={document.id}
                      >

                        {/* DOCUMENT */}

                        <td>
                          <strong>
                            {document.name}
                          </strong>

                          {document.description && (
                            <span className="document-secondary">
                              {
                                document.description
                              }
                            </span>
                          )}

                          <span className="document-id">
                            ID: {document.id}
                          </span>
                        </td>

                        {/* TYPE */}

                        <td>
                          <span className="document-type-badge">
                            {getDocumentTypeLabel(
                              document.type
                            )}
                          </span>
                        </td>

                        {/* FILE */}

                        <td>
                          <span className="document-file-name">
                            {document.fileName}
                          </span>
                        </td>

                        {/* SIZE */}

                        <td>
                          {formatFileSize(
                            document.fileSize
                          )}
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            document.createdAt
                          )}
                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="document-actions">

                            <button
                              type="button"
                              className="document-action-btn"
                              onClick={() =>
                                handleOpenDocument(
                                  document
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="document-action-btn document-delete-btn"
                              onClick={() =>
                                handleDelete(
                                  document
                                )
                              }
                              disabled={
                                deletingId ===
                                document.id
                              }
                            >
                              {deletingId ===
                              document.id
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
      )}

    </div>
  );
}

export default Documents;