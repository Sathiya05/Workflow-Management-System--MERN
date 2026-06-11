import { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

function AdminTopbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  // Form State
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: "",
    team: [] // Will hold the IDs of selected employees
  });

  // Fetch employees so we can show them in the checkboxes
  useEffect(() => {
    if (isModalOpen) {
    axios.get(`${import.meta.env.VITE_API_URL}/employees`)
  .then(res => setEmployees(res.data))
  .catch(err => console.error("Error fetching employees", err));
    }
  }, [isModalOpen]);

  const handleCheckboxChange = (employeeId) => {
    setProjectForm(prev => {
      const isSelected = prev.team.includes(employeeId);
      if (isSelected) {
        // Remove them if they were already checked
        return { ...prev, team: prev.team.filter(id => id !== employeeId) };
      } else {
        // Add them if they weren't checked
        return { ...prev, team: [...prev.team, employeeId] };
      }
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title || projectForm.team.length === 0) {
      alert("Please provide a title and select at least one team member.");
      return;
    }

    try {
await axios.post(
  `${import.meta.env.VITE_API_URL}/create-project`,
  projectForm
);      alert("Project created successfully!");
      setIsModalOpen(false); // Close modal
      setProjectForm({ title: "", description: "", deadline: "", team: [] }); // Reset form
    } catch (error) {
      console.error("Failed to create project", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">Manage employees, projects, analytics and performance.</p>
        </div>
       
      </div>

      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg mx-4">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Launch New Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Project Title</label>
                <input 
                  type="text" 
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., Q3 Marketing Campaign"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea 
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Brief overview of the project goals..."
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Deadline</label>
                <input 
                  type="date" 
                  value={projectForm.deadline}
                  onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Assign Team Members ({projectForm.team.length} selected)</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-40 overflow-y-auto space-y-2">
                  {employees.map(emp => (
                    <label key={emp._id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                      <input 
                        type="checkbox" 
                        checked={projectForm.team.includes(emp._id)}
                        onChange={() => handleCheckboxChange(emp._id)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-medium">{emp.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition mt-4">
                Allot Project
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTopbar;