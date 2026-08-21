import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidates from "./pages/Candidates";
import Employers from "./pages/Employers";

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

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/candidates"
              element={<Candidates />}
            />


            {/* Future modules */}

            <Route
              path="/employers"
              element={<Employers />}
            />

            <Route
              path="/demand-letters"
              element={
                <div>
                  Demand Letters coming soon
                </div>
              }
            />

            <Route
              path="/documents"
              element={
                <div>
                  Documents coming soon
                </div>
              }
            />

            <Route
              path="/reports"
              element={
                <div>
                  Reports coming soon
                </div>
              }
            />

            <Route
              path="/employers"
              element={<Employers />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>

  );
}

export default App;