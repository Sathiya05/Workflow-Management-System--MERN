import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, Bell, Trash2, RefreshCw, AlertCircle, User, Calendar } from "lucide-react";

function AdminTaskMonitor() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    fetchData(); 

    // Auto-refresh every 10 seconds instead of 5 to reduce server load
    const intervalId = setInterval(() => {
      fetchData(); 
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
 const [tasksRes, empRes] = await Promise.all([
  axios.get(`${import.meta.env.VITE_API_URL}/tasks`),
  axios.get(`${import.meta.env.VITE_API_URL}/employees`)
]);
      setTasks(tasksRes.data);
      setEmployees(empRes.data);
    } catch (error) {
      console.error("Error fetching admin monitoring data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = (id) => {
    const emp = employees.find((e) => e.id === id);
    return emp ? emp.name : "Unknown Employee";
  };

  const getEmployeeInitials = (name) => {
    if (!name || name === "Unknown Employee") return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  // Delete Function with better error handling
  const handleDelete = async (taskId) => {
    if (!window.confirm("⚠️ Are you sure you want to permanently delete this task? This action cannot be undone!")) return;

    try {
      setDeletingTaskId(taskId);
await axios.delete(
  `${import.meta.env.VITE_API_URL}/delete-task/${taskId}`
);      
      // Update the UI immediately
      setTasks(tasks.filter(task => task._id !== taskId));
      
      // Show success message
      alert(" Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert(` Failed to delete task: ${error.response?.data?.message || error.message}`);
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Format deadline date
  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString();
    } catch {
      return deadline;
    }
  };

  // Check if task is overdue
  const isOverdue = (task) => {
    if (!task.deadline || task.completed) return false;
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadlineDate < today;
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    inProgress: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => isOverdue(t)).length
  };

  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl text-white">
              <Bell size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Task Status</h2>
              <p className="text-blue-100 text-sm">Real-time monitoring of all employee tasks</p>
            </div>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-4 md:p-6 bg-gray-50 border-b">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-xs text-gray-500">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
          <div className="text-xs text-gray-500">In Progress</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-xs text-gray-500">Overdue</div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4 md:p-6">
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {loading && tasks.length === 0 ? (
            <div className="text-center py-10">
              <RefreshCw size={32} className="animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tasks assigned yet.</p>
              <p className="text-sm text-gray-400">Create and assign tasks to get started.</p>
            </div>
          ) : (
            tasks.map((task) => {
              const overdue = isOverdue(task);
              const employeeName = getEmployeeName(task.assignTo);
              
              return (
                <div 
                  key={task._id} 
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl transition-all border ${
                    task.completed ? "bg-green-50 border-green-100" : 
                    overdue ? "bg-red-50 border-red-200" : 
                    "bg-white border-gray-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    {/* Task Title */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className={`font-semibold text-sm md:text-md ${
                        task.completed ? "text-green-800 line-through" : 
                        overdue ? "text-red-800" : "text-gray-800"
                      }`}>
                        {task.title}
                      </h3>
                      {overdue && !task.completed && (
                        <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                          <AlertCircle size={10} /> Overdue
                        </span>
                      )}
                    </div>
                    
                    {/* Task Description */}
                    {task.description && (
                      <p className="text-gray-500 text-xs mb-2 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                    
                    {/* Task Details */}
                    <div className="flex flex-wrap gap-2 md:gap-3 text-xs">
                      <div className="flex items-center gap-1 text-gray-500">
                        <User size={12} />
                        <span className="truncate max-w-[120px] sm:max-w-none">Assigned to: <span className="font-medium text-gray-700">{employeeName}</span></span>
                      </div>
                      {task.deadline && (
                        <div className={`flex items-center gap-1 ${overdue && !task.completed ? 'text-red-500' : 'text-gray-500'}`}>
                          <Calendar size={12} />
                          <span>Due: {formatDeadline(task.deadline)}</span>
                        </div>
                      )}
                      {task.projectId && (
                        <div className="flex items-center gap-1 text-indigo-500">
                          <span className="bg-indigo-50 px-2 py-0.5 rounded">Project Task</span>
                        </div>
                      )}
                      {task.progress > 0 && task.progress < 100 && !task.completed && (
                        <div className="flex items-center gap-1">
                          <div className="w-12 md:w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{task.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 mt-2 sm:mt-0 sm:ml-4 self-end sm:self-auto">
                    {/* Status Badge */}
                    {task.completed ? (
                      <span className="bg-green-100 text-green-700 px-2 md:px-3 py-1 md:py-1.5 rounded-xl flex items-center gap-1 text-xs font-medium">
                        <CheckCircle size={14} /> 
                        <span className="hidden sm:inline">Completed</span>
                      </span>
                    ) : (
                      <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-xl flex items-center gap-1 text-xs font-medium ${
                        overdue ? "bg-red-100 text-red-600" : "bg-orange-50 text-orange-600 border border-orange-100"
                      }`}>
                        <Clock size={14} /> 
                        {overdue ? "Overdue" : <span className="hidden sm:inline">In Progress</span>}
                      </span>
                    )}

                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(task._id)}
                      disabled={deletingTaskId === task._id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none disabled:opacity-50"
                      title="Delete Task"
                    >
                      {deletingTaskId === task._id ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminTaskMonitor;