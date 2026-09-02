import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../styles/Dashboard.css";

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
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

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>01</span>
            Dashboard
          </NavLink>


          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>02</span>
            Candidates
          </NavLink>


          <NavLink
            to="/employers"
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>03</span>
            Employers
          </NavLink>


          <NavLink
            to="/demand-letters"
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>04</span>
            Demand Letters
          </NavLink>


          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>05</span>
            Documents
          </NavLink>


          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>06</span>
            Reports
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `dashboard-nav-item ${
                isActive ? "active" : ""
              }`
            }
          >
            <span>07</span>
            Setting
          </NavLink>

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
          MAIN CONTENT
      ======================================== */}

      <main className="dashboard-main">
        <Outlet />
      </main>

    </div>
  );
}

export default DashboardLayout;