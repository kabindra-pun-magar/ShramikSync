import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      {/* =========================
          NAVBAR
      ========================== */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">S</div>
          <span>ShramikSync</span>
        </div>

        <div className="navbar-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="navbar-actions">
          <button type="button" className="btn btn-secondary">
            Login
          </button>

          <button type="button" className="btn btn-primary">
            Get Started
          </button>
        </div>
      </nav>

      {/* =========================
          MAIN
      ========================== */}
      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="hero-label">
              RECRUITMENT MANAGEMENT PLATFORM
            </span>

            <h1>
              Smarter Recruitment.
              <br />
              <span>Simpler Management.</span>
            </h1>

            <p>
              Manage candidates, employers, demand letters, documents,
              and recruitment workflows from one centralized platform.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary btn-large"
              >
                Get Started
              </button>

              <a
                href="#features"
                className="btn btn-outline btn-large"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* =========================
              DASHBOARD PREVIEW
          ========================== */}
          <div className="dashboard-preview">
            <div className="preview-header">
              <div className="preview-brand">
                <div className="preview-logo">S</div>
                <strong>ShramikSync</strong>
              </div>

              <div className="preview-user">
                <span></span>
                Admin
              </div>
            </div>

            <div className="preview-body">
              <aside className="preview-sidebar">
                <div className="sidebar-item active">
                  Dashboard
                </div>

                <div className="sidebar-item">
                  Candidates
                </div>

                <div className="sidebar-item">
                  Employers
                </div>

                <div className="sidebar-item">
                  Demand Letters
                </div>

                <div className="sidebar-item">
                  Documents
                </div>

                <div className="sidebar-item">
                  Reports
                </div>
              </aside>

              <div className="preview-main">
                <h3>Dashboard</h3>

                <div className="stat-grid">
                  <div className="stat-card">
                    <span>Candidates</span>
                    <strong>248</strong>
                    <small>+12% this month</small>
                  </div>

                  <div className="stat-card">
                    <span>Employers</span>
                    <strong>32</strong>
                    <small>+5 new</small>
                  </div>

                  <div className="stat-card">
                    <span>Applications</span>
                    <strong>156</strong>
                    <small>24 pending</small>
                  </div>
                </div>

                <div className="preview-chart">
                  <div className="chart-heading">
                    <strong>Recruitment Pipeline</strong>
                    <span>Monthly</span>
                  </div>

                  <div className="chart-bars">
                    <div style={{ height: "55%" }}></div>
                    <div style={{ height: "75%" }}></div>
                    <div style={{ height: "45%" }}></div>
                    <div style={{ height: "85%" }}></div>
                    <div style={{ height: "65%" }}></div>
                    <div style={{ height: "92%" }}></div>
                    <div style={{ height: "72%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURES
        ========================== */}
        <section className="section" id="features">
          <div className="section-heading">
            <span>CORE FEATURES</span>

            <h2>Everything your recruitment agency needs</h2>

            <p>
              A centralized platform designed to simplify and organize
              your recruitment operations.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon">01</div>

              <h3>Candidate Management</h3>

              <p>
                Manage candidate profiles, skills, education, experience,
                and recruitment information in one place.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">02</div>

              <h3>Employer Management</h3>

              <p>
                Organize employer information and manage recruitment
                requirements efficiently.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">03</div>

              <h3>Demand Letters</h3>

              <p>
                Keep employer demand information organized and connected
                to the recruitment process.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">04</div>

              <h3>Document Management</h3>

              <p>
                Centralize candidate documents and keep track of important
                document information.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">05</div>

              <h3>Recruitment Workflow</h3>

              <p>
                Track candidates throughout the recruitment pipeline and
                understand their current status.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">06</div>

              <h3>Reports &amp; Analytics</h3>

              <p>
                Turn recruitment data into useful insights for better
                operational decisions.
              </p>
            </article>
          </div>
        </section>

        {/* =========================
            HOW IT WORKS
        ========================== */}
        <section
          className="workflow-section"
          id="how-it-works"
        >
          <div className="workflow-container">
            <div className="section-heading">
              <span>HOW IT WORKS</span>

              <h2>One connected recruitment workflow</h2>

              <p>
                Keep every stage of your recruitment operation connected.
              </p>
            </div>

            <div className="workflow">
              <div className="workflow-step">
                <div className="step-number">01</div>

                <h3>Employer</h3>

                <p>
                  Manage employer information and recruitment requirements.
                </p>
              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step">
                <div className="step-number">02</div>

                <h3>Demand Letter</h3>

                <p>
                  Organize recruitment demand and job requirements.
                </p>
              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step">
                <div className="step-number">03</div>

                <h3>Candidates</h3>

                <p>
                  Manage candidates and their recruitment information.
                </p>
              </div>

              <div className="workflow-line"></div>

              <div className="workflow-step">
                <div className="step-number">04</div>

                <h3>Recruitment</h3>

                <p>
                  Track candidates through the recruitment pipeline.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CTA
        ========================== */}
        <section className="cta-section" id="about">
          <div className="cta-content">
            <span>READY TO GET STARTED?</span>

            <h2>Bring your recruitment operation together.</h2>

            <p>
              Manage your recruitment workflow with a centralized system
              built for modern manpower agencies.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-white btn-large"
          >
            Get Started
          </button>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="brand-icon">S</div>
            <strong>ShramikSync</strong>
          </div>

          <p>
            Modern recruitment management for manpower agencies.
          </p>

          <span>
            © 2026 ShramikSync. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Home;