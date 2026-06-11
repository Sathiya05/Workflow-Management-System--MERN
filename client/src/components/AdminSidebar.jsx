import { LayoutDashboard, Users, ClipboardList, Briefcase, Settings, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function AdminSidebar({ mobileOpen, onClose }) {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "hover:bg-gray-100 text-gray-700"
    }`;

  const content = (
    <>
      <div>
        {/* BRANDING */}
        <Link to="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="bg-blue-600 p-3 rounded-2xl text-white">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-600">WorkFlow</h1>
            <p className="text-xs text-gray-500">Task Management System</p>
          </div>
        </Link>

        {/* MENU LINKS */}
        <div className="mt-12 space-y-4">
          <Link to="/admin" className={linkClass("/admin")} onClick={onClose}>
            <LayoutDashboard size={22} />
            Overview
          </Link>
          <Link to="/admin/tasks" className={linkClass("/admin/tasks")} onClick={onClose}>
            <ClipboardList size={22} />
            Task Management
          </Link>
          <Link to="/admin/employees" className={linkClass("/admin/employees")} onClick={onClose}>
            <Users size={22} />
            Employees
          </Link>
        </div>
      </div>

      {/* ADMIN PROFILE */}
      <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Admin</h3>
            <p className="text-sm text-gray-500">System Manager</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="w-[280px] bg-white shadow-xl hidden md:flex flex-col justify-between p-6 sticky top-0 h-screen shrink-0">
        {content}
      </div>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-[280px] bg-white shadow-xl z-50 md:hidden flex flex-col justify-between p-6 overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
            {content}
          </div>
        </>
      )}
    </>
  );
}

export default AdminSidebar;