import {
  LayoutDashboard,
  CheckCircle,
  FolderKanban,
  CalendarDays,
  Briefcase,
  Bell,
  LogOut,
  X,
  UploadCloud,
  Trash2,
  Menu
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// Components
import StatsCards from "../components/StatsCards";
import TasksSection from "../components/TasksSection";
import ProjectCards from "../components/ProjectCards";
import PerformanceCharts from "../components/PerformanceCharts";
import DeadlineCountdown from "../components/DeadlineCountdown";

function UserDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const employeeId = localStorage.getItem("employeeId");
  const employeeName = localStorage.getItem("employeeName") || "Employee";
  const employeeEmail = localStorage.getItem("employeeEmail") || "";

  const [notifications, setNotifications] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    taskId: "", progress: 0, description: "", projectTitle: ""
  });

  useEffect(() => {
    fetchDashboardData();
  }, [employeeId]);

  const fetchDashboardData = async () => {
    if (!employeeId) return;
    try {
      // Fetch all tasks and filter by employeeId
     const [allTasksRes, projectsRes] = await Promise.all([
  axios.get(`${import.meta.env.VITE_API_URL}/tasks`),
  axios.get(`${import.meta.env.VITE_API_URL}/projects/${employeeId}`)
]);
      
      // Get all tasks
      const allTasksData = Array.isArray(allTasksRes.data) ? allTasksRes.data : [];
      setAllTasks(allTasksData);
      
      // Filter tasks for this employee - IMPORTANT: Match by employeeId
      const employeeTasks = allTasksData.filter(task => {
        // Check if task is assigned to this employee
        // Support both _id and id formats
        const taskAssignTo = task.assignTo;
        return taskAssignTo === employeeId || 
               taskAssignTo === employeeName ||
               (task.assignToName && task.assignToName === employeeName);
      });
      
      setNotifications(employeeTasks);
      const pendingTasks = employeeTasks.filter(task => !task.completed);
      setTaskCount(pendingTasks.length);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("employeeEmail");
    navigate("/login");
  };

  const openUpdateModal = (task, projectTitle) => {
    setUpdateData({
      taskId: task._id, 
      progress: task.progress || 0,
      description: task.description || "", 
      projectTitle: projectTitle
    });
    setIsUpdateModalOpen(true);
  };

  const handleSendUpdate = async (e) => {
    e.preventDefault();
    try {
    await axios.put(
  `${import.meta.env.VITE_API_URL}/update-task/${updateData.taskId}`,
  {
    progress: Number(updateData.progress),
    description: updateData.description
  }
);
      alert("Update sent successfully! The Admin will see your progress.");
      setIsUpdateModalOpen(false);
      fetchDashboardData();
    } catch (error) {
      console.error("Failed to update project progress", error);
      alert("Failed to send update.");
    }
  };

  const handleRemoveHistory = async (taskId) => {
    if (!window.confirm("Remove this task from your view forever?")) return;
    try {
await axios.put(
  `${import.meta.env.VITE_API_URL}/hide-task/${taskId}`
);      fetchDashboardData();
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  };

  return (
    <div className="h-screen bg-[#f4f7fc] flex overflow-hidden">
      
      {/* SIDEBAR - Desktop + Mobile Overlay */}
      <div className={`w-[280px] bg-white shadow-xl flex-col justify-between p-6 shrink-0 ${mobileSidebarOpen ? 'flex fixed inset-0 z-50 overflow-y-auto' : 'hidden md:flex sticky top-0 h-screen'}`}>
        {mobileSidebarOpen && (
          <button onClick={() => setMobileSidebarOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 md:hidden">
            <X size={24} />
          </button>
        )}
        <div>
          <div>
            <Link to="/user" className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-2xl text-white">
                <Briefcase size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-600">WorkFlow</h1>
                <p className="text-xs text-gray-500">Task Management System</p>
              </div>
            </Link>
          </div>

          <div className="mt-12 space-y-4">
            <button onClick={() => { setActiveMenu("dashboard"); setMobileSidebarOpen(false); }} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition ${activeMenu === "dashboard" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
              <LayoutDashboard size={22} /> Dashboard
            </button>
            <button onClick={() => { setActiveMenu("projects"); setMobileSidebarOpen(false); }} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition ${activeMenu === "projects" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
              <FolderKanban size={22} /> Projects
            </button>
            <button onClick={() => { setActiveMenu("completed"); setMobileSidebarOpen(false); }} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition ${activeMenu === "completed" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
              <CheckCircle size={22} /> Completed Tasks
            </button>
            <button onClick={() => { setActiveMenu("schedule"); setMobileSidebarOpen(false); }} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition ${activeMenu === "schedule" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
              <CalendarDays size={22} /> Schedule
            </button>
            <button onClick={() => { setActiveMenu("notifications"); setMobileSidebarOpen(false); }} className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition ${activeMenu === "notifications" ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-gray-700"}`}>
              <div className="relative">
                <Bell size={22} />
                {taskCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{taskCount}</span>}
              </div>
              Notifications
            </button>
          </div>
        </div>

        <div>
          <div className="bg-blue-50 p-5 rounded-3xl mb-4">
            <div className="flex items-center gap-4">
              <img src="https://i.pravatar.cc/100" alt="User" className="w-14 h-14 rounded-full" />
              <div>
                <h3 className="font-semibold text-gray-800">{employeeName}</h3>
                <p className="text-sm text-gray-500">Employee</p>
                <p className="text-xs text-gray-400 mt-1">ID: {employeeId}</p>
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-2xl transition font-medium">
            <LogOut size={20} /> Log Out
          </button>
        </div>
      </div>
      
      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-10 pt-0 md:pt-10 overflow-y-auto h-screen pb-24 md:pb-10">
        
        {/* Mobile top bar with hamburger */}
        <div className="sticky top-0 z-30 bg-[#f4f7fc] flex md:hidden items-center justify-between mb-4 pb-2 -mx-4 px-4 pt-4">
          <button onClick={() => setMobileSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Briefcase size={18} />
            </div>
            <span className="font-bold text-blue-600">WorkFlow</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
            <LogOut size={20} />
          </button>
        </div>
        
        {/* DASHBOARD OVERVIEW */}
        {activeMenu === "dashboard" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-500 mt-3">Welcome back {employeeName}!</p>

            <div className="mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-10 text-white">
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">Manage Your Daily Tasks Efficiently</h2>
              <p className="mt-5 text-lg text-blue-100 leading-8 max-w-2xl">
                Track project deadlines, monitor productivity, and complete tasks on time.
              </p>
              <button onClick={() => setActiveMenu("projects")} className="mt-8 bg-white text-blue-600 px-6 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition">
                Explore Projects
              </button>
            </div>

            <div className="mt-8">
              <StatsCards tasks={notifications} />
            </div>

            <div className="mt-10">
              <TasksSection 
                employeeId={employeeId} 
                employeeName={employeeName}
                onTaskUpdate={fetchDashboardData} 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6 mt-10">
              <PerformanceCharts tasks={notifications} />
              <DeadlineCountdown tasks={notifications} />
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeMenu === "projects" && (
          <div className="animate-fade-in relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Current Projects</h1>
                <p className="text-gray-500 mt-2">Manage all your ongoing team projects and update your progress.</p>
              </div>
              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm">
                {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
              </div>
            </div>

            <ProjectCards 
              projects={projects} 
              tasks={notifications} 
              openUpdateModal={openUpdateModal} 
            />

            {/* PROGRESS UPDATE MODAL */}
            {isUpdateModalOpen && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Update Your Progress</h2>
                        <p className="text-blue-100 text-sm mt-1">{updateData.projectTitle}</p>
                      </div>
                      <button 
                        onClick={() => setIsUpdateModalOpen(false)} 
                        className="text-white hover:bg-white/20 rounded-full p-1 transition"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSendUpdate} className="p-6 space-y-6">
                    <div>
                      <label className="block text-gray-700 font-bold mb-3">
                        My Individual Progress
                      </label>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-500">0%</span>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="5"
                          value={updateData.progress} 
                          onChange={(e) => setUpdateData({...updateData, progress: e.target.value})}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <span className="text-sm font-medium text-gray-500">100%</span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-lg font-bold">
                          {updateData.progress}% Complete
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-2">
                        Progress Description <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        value={updateData.description}
                        onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                        rows="4"
                        placeholder="Describe what you've accomplished today..."
                        required
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition flex justify-center items-center gap-2 shadow-md"
                    >
                      <UploadCloud size={20} />
                      Send Update to Admin
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMPLETED TASKS TAB */}
        {activeMenu === "completed" && (
          <div className="animate-fade-in">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Completed Tasks</h1>
            <div className="space-y-5 mt-10">
              {notifications.filter(task => task.completed).length === 0 ? (
                 <div className="bg-white p-6 rounded-3xl shadow-sm text-gray-500 text-center">
                   No completed tasks yet. Keep working hard!
                 </div>
              ) : (
                notifications.filter(task => task.completed).map((task) => (
                  <div key={task._id} className="bg-white p-6 rounded-3xl shadow-sm flex items-center justify-between border border-gray-100 hover:shadow-md transition">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-gray-800">{task.title}</h2>
                        {task.projectId && (
                          <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                            Team Project
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-1">{task.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="text-green-500" size={24} />
                        <span className="text-green-600 font-bold text-sm">Finished</span>
                      </div>
                      <button 
                        onClick={() => handleRemoveHistory(task._id)}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeMenu === "notifications" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Notifications</h1>
                <p className="text-gray-500 mt-3">Track your pending tasks and updates</p>
              </div>
              {taskCount > 0 && (
                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-2xl font-bold">
                  {taskCount} Pending
                </div>
              )}
            </div>

            <div className="space-y-4">
              {!notifications || notifications.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl shadow-sm text-gray-500 text-center">
                  No tasks assigned yet. Check back later!
                </div>
              ) : (
                <>
                  {/* Pending Tasks */}
                  {notifications.filter(task => task && !task.completed).length > 0 && (
                    <div className="bg-white rounded-3xl shadow-sm p-6">
                      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Pending Tasks ({notifications.filter(task => task && !task.completed).length})
                      </h2>
                      {notifications
                        .filter(task => task && !task.completed)
                        .map((task) => (
                          <div key={task._id} className="border-l-4 border-orange-500 pl-4 py-3 mb-4 bg-orange-50 rounded-r-lg">
                            <h3 className="font-bold text-gray-800">{task.title || 'Untitled Task'}</h3>
                            <p className="text-gray-600 text-sm mt-1">{task.description || 'No description'}</p>
                            {task.deadline && (
                              <p className="text-xs text-red-500 mt-2">
                                📅 Due: {new Date(task.deadline).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Completed Tasks Summary */}
                  {notifications.filter(task => task && task.completed).length > 0 && (
                    <div className="bg-white rounded-3xl shadow-sm p-6">
                      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Recently Completed ({notifications.filter(task => task && task.completed).length})
                      </h2>
                      {notifications
                        .filter(task => task && task.completed)
                        .slice(0, 5)
                        .map((task) => (
                          <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-600">{task.title}</h3>
                              <p className="text-gray-400 text-sm">{task.description}</p>
                            </div>
                            <CheckCircle size={20} className="text-green-500" />
                          </div>
                        ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* SCHEDULE TAB */}
        {activeMenu === "schedule" && (
          <div className="animate-fade-in">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Schedule</h1>
            <p className="text-gray-500 mt-3">Your task timeline and upcoming deadlines</p>
            <div className="mt-8 bg-white p-6 rounded-3xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">Upcoming Deadlines</h2>
              {!notifications || notifications.filter(task => !task.completed && task.deadline).length === 0 ? (
                <p className="text-gray-500">No upcoming deadlines</p>
              ) : (
                <div className="space-y-3">
                  {notifications
                    .filter(task => !task.completed && task.deadline)
                    .map(task => (
                      <div key={task._id} className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition">
                        <div>
                          <p className="font-medium text-gray-800">{task.title}</p>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                        <div className="text-red-500 font-bold text-sm">
                          {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 safe-area-bottom">
        <div className="flex items-center justify-around py-2 px-1">
          <button onClick={() => setActiveMenu("dashboard")} className={`flex flex-col items-center px-3 py-1 rounded-xl transition ${activeMenu === "dashboard" ? "text-blue-600" : "text-gray-500"}`}>
            <LayoutDashboard size={20} />
            <span className="text-[10px] mt-0.5">Dashboard</span>
          </button>
          <button onClick={() => setActiveMenu("projects")} className={`flex flex-col items-center px-3 py-1 rounded-xl transition ${activeMenu === "projects" ? "text-blue-600" : "text-gray-500"}`}>
            <FolderKanban size={20} />
            <span className="text-[10px] mt-0.5">Projects</span>
          </button>
          <button onClick={() => setActiveMenu("completed")} className={`flex flex-col items-center px-3 py-1 rounded-xl transition ${activeMenu === "completed" ? "text-blue-600" : "text-gray-500"}`}>
            <CheckCircle size={20} />
            <span className="text-[10px] mt-0.5">Completed</span>
          </button>
          <button onClick={() => setActiveMenu("schedule")} className={`flex flex-col items-center px-3 py-1 rounded-xl transition ${activeMenu === "schedule" ? "text-blue-600" : "text-gray-500"}`}>
            <CalendarDays size={20} />
            <span className="text-[10px] mt-0.5">Schedule</span>
          </button>
          <button onClick={() => setActiveMenu("notifications")} className={`flex flex-col items-center px-3 py-1 rounded-xl transition relative ${activeMenu === "notifications" ? "text-blue-600" : "text-gray-500"}`}>
            <Bell size={20} />
            {taskCount > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{taskCount}</span>}
            <span className="text-[10px] mt-0.5">Alerts</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default UserDashboard;