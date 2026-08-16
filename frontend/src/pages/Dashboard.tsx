import { Link } from "react-router-dom";
// import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-logo">S</div>
          <span>ShramikSync</span>
        </div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="dashboard-nav-item active">
            <span>▦</span>
            Dashboard
          </Link>

          <Link to="/candidates" className="dashboard-nav-item">
            <span>◉</span>
            Candidates
          </Link>

          <Link to="/employers" className="dashboard-nav-item">
            <span>▣</span>
            Employers
          </Link>

          <Link to="/demand-letters" className="dashboard-nav-item">
            <span>▤</span>
            Demand Letters
          </Link>

          <Link to="/documents" className="dashboard-nav-item">
            <span>▧</span>
            Documents
          </Link>

          <Link to="/reports" className="dashboard-nav-item">
            <span>◫</span>
            Reports
          </Link>

          <Link to="/settings" className="dashboard-nav-item">
            <span>⚙</span>
            Settings
          </Link>
        </nav>

        <div className="dashboard-sidebar-bottom">
          <button className="dashboard-logout">
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Top bar */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-breadcrumb">Workspace</p>
            <h1>Dashboard</h1>
          </div>

          <div className="dashboard-header-right">
            <button className="notification-button" aria-label="Notifications">
              ♢
              <span className="notification-dot"></span>
            </button>

            <div className="dashboard-user">
              <div className="dashboard-avatar">K</div>

              <div>
                <strong>Admin User</strong>
                <span>Administrator</span>
              </div>
            </div>
          </div>
        </header>

        {/* Welcome section */}
        <section className="dashboard-welcome">
          <div>
            <p className="dashboard-eyebrow">RECRUITMENT MANAGEMENT</p>
            <h2>Welcome back.</h2>
            <p>
              Here's what's happening with your recruitment operations today.
            </p>
          </div>

          <Link to="/candidates" className="dashboard-primary-button">
            + Add Candidate
          </Link>
        </section>

        {/* Statistics */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-top">
              <span>Total Candidates</span>
              <div className="stat-icon">◉</div>
            </div>

            <strong>248</strong>

            <p className="stat-positive">
              ↑ 12.5% <span>from last month</span>
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Active Employers</span>
              <div className="stat-icon">▣</div>
            </div>

            <strong>36</strong>

            <p className="stat-positive">
              ↑ 8.2% <span>from last month</span>
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Pending Applications</span>
              <div className="stat-icon">◷</div>
            </div>

            <strong>42</strong>

            <p className="stat-warning">
              7 <span>need attention</span>
            </p>
          </div>

          <div className="stat-card">
            <div className="stat-card-top">
              <span>Successful Placements</span>
              <div className="stat-icon">✓</div>
            </div>

            <strong>124</strong>

            <p className="stat-positive">
              ↑ 18.4% <span>from last month</span>
            </p>
          </div>
        </section>

        {/* Main dashboard grid */}
        <section className="dashboard-content-grid">
          {/* Recruitment activity */}
          <div className="dashboard-panel activity-panel">
            <div className="panel-header">
              <div>
                <h3>Recruitment Activity</h3>
                <p>Candidate applications over the last 6 months</p>
              </div>

              <select defaultValue="6months">
                <option value="6months">Last 6 months</option>
                <option value="30days">Last 30 days</option>
                <option value="12months">Last 12 months</option>
              </select>
            </div>

            <div className="chart-container">
              <div className="chart-y-axis">
                <span>80</span>
                <span>60</span>
                <span>40</span>
                <span>20</span>
                <span>0</span>
              </div>

              <div className="chart-area">
                <div className="chart-grid-line"></div>
                <div className="chart-grid-line"></div>
                <div className="chart-grid-line"></div>
                <div className="chart-grid-line"></div>
                <div className="chart-grid-line"></div>

                <div className="chart-bars">
                  <div className="chart-column">
                    <div className="chart-bar" style={{ height: "48%" }}></div>
                    <span>Mar</span>
                  </div>

                  <div className="chart-column">
                    <div className="chart-bar" style={{ height: "62%" }}></div>
                    <span>Apr</span>
                  </div>

                  <div className="chart-column">
                    <div className="chart-bar" style={{ height: "54%" }}></div>
                    <span>May</span>
                  </div>

                  <div className="chart-column">
                    <div className="chart-bar" style={{ height: "78%" }}></div>
                    <span>Jun</span>
                  </div>

                  <div className="chart-column">
                    <div className="chart-bar" style={{ height: "68%" }}></div>
                    <span>Jul</span>
                  </div>

                  <div className="chart-column">
                    <div className="chart-bar active-bar" style={{ height: "88%" }}></div>
                    <span>Aug</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Application status */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Application Status</h3>
                <p>Current candidate pipeline</p>
              </div>
            </div>

            <div className="status-list">
              <div className="status-row">
                <div className="status-label">
                  <span className="status-dot blue"></span>
                  New
                </div>

                <strong>64</strong>
              </div>

              <div className="status-row">
                <div className="status-label">
                  <span className="status-dot yellow"></span>
                  Under Review
                </div>

                <strong>42</strong>
              </div>

              <div className="status-row">
                <div className="status-label">
                  <span className="status-dot purple"></span>
                  Interview
                </div>

                <strong>28</strong>
              </div>

              <div className="status-row">
                <div className="status-label">
                  <span className="status-dot green"></span>
                  Selected
                </div>

                <strong>18</strong>
              </div>

              <div className="status-row">
                <div className="status-label">
                  <span className="status-dot red"></span>
                  Rejected
                </div>

                <strong>11</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom section */}
        <section className="dashboard-bottom-grid">
          {/* Recent candidates */}
          <div className="dashboard-panel recent-panel">
            <div className="panel-header">
              <div>
                <h3>Recent Candidates</h3>
                <p>Latest candidates added to the system</p>
              </div>

              <Link to="/candidates">View all</Link>
            </div>

            <div className="candidate-table-wrapper">
              <table className="candidate-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Position</th>
                    <th>Status</th>
                    <th>Added</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      <div className="candidate-name">
                        <div className="small-avatar">RS</div>
                        <div>
                          <strong>Ram Sharma</strong>
                          <span>ram@example.com</span>
                        </div>
                      </div>
                    </td>

                    <td>Construction Worker</td>

                    <td>
                      <span className="status-badge review">
                        Under Review
                      </span>
                    </td>

                    <td>Today</td>
                  </tr>

                  <tr>
                    <td>
                      <div className="candidate-name">
                        <div className="small-avatar">BP</div>
                        <div>
                          <strong>Bikash Poudel</strong>
                          <span>bikash@example.com</span>
                        </div>
                      </div>
                    </td>

                    <td>Electrician</td>

                    <td>
                      <span className="status-badge selected">
                        Selected
                      </span>
                    </td>

                    <td>Yesterday</td>
                  </tr>

                  <tr>
                    <td>
                      <div className="candidate-name">
                        <div className="small-avatar">SK</div>
                        <div>
                          <strong>Sita Karki</strong>
                          <span>sita@example.com</span>
                        </div>
                      </div>
                    </td>

                    <td>Caregiver</td>

                    <td>
                      <span className="status-badge interview">
                        Interview
                      </span>
                    </td>

                    <td>2 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick actions */}
          <div className="dashboard-panel quick-actions-panel">
            <div className="panel-header">
              <div>
                <h3>Quick Actions</h3>
                <p>Common recruitment tasks</p>
              </div>
            </div>

            <div className="quick-actions">
              <Link to="/candidates" className="quick-action">
                <div className="quick-action-icon">+</div>
                <div>
                  <strong>Add Candidate</strong>
                  <span>Create a new candidate profile</span>
                </div>
              </Link>

              <Link to="/employers" className="quick-action">
                <div className="quick-action-icon">+</div>
                <div>
                  <strong>Add Employer</strong>
                  <span>Register a new employer</span>
                </div>
              </Link>

              <Link to="/demand-letters" className="quick-action">
                <div className="quick-action-icon">+</div>
                <div>
                  <strong>Create Demand Letter</strong>
                  <span>Start a new recruitment demand</span>
                </div>
              </Link>

              <Link to="/documents" className="quick-action">
                <div className="quick-action-icon">↑</div>
                <div>
                  <strong>Upload Document</strong>
                  <span>Upload candidate documents</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;