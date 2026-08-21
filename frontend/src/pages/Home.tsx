import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================== */}

      <nav className="home-navbar">
        <Link to="/" className="home-brand">
          <div className="home-brand-icon">S</div>
          <span>ShramikSync</span>
        </Link>

        <div className="home-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
        </div>

        <div className="home-nav-actions">
          <Link
            to="/login"
            className="btn btn-outline home-login-button"
          >
            Login
          </Link>

          <Link
            to="/login"
            className="btn btn-primary"
          >
            Get Started
          </Link>
        </div>
      </nav>


      {/* =========================
          HERO
      ========================== */}

      <main>

        <section className="home-hero" id="home">

          <div className="home-hero-content">

            <span className="home-eyebrow">
              RECRUITMENT MANAGEMENT PLATFORM
            </span>

            <h1>
              Smarter Recruitment.
              <br />
              <span>Simpler Management.</span>
            </h1>

            <p>
              Manage candidates, employers, demand letters,
              documents, and recruitment workflows from one
              centralized platform.
            </p>

            <div className="home-hero-actions">

              <Link
                to="/login"
                className="btn btn-primary"
              >
                Get Started
              </Link>

              <a
                href="#features"
                className="btn btn-outline"
              >
                Explore Features
              </a>

            </div>

          </div>


          {/* Dashboard preview */}

          <div className="home-dashboard-preview">

            <div className="home-preview-header">

              <div className="home-preview-brand">
                <div className="home-brand-icon">
                  S
                </div>

                <strong>ShramikSync</strong>
              </div>

              <span className="status-badge status-active">
                Active
              </span>

            </div>


            <div className="home-preview-content">

              <div className="home-preview-sidebar">

                <div className="home-sidebar-item active">
                  Dashboard
                </div>

                <div className="home-sidebar-item">
                  Candidates
                </div>

                <div className="home-sidebar-item">
                  Employers
                </div>

                <div className="home-sidebar-item">
                  Demand Letters
                </div>

                <div className="home-sidebar-item">
                  Documents
                </div>

              </div>


              <div className="home-preview-main">

                <h3>Dashboard</h3>

                <div className="home-stat-grid">

                  <div className="card home-stat-card">
                    <span>Candidates</span>
                    <strong>248</strong>
                    <small>+12% this month</small>
                  </div>

                  <div className="card home-stat-card">
                    <span>Employers</span>
                    <strong>32</strong>
                    <small>+5 new</small>
                  </div>

                  <div className="card home-stat-card">
                    <span>Applications</span>
                    <strong>156</strong>
                    <small>24 pending</small>
                  </div>

                </div>


                <div className="card home-chart-card">

                  <div className="home-chart-header">
                    <strong>Recruitment Pipeline</strong>
                    <span>Monthly</span>
                  </div>

                  <div className="home-chart">

                    <div style={{ height: "55%" }} />
                    <div style={{ height: "75%" }} />
                    <div style={{ height: "45%" }} />
                    <div style={{ height: "85%" }} />
                    <div style={{ height: "65%" }} />
                    <div style={{ height: "92%" }} />
                    <div style={{ height: "72%" }} />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================== */}

        <section
          className="home-section"
          id="features"
        >

          <div className="home-section-heading">

            <span>CORE FEATURES</span>

            <h2>
              Everything your recruitment agency needs
            </h2>

            <p>
              A centralized platform designed to simplify
              and organize your recruitment operations.
            </p>

          </div>


          <div className="home-features-grid">

            {[
              {
                number: "01",
                title: "Candidate Management",
                text:
                  "Manage candidate profiles, skills, education, experience, and recruitment information in one place.",
              },
              {
                number: "02",
                title: "Employer Management",
                text:
                  "Organize employer information and manage recruitment requirements efficiently.",
              },
              {
                number: "03",
                title: "Demand Letters",
                text:
                  "Keep employer demand information organized and connected to the recruitment process.",
              },
              {
                number: "04",
                title: "Document Management",
                text:
                  "Centralize candidate documents and keep track of important document information.",
              },
              {
                number: "05",
                title: "Recruitment Workflow",
                text:
                  "Track candidates throughout the recruitment pipeline and understand their current status.",
              },
              {
                number: "06",
                title: "Reports & Analytics",
                text:
                  "Turn recruitment data into useful insights for better operational decisions.",
              },
            ].map((feature) => (
              <article
                className="card home-feature-card"
                key={feature.number}
              >
                <div className="home-feature-number">
                  {feature.number}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </article>
            ))}

          </div>

        </section>


        {/* =========================
            HOW IT WORKS
        ========================== */}

        <section
          className="home-workflow-section"
          id="how-it-works"
        >

          <div className="home-section-heading">

            <span>HOW IT WORKS</span>

            <h2>
              One connected recruitment workflow
            </h2>

            <p>
              Keep every stage of your recruitment operation
              connected.
            </p>

          </div>


          <div className="home-workflow">

            {[
              ["01", "Employer", "Manage employer information and recruitment requirements."],
              ["02", "Demand Letter", "Organize recruitment demand and job requirements."],
              ["03", "Candidates", "Manage candidates and their recruitment information."],
              ["04", "Recruitment", "Track candidates through the recruitment pipeline."],
            ].map(([number, title, text], index) => (
              <div
                className="home-workflow-step"
                key={number}
              >

                <div className="home-step-number">
                  {number}
                </div>

                <h3>{title}</h3>

                <p>{text}</p>

                {index < 3 && (
                  <div className="home-workflow-line" />
                )}

              </div>
            ))}

          </div>

        </section>


        {/* =========================
            CTA
        ========================== */}

        <section
          className="home-cta"
          id="about"
        >

          <div>

            <span>READY TO GET STARTED?</span>

            <h2>
              Bring your recruitment operation together.
            </h2>

            <p>
              Manage your recruitment workflow with a
              centralized system built for modern manpower
              agencies.
            </p>

          </div>

          <Link
            to="/login"
            className="btn btn-primary"
          >
            Get Started
          </Link>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================== */}

      <footer className="home-footer">

        <div className="home-footer-brand">

          <div className="home-brand-icon">
            S
          </div>

          <strong>ShramikSync</strong>

        </div>

        <p>
          Modern recruitment management for manpower agencies.
        </p>

        <span>
          © 2026 ShramikSync. All rights reserved.
        </span>

      </footer>

    </div>
  );
}

export default Home;