import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PAGES
import Login from "./pages/Login"; 
import Home from "./pages/Home";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Employees from "./pages/Employees";

// COMPONENTS
import AdminStats from "./components/AdminStats";
import AdminTaskManager from "./components/AdminTaskManager";

// ========== PROTECTED ROUTE COMPONENT ==========
function ProtectedRoute({ children, requiredAdmin = false }) {
  const employeeId = localStorage.getItem("employeeId");
  const rawIsAdmin = localStorage.getItem("isAdmin");
  const isAdminCheck = rawIsAdmin === "true";

  if (!employeeId) {
    return <Navigate to="/login" replace />;
  }

  if (requiredAdmin && !isAdminCheck) {
    return <Navigate to="/login" replace />;
  }

  if (!requiredAdmin && isAdminCheck) {
    return <Navigate to="/admin" replace />;
  }

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