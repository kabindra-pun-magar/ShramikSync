import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import api from "../services/api";

import "../styles/Dashboard.css";


// ========================================
// TYPES
// ========================================

interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}


interface DashboardStats {
  totalUsers: number;
  totalCandidates: number;
  registeredCandidates: number;
  totalEmployers: number;
}


interface DashboardResponse {
  success: boolean;
  message: string;

  user: DashboardUser;

  stats: DashboardStats;
}


// ========================================
// COMPONENT
// ========================================

function Dashboard() {

  // ========================================
  // NAVIGATION
  // ========================================

  const navigate = useNavigate();


  // ========================================
  // USER
  // ========================================

  const [user, setUser] =
    useState<DashboardUser | null>(null);


  // ========================================
  // STATISTICS
  // ========================================

  const [stats, setStats] =
    useState<DashboardStats | null>(null);


  // ========================================
  // UI STATES
  // ========================================

  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // ========================================
  // FETCH DASHBOARD
  // ========================================

  useEffect(() => {

    const fetchDashboard = async () => {

      try {

        setLoading(true);

        setError("");


        const response =
          await api.get<DashboardResponse>(
            "/dashboard"
          );


        // ========================================
        // API ERROR RESPONSE
        // ========================================

        if (!response.data.success) {

          setError(
            response.data.message ||
            "Failed to load dashboard."
          );

          return;
        }


        // ========================================
        // STORE API DATA
        // ========================================

        setUser(
          response.data.user
        );


        setStats(
          response.data.stats
        );


      } catch (error: any) {

        console.error(
          "Dashboard API error:",
          error
        );


        /*
         * api.ts already handles 401 responses
         * and redirects the user to /login.
         */

        if (
          error.response?.status === 401
        ) {
          return;
        }


        setError(
          error.response?.data?.message ||
          "Unable to load dashboard data."
        );


      } finally {

        setLoading(false);

      }

    };


    fetchDashboard();

  }, []);



  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {

    return (

      <div className="dashboard-state">

        <div className="dashboard-state-card">

          <div className="dashboard-loader" />

          <h2>
            Loading Dashboard
          </h2>

          <p>
            Fetching your dashboard information...
          </p>

        </div>

      </div>

    );

  }



  // ========================================
  // ERROR STATE
  // ========================================

  if (error) {

    return (

      <div className="dashboard-state">

        <div className="dashboard-state-card dashboard-state-error">

          <h2>
            Unable to Load Dashboard
          </h2>

          <p>
            {error}
          </p>


          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>

    );

  }



  // ========================================
  // DASHBOARD
  // ========================================

  return (

    <div className="dashboard-content">


      {/* ========================================
          HEADER
      ======================================== */}

      <header className="dashboard-header">

        <div>

          <span className="dashboard-eyebrow">
            RECRUITMENT MANAGEMENT
          </span>


          <h1>
            Dashboard
          </h1>


          <p>
            Monitor your recruitment operations
            from one place.
          </p>

        </div>


        {/* ========================================
            AUTHENTICATED USER
        ======================================== */}

        <div className="dashboard-user">

          <div className="dashboard-user-avatar">

            {user?.name
              ?.charAt(0)
              .toUpperCase() || "U"}

          </div>


          <div>

            <strong>
              {user?.name || "User"}
            </strong>


            <span>
              {user?.role || "USER"}
            </span>

          </div>

        </div>

      </header>



      {/* ========================================
          STATS
      ======================================== */}

      <section className="dashboard-stats">


        {/* ========================================
            REGISTERED USERS
        ======================================== */}

        <div className="card dashboard-stat-card">

          <span className="dashboard-stat-label">
            Registered Users
          </span>


          <strong>
            {stats?.totalUsers ?? 0}
          </strong>


          <span className="dashboard-stat-success">
            From database
          </span>

        </div>



        {/* ========================================
            TOTAL CANDIDATES
        ======================================== */}

        <div className="card dashboard-stat-card">

          <span className="dashboard-stat-label">
            Candidates
          </span>


          <strong>
            {stats?.totalCandidates ?? 0}
          </strong>


          <span className="dashboard-stat-success">
            From database
          </span>

        </div>



        {/* ========================================
            REGISTERED CANDIDATES
        ======================================== */}

        <div className="card dashboard-stat-card">

          <span className="dashboard-stat-label">
            Registered Candidates
          </span>


          <strong>
            {stats?.registeredCandidates ?? 0}
          </strong>


          <span className="dashboard-stat-success">
            Current status
          </span>

        </div>



        {/* ========================================
    EMPLOYERS
======================================== */}

        <div className="card dashboard-stat-card">

          <span className="dashboard-stat-label">
            Employers
          </span>

          <strong>
            {stats?.totalEmployers ?? 0}
          </strong>

          <span className="dashboard-stat-success">
            From database
          </span>

        </div>

      </section>



      {/* ========================================
          ACCOUNT INFORMATION + QUICK ACTIONS
      ======================================== */}

      <section className="dashboard-content-grid">


        {/* ========================================
            ACCOUNT INFORMATION
        ======================================== */}

        <div className="card dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Account Information
              </h2>


              <p>
                Information retrieved from your
                authenticated account.
              </p>

            </div>


            <span className="status-badge status-active">
              Authenticated
            </span>

          </div>



          <div className="dashboard-account-grid">


            {/* NAME */}

            <div>

              <span>
                Name
              </span>


              <strong>
                {user?.name || "—"}
              </strong>

            </div>



            {/* EMAIL */}

            <div>

              <span>
                Email
              </span>


              <strong>
                {user?.email || "—"}
              </strong>

            </div>



            {/* ROLE */}

            <div>

              <span>
                Role
              </span>


              <strong>
                {user?.role || "—"}
              </strong>

            </div>



            {/* USER ID */}

            <div>

              <span>
                User ID
              </span>


              <strong>
                {user?.id ?? "—"}
              </strong>

            </div>

          </div>

        </div>



        {/* ========================================
            QUICK ACTIONS
        ======================================== */}

        <div className="card dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>
                Quick Actions
              </h2>


              <p>
                Recruitment operations.
              </p>

            </div>

          </div>



          <div className="dashboard-actions">


            {/* ========================================
                CREATE CANDIDATE
            ======================================== */}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                navigate("/candidates")
              }
            >
              Create Candidate
            </button>



            {/* ========================================
                ADD EMPLOYER
            ======================================== */}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                navigate("/employers")
              }
            >
              Add Employer
            </button>



            {/* ========================================
                CREATE DEMAND LETTER
            ======================================== */}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                navigate("/demand-letters")
              }
            >
              Create Demand Letter
            </button>



            {/* ========================================
                UPLOAD DOCUMENT
            ======================================== */}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                navigate("/documents")
              }
            >
              Upload Document
            </button>

          </div>

        </div>

      </section>



      {/* ========================================
          RECRUITMENT PIPELINE
      ======================================== */}

      <section className="card dashboard-panel">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              Recruitment Pipeline
            </h2>


            <p>
              Current candidate registration status.
            </p>

          </div>


          <span className="status-badge status-active">
            Connected
          </span>

        </div>



        <div className="dashboard-pipeline">


          {/* REGISTERED */}

          <div className="dashboard-pipeline-item">

            <span>
              Registered
            </span>


            <strong>
              {stats?.registeredCandidates ?? 0}
            </strong>

          </div>



          {/* TOTAL */}

          <div className="dashboard-pipeline-item">

            <span>
              Total Candidates
            </span>


            <strong>
              {stats?.totalCandidates ?? 0}
            </strong>

          </div>



          {/* OTHER STATUSES */}

          <div className="dashboard-pipeline-item">

            <span>
              Other Statuses
            </span>


            <strong>
              {Math.max(
                0,
                (stats?.totalCandidates ?? 0) -
                (stats?.registeredCandidates ?? 0)
              )}
            </strong>

          </div>

        </div>

      </section>



      {/* ========================================
          SYSTEM STATUS
      ======================================== */}

      <section className="card dashboard-panel dashboard-activity">

        <div className="dashboard-panel-header">

          <div>

            <h2>
              System Status
            </h2>


            <p>
              Current authentication and
              application status.
            </p>

          </div>


          <span className="status-badge status-active">
            Connected
          </span>

        </div>



        <div className="dashboard-status-list">


          {/* AUTHENTICATION */}

          <div>

            <span>
              Authentication
            </span>


            <strong>
              JWT Verified
            </strong>

          </div>



          {/* BACKEND */}

          <div>

            <span>
              Backend API
            </span>


            <strong>
              Connected
            </strong>

          </div>



          {/* DATABASE */}

          <div>

            <span>
              Database
            </span>


            <strong>
              Connected
            </strong>

          </div>

        </div>

      </section>

    </div>

  );

}


export default Dashboard;