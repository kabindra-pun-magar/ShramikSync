import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-layout">

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside className="dashboard-sidebar">

        {/* Brand */}

        <div className="dashboard-sidebar-brand">

          <div className="dashboard-brand-icon">
            S
          </div>

          <strong>ShramikSync</strong>

        </div>


        {/* Navigation */}

        <nav className="dashboard-navigation">

          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/dashboard") ? "active" : ""
            }`}
            onClick={() => navigate("/dashboard")}
          >
            <span>01</span>
            Dashboard
          </button>


          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/candidates") ? "active" : ""
            }`}
            onClick={() => navigate("/candidates")}
          >
            <span>02</span>
            Candidates
          </button>


          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/employers") ? "active" : ""
            }`}
            onClick={() => navigate("/employers")}
          >
            <span>03</span>
            Employers
          </button>


          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/demand-letters") ? "active" : ""
            }`}
            onClick={() => navigate("/demand-letters")}
          >
            <span>04</span>
            Demand Letters
          </button>


          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/documents") ? "active" : ""
            }`}
            onClick={() => navigate("/documents")}
          >
            <span>05</span>
            Documents
          </button>


          <button
            type="button"
            className={`dashboard-nav-item ${
              isActive("/reports") ? "active" : ""
            }`}
            onClick={() => navigate("/reports")}
          >
            <span>06</span>
            Reports
          </button>

        </nav>


        {/* Logout */}

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>


      {/* ========================================
          PAGE CONTENT
      ======================================== */}

      <main className="dashboard-main">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;