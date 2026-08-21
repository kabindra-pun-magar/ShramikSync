import { BrowserRouter, Routes, Route } from "react-router-dom";
import Candidates from "./pages/Candidates";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

import "./styles/variables.css";
import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />


        {/* Protected routes */}
        {/* Protected routes */}
        <Route element={<PrivateRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/candidates"
          element={<Candidates />}
        />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;