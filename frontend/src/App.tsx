import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Employers from "./pages/Employers";
import DemandLetters from "./pages/DemandLetters";
import Documents from "./pages/Documents";

import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ========================================
            PUBLIC ROUTES
        ======================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ========================================
            PROTECTED APPLICATION
        ======================================== */}

        <Route element={<PrivateRoute />}>

          <Route element={<DashboardLayout />}>

            {/* ========================================
                DASHBOARD
            ======================================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />


            {/* ========================================
                CANDIDATES
            ======================================== */}

            <Route
              path="/candidates"
              element={<Candidates />}
            />


            {/* ========================================
                EMPLOYERS
            ======================================== */}

            <Route
              path="/employers"
              element={<Employers />}
            />


            {/* ========================================
                DEMAND LETTERS
            ======================================== */}

            <Route
              path="/demand-letters"
              element={<DemandLetters />}
            />

            <Route
              path="/documents"
              element={<Documents />}
            />


            {/* ========================================
                FUTURE MODULES
            ======================================== */}

            <Route
              path="/reports"
              element={
                <div>
                  Reports coming soon
                </div>
              }
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;