function EmployeeTable({ employees = [], onDelete = null, onStatusChange = null }) {
  const totalEmployees = employees.length;
  const activeCount = employees.filter(emp => emp.status === "Active").length;
  const workingCount = employees.filter(emp => emp.status === "Working").length;
  const onLeaveCount = employees.filter(emp => emp.status === "On Leave").length;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Employees Directory</h2>
        <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-600">Active: {activeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="text-gray-600">Working: {workingCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-600">On Leave: {onLeaveCount}</span>
          </div>
          <div className="flex items-center gap-2 border-l pl-4">
            <span className="text-gray-600">Total: {totalEmployees}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b-2 text-xs md:text-sm">
              <th className="pb-2 md:pb-4 pr-2 md:pr-4">Employee ID</th>
              <th className="pb-2 md:pb-4 pr-2 md:pr-4">Name</th>
              <th className="pb-2 md:pb-4 pr-2 md:pr-4 hidden sm:table-cell">Role</th>
              <th className="pb-2 md:pb-4 pr-2 md:pr-4 hidden md:table-cell">Department</th>
              <th className="pb-2 md:pb-4 pr-2 md:pr-4">Status</th>
              {onDelete && <th className="pb-2 md:pb-4 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="py-2 md:py-4 pr-2 md:pr-4 font-mono text-xs md:text-sm font-semibold text-indigo-600">
                  {employee.id}
                </td>
                <td className="py-2 md:py-4 pr-2 md:pr-4 font-medium text-gray-800 text-sm md:text-base">{employee.name}</td>
                <td className="py-2 md:py-4 pr-2 md:pr-4 text-gray-600 text-sm hidden sm:table-cell">{employee.role}</td>
                <td className="py-2 md:py-4 pr-2 md:pr-4 hidden md:table-cell">
                  <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-700 rounded-md text-xs md:text-sm">
                    {employee.department}
                  </span>
                </td>
                <td className="py-2 md:py-4 pr-2 md:pr-4">
                  <select
                    value={employee.status}
                    onChange={(e) => onStatusChange?.(employee._id, employee.id, e.target.value)}
                    className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium cursor-pointer outline-none border-none
                      ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : employee.status === "Working"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    <option value="Active" className="bg-white text-gray-800">Active</option>
                    <option value="Working" className="bg-white text-gray-800">Working</option>
                    <option value="On Leave" className="bg-white text-gray-800">On Leave</option>
                  </select>
                </td>
                {onDelete && (
                  <td className="py-4 text-center">
                    <button
                      onClick={() => onDelete(employee._id, employee.name, employee.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                      title="Delete employee"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t text-center text-sm text-gray-400">
        Last updated: {new Date().toLocaleDateString()} | Total Employees: {totalEmployees}
      </div>
    </div>
  );
}

export default EmployeeTable;