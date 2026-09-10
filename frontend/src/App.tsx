import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Employers from "./pages/Employers";
import DemandLetters from "./pages/DemandLetters";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Countries from "./pages/Countries";

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

        <Route
          path="/register"
          element={<Register />}
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


            {/* ========================================
                DOCUMENTS
            ======================================== */}

            <Route
              path="/documents"
              element={<Documents />}
            />


            {/* ========================================
                REPORTS
            ======================================== */}

            <Route
              path="/reports"
              element={<Reports />}
            />


            {/* ========================================
                SETTINGS
            ======================================== */}

            <Route
              path="/settings"
              element={<Settings />}
            />


            {/* ========================================
                USERS
            ======================================== */}

            <Route
              path="/users"
              element={<Users />}
            />


            {/* ========================================
                COUNTRIES
            ======================================== */}

            <Route
              path="/countries"
              element={<Countries />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;