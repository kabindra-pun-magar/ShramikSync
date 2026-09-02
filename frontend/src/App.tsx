import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Employers from "./pages/Employers";
import DemandLetters from "./pages/DemandLetters";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";

import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Reports from "./pages/Reports";


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


            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />



          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;