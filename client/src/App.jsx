import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// PAGES
import Login from "./pages/Login"; 
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Employees from "./pages/Employees";

// COMPONENTS
import AdminStats from "./components/AdminStats";
import AdminTaskManager from "./components/AdminTaskManager";

const API = import.meta.env.VITE_API_URL;

// ========== PROTECTED ROUTE COMPONENT ==========
function ProtectedRoute({ children, requiredAdmin = false }) {
  const employeeId = localStorage.getItem("employeeId");
  const storedIsAdmin = localStorage.getItem("isAdmin");
  const needsVerification = storedIsAdmin === "true";

  const [isAdminCheck, setIsAdminCheck] = useState(
    needsVerification ? null : false
  );

  useEffect(() => {
    if (!employeeId || !needsVerification) return;

    axios.get(`${API}/employees/${employeeId}`)
      .then(res => {
        const actual = res.data.isAdmin === true || res.data.isAdmin === "true";
        localStorage.setItem("isAdmin", actual ? "true" : "false");
        setIsAdminCheck(actual);
      })
      .catch(() => setIsAdminCheck(true));
  }, [employeeId, needsVerification]);

  if (!employeeId) return <Navigate to="/login" replace />;
  if (isAdminCheck === null) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" /></div>;
  if (requiredAdmin && !isAdminCheck) return <Navigate to="/login" replace />;
  if (!requiredAdmin && isAdminCheck) return <Navigate to="/admin" replace />;
  return children;
}

// ========== APP COMPONENT ==========
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES - No authentication required */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* USER ROUTE - Protected, requires login but not admin */}
        <Route 
          path="/user" 
          element={
            <ProtectedRoute requiredAdmin={false}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* ADMIN ROUTES - Protected, requires login AND admin privileges */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        >
          {/* Default admin page - Overview */}
          <Route index element={
            <div className="mt-10 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Overview</h1>
              <AdminStats />
            </div>
          } />

          {/* Tasks page */}
          <Route path="tasks" element={
            <div className="mt-10 animate-fade-in">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Assignment</h1>
              <AdminTaskManager />
            </div>
          } />

          {/* Employees page */}
          <Route path="employees" element={<Employees />} />
          
          {/* Catch any other admin routes */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* CATCH-ALL: Redirect unknown URLs to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;