import { useState, useEffect } from "react";
import axios from "axios";
import EmployeeTable from "../components/EmployeeTable";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    role: "",
    department: "",
    status: "Active",
    email: "",
    password: "123",
  });
  const [isManualId, setIsManualId] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/employees`
);      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNextEmployeeId = () => {
    if (employees.length === 0) return "GPK-25-003";
    const lastId = employees[employees.length - 1]?.id;
    if (lastId) {
      const parts = lastId.split("-");
      const lastNumber = parseInt(parts[parts.length - 1]);
      const nextNumber = (lastNumber + 1).toString().padStart(3, "0");
      const prefix = parts.slice(0, -1).join("-");
      return `${prefix}-${nextNumber}`;
    }
    return "GPK-25-017";
  };

  const handleGenerateAutoId = () => {
    const autoId = getNextEmployeeId();
    setNewEmployee({ ...newEmployee, id: autoId });
    setIsManualId(false);
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newEmployee.id || !newEmployee.name || !newEmployee.role || !newEmployee.department) {
      alert("Please fill in all fields (ID, Name, Role, Department)");
      return;
    }

    try {
const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/employees`,
  newEmployee
);      setEmployees(prev => [...prev, res.data]);
      setNewEmployee({ id: "", name: "", role: "", department: "", status: "Active", email: "", password: "123" });
      setIsManualId(false);
      setShowAddModal(false);
      alert(`Employee ${newEmployee.name} added successfully with ID: ${newEmployee.id}!`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add employee");
    }
  };

  const handleStatusChange = async (mongoId, employeeId, newStatus) => {
    try {
const res = await axios.put(
  `${import.meta.env.VITE_API_URL}/employees/${mongoId}`,
  { status: newStatus }
);      setEmployees(prev => prev.map(emp =>
        emp._id === mongoId || emp.id === employeeId
          ? { ...emp, status: res.data.status }
          : emp
      ));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
      fetchEmployees();
    }
  };

  const handleDeleteEmployee = async (mongoId, employeeName, employeeId) => {
    if (!window.confirm(`Are you sure you want to delete ${employeeName} (${employeeId})?`)) return;
    try {
await axios.delete(
  `${import.meta.env.VITE_API_URL}/employees/${mongoId}`
);      setEmployees(prev => prev.filter(emp => emp.id !== employeeId || emp._id !== mongoId));
      alert(`Employee ${employeeName} deleted successfully!`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete employee");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowAddModal(false);
    setIsManualId(false);
    setNewEmployee({ id: "", name: "", role: "", department: "", status: "Active", email: "", password: "123" });
  };

  const handleModalClose = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddModal(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-6 animate-fade-in">
        <div className="text-center py-12 text-gray-500">Loading employees...</div>
      </div>
    );
  }

  return (
    <div className="mt-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Employees</h1>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowAddModal(true);
          }}
          type="button"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Employee
        </button>
      </div>

      <EmployeeTable employees={employees} onDelete={handleDeleteEmployee} onStatusChange={handleStatusChange} />

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto mx-4">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
              <button
                onClick={handleCancel}
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddEmployee}>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Employee ID *</label>
                    <button
                      type="button"
                      onClick={handleGenerateAutoId}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Generate Auto ID
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newEmployee.id}
                    onChange={(e) => {
                      setNewEmployee({ ...newEmployee, id: e.target.value });
                      setIsManualId(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-mono"
                    placeholder="e.g., GPK-25-017"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {!isManualId && !newEmployee.id && "Click 'Generate Auto ID' for automatic ID"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="Enter employee name"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <input
                    type="text"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="Enter job role"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Development">Development</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Engineering">Engineering</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Design">Design</option>
                    <option value="Operations">Operations</option>
                    <option value="Quality Assurance">Quality Assurance</option>
                    <option value="Product">Product</option>
                    <option value="Security">Security</option>
                    <option value="Documentation">Documentation</option>
                    <option value="HR">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="employee@test.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave blank for auto-generated email</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="text"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="Default: 123"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave as-is for default password (123)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Working">Working</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  Add Employee
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;