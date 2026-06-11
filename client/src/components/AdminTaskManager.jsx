import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Send, Users, Calendar, FileText, FolderKanban, Briefcase, User, Mail, Search, X, ChevronDown, Plus } from "lucide-react";

function AdminTaskManager() {
  // Employee data
  const [employees, setEmployees] = useState([]);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [individualTasks, setIndividualTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("group");
  const [searchTerm, setSearchTerm] = useState("");
  const [individualSearchTerm, setIndividualSearchTerm] = useState("");
  
  // Dropdown states
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isIndividualDropdownOpen, setIsIndividualDropdownOpen] = useState(false);
  
  const groupDropdownRef = useRef(null);
  const individualDropdownRef = useRef(null);
  
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignTo: "",
    projectId: "",
    deadline: ""
  });

  const [individualTaskForm, setIndividualTaskForm] = useState({
    title: "",
    description: "",
    assignTo: "",
    deadline: ""
  });

  // Create Project Modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    deadline: "",
    team: []
  });
  const [allEmployees, setAllEmployees] = useState([]);

  // Fetch employees when modal opens
  useEffect(() => {
    if (isProjectModalOpen) {
axios.get(`${import.meta.env.VITE_API_URL}/employees`)
        .then(res => setAllEmployees(res.data))
        .catch(err => console.error("Error fetching employees", err));
    }
  }, [isProjectModalOpen]);

  const handleProjectCheckboxChange = (employeeId) => {
    setProjectForm(prev => {
      const isSelected = prev.team.includes(employeeId);
      if (isSelected) {
        return { ...prev, team: prev.team.filter(id => id !== employeeId) };
      } else {
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
      setIsProjectModalOpen(false);
      setProjectForm({ title: "", description: "", deadline: "", team: [] });
      fetchProjects();
    } catch (error) {
      console.error("Failed to create project", error);
      alert("❌ Failed to create project. Check console for details.");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (groupDropdownRef.current && !groupDropdownRef.current.contains(event.target)) {
        setIsGroupDropdownOpen(false);
      }
      if (individualDropdownRef.current && !individualDropdownRef.current.contains(event.target)) {
        setIsIndividualDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch projects when page loads
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch tasks for selected project
  useEffect(() => {
    if (selectedProject) {
      fetchProjectTasks(selectedProject._id);
    }
  }, [selectedProject]);

  // Fetch individual tasks
  useEffect(() => {
    fetchIndividualTasks();
  }, []);

  // Fetch employees from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/employees`
);      setEmployees(res.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchProjects = async () => {
    try {
const projectsRes = await axios.get(
  `${import.meta.env.VITE_API_URL}/all-projects`
);      setProjects(projectsRes.data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    }
  };

  const fetchProjectTasks = async (projectId) => {
    try {
const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/tasks`
);      const projectSpecificTasks = response.data.filter(task => task.projectId === projectId);
      setProjectTasks(projectSpecificTasks);
    } catch (error) {
      console.error("Error fetching project tasks:", error);
    }
  };

  const fetchIndividualTasks = async () => {
    try {
const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/tasks`
);      const individualTasksList = response.data.filter(task => !task.projectId || task.projectId === "");
      setIndividualTasks(individualTasksList);
    } catch (error) {
      console.error("Error fetching individual tasks:", error);
    }
  };

  const handleChange = (e) => {
    setTaskForm({ ...taskForm, [e.target.name]: e.target.value });
  };

  const handleIndividualTaskChange = (e) => {
    setIndividualTaskForm({ ...individualTaskForm, [e.target.name]: e.target.value });
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setTaskForm({
      title: "",
      description: "",
      assignTo: "",
      projectId: project._id,
      deadline: ""
    });
  };

  // Get employee name and role by ID
  const getEmployeeDisplay = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.name} (${employee.role})` : employeeId;
  };

  const getSelectedEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.name} (${employee.role})` : "Select Employee";
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredIndividualEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
    emp.department?.toLowerCase().includes(individualSearchTerm.toLowerCase())
  );

  // Assign Group Project Task
  const handleAssignTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title || !taskForm.assignTo) {
      alert("Please provide a title and assign it to an employee.");
      return;
    }

    try {
    await axios.post(
  `${import.meta.env.VITE_API_URL}/assign-task`,
  {
    ...taskForm,
    projectId: taskForm.projectId
  }
);
      
      const assignedEmployee = employees.find(e => e.id === taskForm.assignTo);
      alert(`✅ Task "${taskForm.title}" assigned successfully to ${assignedEmployee?.name}!`);
      
      if (taskForm.projectId) {
        fetchProjectTasks(taskForm.projectId);
      }

      setTaskForm({
        ...taskForm,
        title: "",
        description: "",
        assignTo: "",
        deadline: ""
      });
      setSearchTerm("");
      setIsGroupDropdownOpen(false);
    } catch (error) {
      console.error("Failed to assign task", error);
      alert("❌ Failed to assign task");
    }
  };

  // Assign Individual Task
  const handleAssignIndividualTask = async (e) => {
    e.preventDefault();

    if (!individualTaskForm.title || !individualTaskForm.assignTo) {
      alert("Please provide a title and assign it to an employee.");
      return;
    }

    try {
     await axios.post(
  `${import.meta.env.VITE_API_URL}/assign-task`,
  {
    title: individualTaskForm.title,
    description: individualTaskForm.description,
    assignTo: individualTaskForm.assignTo,
    deadline: individualTaskForm.deadline,
    projectId: null
  }
);
      const assignedEmployee = employees.find(e => e.id === individualTaskForm.assignTo);
      alert(`✅ Individual task "${individualTaskForm.title}" assigned successfully to ${assignedEmployee?.name}!`);
      
      fetchIndividualTasks();

      setIndividualTaskForm({
        title: "",
        description: "",
        assignTo: "",
        deadline: ""
      });
      setIndividualSearchTerm("");
      setIsIndividualDropdownOpen(false);
    } catch (error) {
      console.error("Failed to assign individual task", error);
      alert("❌ Failed to assign individual task");
    }
  };

  // Delete individual task
  const handleDeleteIndividualTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
await axios.delete(
  `${import.meta.env.VITE_API_URL}/delete-task/${taskId}`
);      fetchIndividualTasks();
      alert("✅ Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("❌ Failed to delete task");
    }
  };

  // Delete project task
  const handleDeleteProjectTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
await axios.delete(
  `${import.meta.env.VITE_API_URL}/delete-task/${taskId}`
);      if (selectedProject) {
        fetchProjectTasks(selectedProject._id);
      }
      alert("✅ Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("❌ Failed to delete task");
    }
  };

  // Clear selected employee
  const clearGroupEmployee = () => {
    setTaskForm({ ...taskForm, assignTo: "" });
    setSearchTerm("");
  };

  const clearIndividualEmployee = () => {
    setIndividualTaskForm({ ...individualTaskForm, assignTo: "" });
    setIndividualSearchTerm("");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 md:p-6 rounded-3xl text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 flex items-center gap-2">
              <Briefcase size={28} />
              Task Assignment Portal
            </h2>
            <p className="text-blue-100 text-sm md:text-base">Assign group project tasks or individual tasks to employees</p>
            <p className="text-blue-100 text-xs md:text-sm mt-2">Total Employees: {employees.length}</p>
          </div>
          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 md:px-5 py-2.5 md:py-3 rounded-xl flex items-center gap-2 transition shadow-lg text-sm md:text-base self-start sm:self-auto"
          >
            <Plus size={20} />
            Create Group Project
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 md:gap-4 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab("group")}
          className={`px-3 md:px-6 py-3 font-semibold rounded-t-xl transition-all flex items-center gap-2 text-sm md:text-base whitespace-nowrap ${
            activeTab === "group"
              ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FolderKanban size={18} />
          Group Project Tasks
        </button>
        <button
          onClick={() => setActiveTab("individual")}
          className={`px-3 md:px-6 py-3 font-semibold rounded-t-xl transition-all flex items-center gap-2 text-sm md:text-base whitespace-nowrap ${
            activeTab === "individual"
              ? "bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User size={18} />
          Individual Tasks
        </button>
      </div>

      {/* GROUP PROJECT TASKS SECTION */}
      {activeTab === "group" && (
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Project List */}
          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FolderKanban size={20} className="text-blue-600" />
              Select Project
            </h3>
            
            <button
              onClick={fetchProjects}
              className="w-full mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-xl transition text-sm"
            >
              Refresh Projects
            </button>
            
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderKanban size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No projects created yet.</p>
                <p className="text-xs text-gray-400 mt-1">Click "Create Project" button above to get started</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => handleProjectSelect(project)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      selectedProject?._id === project._id
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="font-medium">{project.title}</div>
                    <div className={`text-xs mt-1 ${selectedProject?._id === project._id ? "text-blue-100" : "text-gray-500"}`}>
                      Team: {project.team?.length || 0} members
                    </div>
                    {project.deadline && (
                      <div className={`text-xs mt-1 ${selectedProject?._id === project._id ? "text-blue-100" : "text-gray-400"}`}>
                        📅 Due: {new Date(project.deadline).toLocaleDateString()}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Task Assignment Form for Projects */}
          <div className="lg:col-span-2">
            {!selectedProject ? (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-md text-center">
                <FolderKanban size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Select a project from the left to start assigning tasks</p>
              </div>
            ) : (
              <div className="bg-white p-4 md:p-8 rounded-3xl shadow-md">
                <div className="mb-6 pb-4 border-b border-gray-200">
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Briefcase size={24} className="text-blue-600" />
                    {selectedProject.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">{selectedProject.description || "No description provided"}</p>
                </div>

                <form onSubmit={handleAssignTask} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                      <FileText size={18} className="text-blue-600" /> Task Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={taskForm.title}
                      onChange={handleChange}
                      placeholder="e.g., Build Login Page API"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={taskForm.description}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Provide specific details about the task..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                        <Users size={18} className="text-blue-600" /> Assign To *
                      </label>
                      
                      {/* Custom Dropdown with Close Arrow */}
                      <div ref={groupDropdownRef} className="relative">
                        <div
                          onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none cursor-pointer flex items-center justify-between"
                        >
                          <span className={taskForm.assignTo ? "text-gray-800" : "text-gray-400"}>
                            {taskForm.assignTo ? getSelectedEmployeeName(taskForm.assignTo) : "Select Employee..."}
                          </span>
                          <div className="flex items-center gap-2">
                            {taskForm.assignTo && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearGroupEmployee();
                                }}
                                className="text-gray-400 hover:text-red-500 transition"
                              >
                                <X size={16} />
                              </button>
                            )}
                            <ChevronDown size={18} className={`text-gray-400 transition-transform ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                        
                        {/* Dropdown opens UPWARD */}
                        {isGroupDropdownOpen && (
                          <div className="absolute z-10 w-full mb-1 bottom-full left-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
                            {/* Search input */}
                            <div className="p-2 border-b border-gray-100">
                              <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search employees..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            
                            {/* Employee list */}
                            <div className="max-h-60 overflow-y-auto">
                              {filteredEmployees.length === 0 ? (
                                <div className="p-4 text-center text-gray-500 text-sm">
                                  No employees found
                                </div>
                              ) : (
                                filteredEmployees.map((emp) => (
                                  <div
                                    key={emp.id}
                                    onClick={() => {
                                      setTaskForm({ ...taskForm, assignTo: emp.id });
                                      setIsGroupDropdownOpen(false);
                                    }}
                                    className={`px-4 py-2 hover:bg-blue-50 cursor-pointer transition ${
                                      taskForm.assignTo === emp.id ? "bg-blue-100" : ""
                                    }`}
                                  >
                                    <div className="font-medium text-gray-800">{emp.name}</div>
                                    <div className="text-xs text-gray-500">{emp.role} - {emp.department}</div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {employees.length} employees available
                      </p>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-600" /> Deadline
                      </label>
                      <input
                        type="date"
                        name="deadline"
                        value={taskForm.deadline}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
                  >
                    <Send size={20} />
                    Assign Group Task
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INDIVIDUAL TASKS SECTION */}
      {activeTab === "individual" && (
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Assign Individual Task Form */}
          <div className="bg-white p-4 md:p-8 rounded-3xl shadow-md">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <User size={24} className="text-green-600" />
                Assign Individual Task
              </h3>
              <p className="text-gray-500 text-sm mt-1">Assign tasks directly to an employee without linking to a project</p>
            </div>

            <form onSubmit={handleAssignIndividualTask} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <FileText size={18} className="text-green-600" /> Task Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={individualTaskForm.title}
                  onChange={handleIndividualTaskChange}
                  placeholder="e.g., Complete Timesheet, Review Documents"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={individualTaskForm.description}
                  onChange={handleIndividualTaskChange}
                  rows="3"
                  placeholder="Provide specific details about the task..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                ></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Users size={18} className="text-green-600" /> Assign To *
                  </label>
                  
                  {/* Custom Dropdown with Close Arrow */}
                  <div ref={individualDropdownRef} className="relative">
                    <div
                      onClick={() => setIsIndividualDropdownOpen(!isIndividualDropdownOpen)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none cursor-pointer flex items-center justify-between"
                    >
                      <span className={individualTaskForm.assignTo ? "text-gray-800" : "text-gray-400"}>
                        {individualTaskForm.assignTo ? getSelectedEmployeeName(individualTaskForm.assignTo) : "Select Employee..."}
                      </span>
                      <div className="flex items-center gap-2">
                        {individualTaskForm.assignTo && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearIndividualEmployee();
                            }}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isIndividualDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    
                    {/* Dropdown opens UPWARD */}
                    {isIndividualDropdownOpen && (
                      <div className="absolute z-10 w-full mb-1 bottom-full left-0 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
                        {/* Search input */}
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search employees..."
                              value={individualSearchTerm}
                              onChange={(e) => setIndividualSearchTerm(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        
                        {/* Employee list */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredIndividualEmployees.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No employees found
                            </div>
                          ) : (
                            filteredIndividualEmployees.map((emp) => (
                              <div
                                key={emp.id}
                                onClick={() => {
                                  setIndividualTaskForm({ ...individualTaskForm, assignTo: emp.id });
                                  setIsIndividualDropdownOpen(false);
                                }}
                                className={`px-4 py-2 hover:bg-green-50 cursor-pointer transition ${
                                  individualTaskForm.assignTo === emp.id ? "bg-green-100" : ""
                                }`}
                              >
                                <div className="font-medium text-gray-800">{emp.name}</div>
                                <div className="text-xs text-gray-500">{emp.role} - {emp.department}</div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {employees.length} employees available
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                    <Calendar size={18} className="text-green-600" /> Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={individualTaskForm.deadline}
                    onChange={handleIndividualTaskChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-md"
              >
                <Send size={20} />
                Assign Individual Task
              </button>
            </form>
          </div>

          {/* Individual Tasks List */}
          <div className="bg-white p-4 md:p-8 rounded-3xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Mail size={20} className="text-green-600" />
              Individual Tasks ({individualTasks.length})
            </h3>
            
            {individualTasks.length === 0 ? (
              <div className="text-center py-10">
                <User size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No individual tasks assigned yet.</p>
                <p className="text-sm text-gray-400">Use the form on the left to assign tasks</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {individualTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-sm transition">
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{task.title}</div>
                      {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                      )}
                      <div className="flex gap-3 mt-2 text-xs">
                        <span className="text-gray-500">
                          Assigned to: <strong>{getEmployeeDisplay(task.assignTo)}</strong>
                        </span>
                        {task.deadline && (
                          <span className="text-orange-500">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {task.completed ? 'Completed' : `Progress: ${task.progress || 0}%`}
                      </span>
                      <button
                        onClick={() => handleDeleteIndividualTask(task._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition"
                        title="Delete task"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Launch New Group Project</h2>
              <button onClick={() => { setIsProjectModalOpen(false); setProjectForm({ title: "", description: "", deadline: "", team: [] }); }} className="text-gray-400 hover:text-red-500">
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
                  {allEmployees.map(emp => (
                    <label key={emp._id} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition">
                      <input 
                        type="checkbox" 
                        checked={projectForm.team.includes(emp.id)}
                        onChange={() => handleProjectCheckboxChange(emp.id)}
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

      {/* Project Tasks List (shown when project is selected) */}
      {activeTab === "group" && selectedProject && projectTasks.length > 0 && (
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Tasks in "{selectedProject.title}" ({projectTasks.length})
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {projectTasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{task.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Assigned to: <span className="font-semibold text-indigo-600">{getEmployeeDisplay(task.assignTo)}</span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-400 mt-1">{task.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.completed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {task.completed ? 'Completed' : `Progress: ${task.progress || 0}%`}
                  </span>
                  {task.deadline && (
                    <span className="text-xs text-orange-500">
                      📅 {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteProjectTask(task._id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition ml-2"
                    title="Delete task"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTaskManager;