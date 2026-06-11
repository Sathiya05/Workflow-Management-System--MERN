import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const intendedRole = params.get("role") || "user";

  useEffect(() => {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("employeeEmail");
    localStorage.removeItem("employeeRole");
    localStorage.removeItem("isAdmin");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Please enter your email");
      setLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    console.log("=== LOGIN ATTEMPT ===");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Intended Role:", intendedRole);

    try {
    const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/login`,
  {
    email: email.trim(),
    password: password.trim()
  }
);

      console.log("=== LOGIN RESPONSE ===");
      console.log("Full response:", response.data);
      console.log("Is Admin:", response.data.isAdmin);
      console.log("User ID:", response.data.id);
      console.log("User Name:", response.data.name);

      if (response.data) {
        // Store user data
        localStorage.setItem("employeeId", response.data.id || response.data._id);
        localStorage.setItem("employeeName", response.data.name);
        localStorage.setItem("employeeEmail", response.data.email);
        localStorage.setItem("employeeRole", response.data.role);
        localStorage.setItem("isAdmin", response.data.isAdmin ? "true" : "false");
        
        console.log("=== STORED VALUES ===");
        console.log("employeeId:", localStorage.getItem("employeeId"));
        console.log("isAdmin in localStorage:", localStorage.getItem("isAdmin"));
        console.log("isAdmin type:", typeof localStorage.getItem("isAdmin"));
        
        // Check if admin and intended role
        if (response.data.isAdmin === true) {
          console.log("✅ Admin detected! Redirecting to /admin");
          navigate("/admin");
        } else if (response.data.isAdmin === false || response.data.isAdmin === undefined) {
          console.log("✅ Regular employee detected! Redirecting to /user");
          if (intendedRole === "admin") {
            setError("You don't have admin access. Please use admin account: admin@workflow.com");
            localStorage.clear();
            setLoading(false);
            return;
          }
          navigate("/user");
        } else {
          console.log("⚠️ Unknown user type, redirecting to user dashboard");
          navigate("/user");
        }
      }
    } catch (err) {
      console.error("=== LOGIN ERROR ===");
      console.error("Error:", err);
      console.error("Response:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("CORS/Network?", !err.response);
      setError(err.response?.data?.message || (err.message === "Network Error" ? "Server unreachable — please try again" : "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 mx-4">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">
            {intendedRole === "admin" ? "🔐 Admin Login" : "👤 Employee Login"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your email"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

      
      </div>
    </div>
  );
}

export default Login;