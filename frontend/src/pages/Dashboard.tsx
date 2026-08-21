import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import "../styles/Dashboard.css";

interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
}

interface DashboardResponse {
  success: boolean;
  message: string;
  user: DashboardUser;
  stats: DashboardStats;
}

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<DashboardUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<DashboardResponse>(
          "/dashboard"
        );

        if (!response.data.success) {
          setError(
            response.data.message ||
              "Failed to load dashboard."
          );

          return;
        }

        setUser(response.data.user);
        setStats(response.data.stats);

      } catch (error: any) {
        console.error(
          "Dashboard API error:",
          error
        );

        /*
         * api.ts already handles 401 responses
         * and redirects to /login.
         */
        if (error.response?.status === 401) {
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


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };


  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-state-card">
          <div className="dashboard-loader" />

          <h2>Loading Dashboard</h2>

          <p>
            Fetching your dashboard information...
          </p>
        </div>
      </div>
    );
  }


  /*
   * Error state
   */
  if (error) {
    return (
      <div className="dashboard-state">
        <div className="dashboard-state-card dashboard-state-error">

          <h2>Unable to Load Dashboard</h2>

          <p>{error}</p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }


  return (
    <div className="dashboard-page">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-sidebar-brand">

          <div className="dashboard-brand-icon">
            S
          </div>

          <strong>ShramikSync</strong>

        </div>


        <nav className="dashboard-navigation">

          <button
            type="button"
            className="dashboard-nav-item active"
          >
            <span>01</span>
            Dashboard
          </button>

          <button
            type="button"
            className="dashboard-nav-item"
            onClick={() => navigate("/candidates")}
          >
          <span>02</span>
            Candidates
          </button>

          <button
            type="button"
            className="dashboard-nav-item"
          >
            <span>03</span>
            Employers
          </button>

          <button
            type="button"
            className="dashboard-nav-item"
          >
            <span>04</span>
            Demand Letters
          </button>

          <button
            type="button"
            className="dashboard-nav-item"
          >
            <span>05</span>
            Documents
          </button>

          <button
            type="button"
            className="dashboard-nav-item"
          >
            <span>06</span>
            Reports
          </button>

        </nav>


        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* =========================
          MAIN
      ========================== */}

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div>

            <span className="dashboard-eyebrow">
              RECRUITMENT MANAGEMENT
            </span>

            <h1>Dashboard</h1>

            <p>
              Monitor your recruitment operations
              from one place.
            </p>

          </div>


          {/* REAL USER FROM API */}

          <div className="dashboard-user">

            <div className="dashboard-user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
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


        {/* =========================
            STATS
        ========================== */}

        <section className="dashboard-stats">

          {/* REAL DATABASE COUNT */}

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


          {/* Not available yet */}

          <div className="card dashboard-stat-card">

            <span className="dashboard-stat-label">
              Candidates
            </span>

            <strong>—</strong>

            <span className="dashboard-stat-warning">
              Coming next
            </span>

          </div>


          <div className="card dashboard-stat-card">

            <span className="dashboard-stat-label">
              Employers
            </span>

            <strong>—</strong>

            <span className="dashboard-stat-warning">
              Coming next
            </span>

          </div>


          <div className="card dashboard-stat-card">

            <span className="dashboard-stat-label">
              Documents
            </span>

            <strong>—</strong>

            <span className="dashboard-stat-warning">
              Coming next
            </span>

          </div>

        </section>


        {/* =========================
            ACCOUNT INFORMATION
        ========================== */}

        <section className="dashboard-content-grid">

          <div className="card dashboard-panel">

            <div className="dashboard-panel-header">

              <div>

                <h2>Account Information</h2>

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

              <div>
                <span>Name</span>
                <strong>
                  {user?.name || "—"}
                </strong>
              </div>

              <div>
                <span>Email</span>
                <strong>
                  {user?.email || "—"}
                </strong>
              </div>

              <div>
                <span>Role</span>
                <strong>
                  {user?.role || "—"}
                </strong>
              </div>

              <div>
                <span>User ID</span>
                <strong>
                  {user?.id ?? "—"}
                </strong>
              </div>

            </div>

          </div>


          {/* Quick Actions */}

          <div className="card dashboard-panel">

            <div className="dashboard-panel-header">

              <div>

                <h2>Quick Actions</h2>

                <p>
                  Recruitment operations.
                </p>

              </div>

            </div>


            <div className="dashboard-actions">

              <button
                type="button"
                className="btn btn-primary"
              >
                Create Candidate
              </button>

              <button
                type="button"
                className="btn btn-secondary"
              >
                Add Employer
              </button>

              <button
                type="button"
                className="btn btn-secondary"
              >
                Create Demand Letter
              </button>

              <button
                type="button"
                className="btn btn-secondary"
              >
                Upload Document
              </button>

            </div>

          </div>

        </section>


        {/* =========================
            RECRUITMENT PIPELINE
        ========================== */}

        <section className="card dashboard-panel">

          <div className="dashboard-panel-header">

            <div>

              <h2>Recruitment Pipeline</h2>

              <p>
                Recruitment statistics will appear
                here as the database modules are added.
              </p>

            </div>

            <span className="status-badge status-pending">
              Setup in progress
            </span>

          </div>


          <div className="dashboard-empty-state">

            <h3>
              Recruitment modules are coming next
            </h3>

            <p>
              Candidate, employer, demand letter,
              and document data will be connected
              to this dashboard after their database
              models are implemented.
            </p>

          </div>

        </section>


        {/* =========================
            ACCOUNT STATUS
        ========================== */}

        <section className="card dashboard-panel dashboard-activity">

          <div className="dashboard-panel-header">

            <div>

              <h2>System Status</h2>

              <p>
                Current authentication status.
              </p>

            </div>

            <span className="status-badge status-active">
              Connected
            </span>

          </div>


          <div className="dashboard-status-list">

            <div>
              <span>Authentication</span>
              <strong>JWT Verified</strong>
            </div>

            <div>
              <span>Backend API</span>
              <strong>Connected</strong>
            </div>

            <div>
              <span>Database</span>
              <strong>Connected</strong>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;