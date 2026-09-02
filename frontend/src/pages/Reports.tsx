import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Reports.css";

interface StatusCount {
  status: string;
  count: number;
}

interface TypeCount {
  type: string;
  count: number;
}

interface ReportData {
  candidates: {
    total: number;
    byStatus: StatusCount[];
  };

  employers: {
    total: number;
    byStatus: StatusCount[];
  };

  demandLetters: {
    total: number;
    byStatus: StatusCount[];
  };

  documents: {
    total: number;
    byType: TypeCount[];
  };

  assignments: {
    totalWorkersRequired: number;
    totalWorkersAssigned: number;
    remainingWorkers: number;
  };
}


/* ========================================
   CONSTANTS
======================================== */

const candidateStatuses = [
  "REGISTERED",
  "SCREENING",
  "INTERVIEW",
  "SELECTED",
  "REJECTED",
  "PLACED",
];

const employerStatuses = [
  "ACTIVE",
  "PENDING",
  "INACTIVE",
];

const demandLetterStatuses = [
  "DRAFT",
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
  "COMPLETED",
];

const documentTypes = [
  "PASSPORT",
  "CITIZENSHIP",
  "EDUCATION_CERTIFICATE",
  "EXPERIENCE_LETTER",
  "MEDICAL_REPORT",
  "POLICE_CLEARANCE",
  "CONTRACT",
  "VISA",
  "OTHER",
];


/* ========================================
   HELPERS
======================================== */

const formatLabel = (value: string): string => {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};


const getStatusCount = (
  items: StatusCount[],
  status: string
): number => {
  return (
    items.find(
      (item) => item.status === status
    )?.count ?? 0
  );
};


const getTypeCount = (
  items: TypeCount[],
  type: string
): number => {
  return (
    items.find(
      (item) => item.type === type
    )?.count ?? 0
  );
};


const getPercentage = (
  value: number,
  total: number
): number => {
  if (!total || total <= 0) {
    return 0;
  }

  return Math.round(
    (value / total) * 100
  );
};


/* ========================================
   REPORTS COMPONENT
======================================== */

export default function Reports() {
  const [report, setReport] =
    useState<ReportData | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>("");

  const [refreshing, setRefreshing] =
    useState<boolean>(false);


  /* ========================================
     LOAD REPORTS
  ======================================== */

  const loadReports = async (
    isRefresh = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get(
        "/reports/summary"
      );

      /*
       * Expected response:
       *
       * {
       *   candidates: {...},
       *   employers: {...},
       *   demandLetters: {...},
       *   documents: {...},
       *   assignments: {...}
       * }
       */

      setReport(response.data);
    } catch (err: any) {
      console.error(
        "Failed to load reports:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  /* ========================================
     INITIAL LOAD
  ======================================== */

  useEffect(() => {
    loadReports();
  }, []);


  /* ========================================
     LOADING STATE
  ======================================== */

  if (loading) {
    return (
      <div className="reports-page">

        <header className="reports-header">
          <div>
            <span className="reports-eyebrow">
              BUSINESS REPORTS
            </span>

            <h1>Reports</h1>

            <p>
              Loading recruitment and workforce
              statistics...
            </p>
          </div>
        </header>


        <div className="reports-loading">
          <div className="reports-spinner" />

          <p>
            Loading report data...
          </p>
        </div>

      </div>
    );
  }


  /* ========================================
     ERROR STATE
  ======================================== */

  if (error || !report) {
    return (
      <div className="reports-page">

        <header className="reports-header">
          <div>
            <span className="reports-eyebrow">
              BUSINESS REPORTS
            </span>

            <h1>Reports</h1>

            <p>
              Overview of your recruitment
              operations.
            </p>
          </div>
        </header>


        <div className="reports-error">

          <div className="reports-error-icon">
            !
          </div>

          <div>
            <h3>
              Unable to load reports
            </h3>

            <p>
              {error ||
                "No report data was returned from the server."}
            </p>
          </div>

          <button
            type="button"
            className="reports-retry-btn"
            onClick={() => loadReports()}
          >
            Retry
          </button>

        </div>

      </div>
    );
  }


  /* ========================================
     CALCULATIONS
  ======================================== */

  const assignmentPercentage =
    getPercentage(
      report.assignments
        .totalWorkersAssigned,
      report.assignments
        .totalWorkersRequired
    );

  const safeAssignmentPercentage =
    Math.min(
      Math.max(assignmentPercentage, 0),
      100
    );


  /* ========================================
     MAIN RENDER
  ======================================== */

  return (
    <div className="reports-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="reports-header">

        <div>
          <span className="reports-eyebrow">
            BUSINESS REPORTS
          </span>

          <h1>Reports</h1>

          <p>
            Overview of candidates, employers,
            demand letters, documents, and
            worker assignments.
          </p>
        </div>


        <button
          type="button"
          className="reports-refresh-btn"
          onClick={() => loadReports(true)}
          disabled={refreshing}
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh Reports"}
        </button>

      </header>


      {/* ========================================
          SUMMARY CARDS
      ======================================== */}

      <section className="reports-summary-grid">

        {/* Candidates */}

        <article className="report-summary-card">

          <div className="report-card-top">

            <span className="report-card-label">
              Candidates
            </span>

            <span className="report-card-icon">
              C
            </span>

          </div>

          <strong className="report-card-number">
            {report.candidates.total}
          </strong>

          <span className="report-card-description">
            Total registered candidates
          </span>

        </article>


        {/* Employers */}

        <article className="report-summary-card">

          <div className="report-card-top">

            <span className="report-card-label">
              Employers
            </span>

            <span className="report-card-icon">
              E
            </span>

          </div>

          <strong className="report-card-number">
            {report.employers.total}
          </strong>

          <span className="report-card-description">
            Total employers
          </span>

        </article>


        {/* Demand Letters */}

        <article className="report-summary-card">

          <div className="report-card-top">

            <span className="report-card-label">
              Demand Letters
            </span>

            <span className="report-card-icon">
              D
            </span>

          </div>

          <strong className="report-card-number">
            {report.demandLetters.total}
          </strong>

          <span className="report-card-description">
            Total demand letters
          </span>

        </article>


        {/* Documents */}

        <article className="report-summary-card">

          <div className="report-card-top">

            <span className="report-card-label">
              Documents
            </span>

            <span className="report-card-icon">
              F
            </span>

          </div>

          <strong className="report-card-number">
            {report.documents.total}
          </strong>

          <span className="report-card-description">
            Uploaded candidate documents
          </span>

        </article>

      </section>


      {/* ========================================
          WORKER ASSIGNMENT
      ======================================== */}

      <section className="report-panel">

        <div className="report-panel-header">

          <div>
            <h2>
              Worker Assignment Overview
            </h2>

            <p>
              Demand requirements compared
              with currently assigned
              candidates.
            </p>
          </div>

          <span className="report-percentage">
            {assignmentPercentage}%
          </span>

        </div>


        <div className="assignment-stats">

          <div className="assignment-stat">
            <span>
              Workers Required
            </span>

            <strong>
              {
                report.assignments
                  .totalWorkersRequired
              }
            </strong>
          </div>


          <div className="assignment-stat">
            <span>
              Workers Assigned
            </span>

            <strong>
              {
                report.assignments
                  .totalWorkersAssigned
              }
            </strong>
          </div>


          <div className="assignment-stat">
            <span>
              Remaining
            </span>

            <strong>
              {
                report.assignments
                  .remainingWorkers
              }
            </strong>
          </div>

        </div>


        <div className="assignment-progress">

          <div className="assignment-progress-track">

            <div
              className="assignment-progress-fill"
              style={{
                width:
                  `${safeAssignmentPercentage}%`,
              }}
            />

          </div>


          <div className="assignment-progress-labels">

            <span>
              {
                report.assignments
                  .totalWorkersAssigned
              }{" "}
              assigned
            </span>

            <span>
              {
                report.assignments
                  .totalWorkersRequired
              }{" "}
              required
            </span>

          </div>

        </div>

      </section>


      {/* ========================================
          CANDIDATE OVERVIEW
      ======================================== */}

      <section className="report-panel">

        <div className="report-panel-header">

          <div>
            <h2>
              Candidate Overview
            </h2>

            <p>
              Candidate distribution by
              recruitment status.
            </p>
          </div>

          <strong className="report-panel-total">
            {report.candidates.total} total
          </strong>

        </div>


        <div className="report-bars">

          {candidateStatuses.map(
            (status) => {

              const count =
                getStatusCount(
                  report.candidates.byStatus,
                  status
                );

              const percentage =
                getPercentage(
                  count,
                  report.candidates.total
                );

              return (
                <div
                  className="report-bar-row"
                  key={status}
                >

                  <div className="report-bar-info">

                    <span>
                      {formatLabel(status)}
                    </span>

                    <strong>
                      {count}
                    </strong>

                  </div>


                  <div className="report-bar-track">

                    <div
                      className="report-bar-fill"
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    />

                  </div>


                  <span className="report-bar-percentage">
                    {percentage}%
                  </span>

                </div>
              );
            }
          )}

        </div>

      </section>


      {/* ========================================
          EMPLOYERS + DEMAND LETTERS
      ======================================== */}

      <div className="reports-two-column">

        {/* Employer Overview */}

        <section className="report-panel">

          <div className="report-panel-header">

            <div>
              <h2>
                Employer Overview
              </h2>

              <p>
                Employers grouped by current
                status.
              </p>
            </div>

            <strong className="report-panel-total">
              {report.employers.total}
            </strong>

          </div>


          <div className="report-status-list">

            {employerStatuses.map(
              (status) => {

                const count =
                  getStatusCount(
                    report.employers.byStatus,
                    status
                  );

                return (
                  <div
                    className="report-status-item"
                    key={status}
                  >

                    <span>
                      {formatLabel(status)}
                    </span>

                    <strong>
                      {count}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </section>


        {/* Demand Letters */}

        <section className="report-panel">

          <div className="report-panel-header">

            <div>
              <h2>
                Demand Letters
              </h2>

              <p>
                Demand letters grouped by
                status.
              </p>
            </div>

            <strong className="report-panel-total">
              {report.demandLetters.total}
            </strong>

          </div>


          <div className="report-status-list">

            {demandLetterStatuses.map(
              (status) => {

                const count =
                  getStatusCount(
                    report.demandLetters
                      .byStatus,
                    status
                  );

                return (
                  <div
                    className="report-status-item"
                    key={status}
                  >

                    <span>
                      {formatLabel(status)}
                    </span>

                    <strong>
                      {count}
                    </strong>

                  </div>
                );
              }
            )}

          </div>

        </section>

      </div>


      {/* ========================================
          DOCUMENT OVERVIEW
      ======================================== */}

      <section className="report-panel">

        <div className="report-panel-header">

          <div>
            <h2>
              Document Overview
            </h2>

            <p>
              Uploaded documents grouped by
              document type.
            </p>
          </div>

          <strong className="report-panel-total">
            {report.documents.total}
          </strong>

        </div>


        <div className="document-report-grid">

          {documentTypes.map(
            (type) => {

              const count =
                getTypeCount(
                  report.documents.byType,
                  type
                );

              return (
                <div
                  className="document-report-item"
                  key={type}
                >

                  <span>
                    {formatLabel(type)}
                  </span>

                  <strong>
                    {count}
                  </strong>

                </div>
              );
            }
          )}

        </div>

      </section>

    </div>
  );
}