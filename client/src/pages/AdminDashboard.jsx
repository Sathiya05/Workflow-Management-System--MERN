import { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Menu, LayoutDashboard, ClipboardList, Users, LogOut } from "lucide-react";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import AdminTaskMonitor from "../components/AdminTaskMonitor";
import AdminProjectTracker from "../components/AdminProjectTracker";

function AdminDashboard() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isOverviewPage = location.pathname === "/admin" || location.pathname === "/admin/";

  const handleLogout = () => {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("employeeEmail");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-[#f4f7fc] flex overflow-hidden">
      <AdminSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex-1 overflow-y-auto p-4 md:p-10 pt-0 md:pt-10 pb-24 md:pb-10">
        {/* Mobile top bar */}
        <div className="sticky top-0 z-30 bg-[#f4f7fc] flex md:hidden items-center justify-between mb-4 pb-2 -mx-4 px-4 pt-4">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
          <span className="font-bold text-blue-600 text-lg">Admin Dashboard</span>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut size={20} />
          </button>
        </div>

        <AdminTopbar />

        {/* 1st: OVERVIEW STATS / CHARTS */}
        <Outlet />

        {/* 2nd: LIVE PROJECT & TASK MONITORS */}
        {isOverviewPage && (
          <div className="space-y-6 md:space-y-10 animate-fade-in">
            <AdminProjectTracker /> 
            <AdminTaskMonitor />
          </div>
        )}
        
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-1">
          <Link to="/admin" className={`flex flex-col items-center px-3 py-1 rounded-xl transition ${location.pathname === "/admin" ? "text-blue-600" : "text-gray-500"}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-0.5">Overview</span>
          </Link>
          <Link to="/admin/tasks" className={`flex flex-col items-center px-3 py-1 rounded-xl transition ${location.pathname === "/admin/tasks" ? "text-blue-600" : "text-gray-500"}`}>
            <ClipboardList size={20} />
            <span className="text-[10px] mt-0.5">Tasks</span>
          </Link>
          <Link to="/admin/employees" className={`flex flex-col items-center px-3 py-1 rounded-xl transition ${location.pathname === "/admin/employees" ? "text-blue-600" : "text-gray-500"}`}>
            <Users size={20} />
            <span className="text-[10px] mt-0.5">Employees</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default AdminDashboard;