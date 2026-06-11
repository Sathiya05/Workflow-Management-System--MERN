import { useState } from "react";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import AdminStats from "../components/AdminStats";
import EmployeeTable from "../components/EmployeeTable";
import AdminTaskManager from "../components/AdminTaskManager"; // <-- Import the new component

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="h-screen bg-[#f4f7fc] flex overflow-hidden">
      
      {/* SIDEBAR */}
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-10">
        
        {/* Topbar stays visible on all pages */}
        <AdminTopbar />

        {/* --- DASHBOARD VIEW --- */}
        {activeMenu === "dashboard" && (
          <div className="mt-10 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Overview</h1>
            <AdminStats />
            <div className="mt-10">
              <EmployeeTable />
            </div>
          </div>
        )}

        {/* --- TASK MANAGEMENT VIEW --- */}
        {activeMenu === "tasks" && (
          <div className="mt-10 animate-fade-in">
             <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Assignment</h1>
             <AdminTaskManager />
          </div>
        )}

        {/* Add more views here as needed (e.g., activeMenu === 'employees') */}
        {activeMenu === "employees" && (
          <div className="mt-10 animate-fade-in">
             <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Employees</h1>
             <EmployeeTable />
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;