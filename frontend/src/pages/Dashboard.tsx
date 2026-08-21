import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

interface StoredUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

function Dashboard() {
  const navigate = useNavigate();

  let user: StoredUser | null = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

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
              Monitor your recruitment operations from one place.
            </p>
          </div>


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

          <div className="card dashboard-stat-card">
            <span className="dashboard-stat-label">
              Candidates
            </span>

            <strong>248</strong>

            <span className="dashboard-stat-success">
              +12% this month
            </span>
          </div>


          <div className="card dashboard-stat-card">
            <span className="dashboard-stat-label">
              Employers
            </span>

            <strong>32</strong>

            <span className="dashboard-stat-success">
              +5 new
            </span>
          </div>


          <div className="card dashboard-stat-card">
            <span className="dashboard-stat-label">
              Applications
            </span>

            <strong>156</strong>

            <span className="dashboard-stat-warning">
              24 pending
            </span>
          </div>


          <div className="card dashboard-stat-card">
            <span className="dashboard-stat-label">
              Documents
            </span>

            <strong>421</strong>

            <span className="dashboard-stat-success">
              398 verified
            </span>
          </div>

        </section>


        {/* =========================
            CONTENT GRID
        ========================== */}

        <section className="dashboard-content-grid">

          {/* Recruitment Pipeline */}

          <div className="card dashboard-panel">

            <div className="dashboard-panel-header">

              <div>
                <h2>Recruitment Pipeline</h2>

                <p>
                  Candidate progress across recruitment stages.
                </p>
              </div>

              <span className="status-badge status-active">
                Active
              </span>

            </div>


            <div className="dashboard-pipeline">

              <div>
                <span>Registered</span>

                <strong>248</strong>

                <div className="pipeline-bar">
                  <span style={{ width: "90%" }} />
                </div>
              </div>


              <div>
                <span>Screening</span>

                <strong>184</strong>

                <div className="pipeline-bar">
                  <span style={{ width: "72%" }} />
                </div>
              </div>


              <div>
                <span>Interview</span>

                <strong>126</strong>

                <div className="pipeline-bar">
                  <span style={{ width: "54%" }} />
                </div>
              </div>


              <div>
                <span>Selected</span>

                <strong>82</strong>

                <div className="pipeline-bar">
                  <span style={{ width: "36%" }} />
                </div>
              </div>

            </div>

          </div>


          {/* Quick Actions */}

          <div className="card dashboard-panel">

            <div className="dashboard-panel-header">

              <div>
                <h2>Quick Actions</h2>

                <p>
                  Common recruitment operations.
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
            RECENT ACTIVITY
        ========================== */}

        <section className="card dashboard-panel dashboard-activity">

          <div className="dashboard-panel-header">

            <div>
              <h2>Recent Activity</h2>

              <p>
                Latest recruitment operations.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline"
            >
              View Reports
            </button>

          </div>


          <div className="dashboard-table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Activity</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Time</th>
                </tr>
              </thead>


              <tbody>

                <tr>
                  <td>
                    Candidate profile created
                  </td>

                  <td>
                    Candidate
                  </td>

                  <td>
                    <span className="status-badge status-active">
                      Active
                    </span>
                  </td>

                  <td>
                    10 min ago
                  </td>
                </tr>


                <tr>
                  <td>
                    Employer requirement updated
                  </td>

                  <td>
                    Employer
                  </td>

                  <td>
                    <span className="status-badge status-pending">
                      Pending
                    </span>
                  </td>

                  <td>
                    32 min ago
                  </td>
                </tr>


                <tr>
                  <td>
                    Demand letter uploaded
                  </td>

                  <td>
                    Document
                  </td>

                  <td>
                    <span className="status-badge status-active">
                      Verified
                    </span>
                  </td>

                  <td>
                    1 hour ago
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;