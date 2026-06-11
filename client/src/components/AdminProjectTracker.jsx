import { useEffect, useState } from "react";
import axios from "axios";
import { FolderKanban, Calendar, Users, Edit, Trash2, X, CheckCircle, Clock } from "lucide-react";

function AdminProjectTracker() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allTasks, setAllTasks] = useState([]); 

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState({
    _id: "", title: "", description: "", deadline: "", status: "", team: []
  });

  useEffect(() => {
    fetchProjectsData();
    const timer = setInterval(fetchProjectsData, 5000);
    return () => clearInterval(timer);
  }, []);

  const fetchProjectsData = async () => {
    try {
     const [projectsRes, employeesRes, tasksRes] = await Promise.all([
  axios.get(`${import.meta.env.VITE_API_URL}/all-projects`),
  axios.get(`${import.meta.env.VITE_API_URL}/employees`),
  axios.get(`${import.meta.env.VITE_API_URL}/tasks`)
]);
      setProjects(projectsRes.data);
      setEmployees(employeesRes.data);
      setAllTasks(tasksRes.data);
    } catch (error) {
      console.error("Error fetching project tracking data:", error);
    }
  };

  const getEmployeeName = (id) => {
    const emp = employees.find(e => e.id === id);
    return emp ? emp.name.split(" ")[0] : "Unknown";
  };

  /* === CALCULATE INDIVIDUAL PROGRESS (UPGRADED FOR SLIDERS) === */
  const getUserProgressForProject = (projectId, employeeId) => {
    const userTasks = allTasks.filter(task => task.projectId === projectId && task.assignTo === employeeId);
    
    if (userTasks.length === 0) return null; // They have no specific tasks assigned yet

    // NEW MATH: Add up their slider percentages and find the average!
    const totalUserProgress = userTasks.reduce((sum, task) => sum + (task.progress || 0), 0);
    const progress = Math.round(totalUserProgress / userTasks.length);
    
    return {
      total: userTasks.length,
      percentage: progress
    };
  };

  /* === DELETE PROJECT === */
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    try {
await axios.delete(
  `${import.meta.env.VITE_API_URL}/delete-project/${projectId}`
);      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project.");
    }
  };

  /* === OPEN EDIT MODAL === */
  const openEditModal = (project) => {
    setEditingProject({
      _id: project._id,
      title: project.title,
      description: project.description,
      deadline: project.deadline,
      status: project.status || "Active",
      team: project.team || [] 
    });
    setIsEditModalOpen(true);
  };

  /* === HANDLE EDIT CHECKBOXES === */
  const handleEditCheckboxChange = (employeeId) => {
    setEditingProject(prev => {
      const isSelected = prev.team.includes(employeeId);
      if (isSelected) {
        return { ...prev, team: prev.team.filter(id => id !== employeeId) };
      } else {
        return { ...prev, team: [...prev.team, employeeId] };
      }
    });
  };

  /* === SAVE EDITED PROJECT === */
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
const res = await axios.put(
  `${import.meta.env.VITE_API_URL}/update-project/${editingProject._id}`,
  editingProject
);      setProjects(projects.map(p => (p._id === editingProject._id ? res.data : p)));
      setIsEditModalOpen(false); 
      alert("Project updated successfully!");
    } catch (error) {
      console.error("Failed to update project:", error);
      alert("Failed to update project.");
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-3xl shadow-md mt-6 md:mt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
          <FolderKanban size={24} />
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Active Project Progress</h2>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-5">No projects deployed yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {projects.map((project) => (
            <div key={project._id} className="border border-gray-100 rounded-2xl p-4 md:p-6 bg-gray-50/50 hover:shadow-sm transition group">
              
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{project.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{project.description}</p>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    project.progress === 100 || project.status === "Completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {project.status || "Active"}
                  </span>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditModal(project)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Project">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Project">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* OVERALL PROGRESS */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                  <span>Overall Completion</span>
                  <span className="font-bold text-gray-800">{project.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${project.progress || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* INDIVIDUAL TEAM PROGRESS BREAKDOWN */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Team Breakdown</h4>
                
                {project.team && project.team.length > 0 ? (
                  <div className="space-y-3">
                    {project.team.map(empId => {
                      const userStat = getUserProgressForProject(project._id, empId);
                      
                      return (
                        <div key={empId} className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700 flex items-center gap-2">
                            <Users size={14} className="text-gray-400" />
                            {getEmployeeName(empId)}
                          </span>
                          
                          {/* Show their personal progress, or a "waiting" state if they have no tasks yet */}
                          {userStat ? (
                             <div className="flex items-center gap-3 w-1/2">
                               <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                 <div 
                                   className={`${userStat.percentage === 100 ? 'bg-green-500' : 'bg-orange-400'} h-full rounded-full transition-all`}
                                   style={{ width: `${userStat.percentage}%` }}
                                 ></div>
                               </div>
                               <span className="text-xs font-bold text-gray-600 w-8 text-right">{userStat.percentage}%</span>
                             </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No tasks assigned</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No team members assigned.</p>
                )}
              </div>

              {/* DEADLINE */}
              <div className="mt-5 flex items-center justify-end text-orange-600 font-medium text-sm">
                <Calendar size={16} className="mr-1" />
                <span>Due: {project.deadline}</span>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Project</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateProject} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Project Title</label>
                <input 
                  type="text" 
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea 
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  rows="2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Deadline</label>
                  <input 
                    type="date" 
                    value={editingProject.deadline}
                    onChange={(e) => setEditingProject({...editingProject, deadline: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Status</label>
                  <select 
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Active">Active</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Manage Team ({editingProject.team.length} selected)</label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-32 overflow-y-auto space-y-2">
                  {employees.map(emp => (
                      <label key={emp._id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                        <input 
                          type="checkbox" 
                          checked={editingProject.team.includes(emp.id)}
                          onChange={() => handleEditCheckboxChange(emp.id)}
                        className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-medium">{emp.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition mt-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProjectTracker;