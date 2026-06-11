import { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, Clock, AlertCircle, Loader, Send } from "lucide-react";

function TasksSection({ employeeId, employeeName, onTaskUpdate }) {
    const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [updateText, setUpdateText] = useState({});
  const [submittingUpdate, setSubmittingUpdate] = useState(null);

  useEffect(() => {
    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId]);

  const fetchTasks = async () => {
    try {
const response = await axios.get(
  `${import.meta.env.VITE_API_URL}/tasks/${employeeId}`
);      const taskData = Array.isArray(response.data) ? response.data : response.data.tasks || [];
      setTasks(taskData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    console.log("Attempting to complete task with ID:", taskId);
    
    try {
      setUpdatingTaskId(taskId);
      
      // Try multiple endpoint patterns
     const endpoints = [
  `${import.meta.env.VITE_API_URL}/complete-task/${taskId}`,
  `${import.meta.env.VITE_API_URL}/tasks/complete/${taskId}`,
  `${import.meta.env.VITE_API_URL}/update-task/${taskId}`
];
      
      let response = null;
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          if (endpoint.includes('update-task')) {
            // For update-task endpoint, send progress: 100
            response = await axios.put(endpoint, { progress: 100, description: "Task completed" });
          } else {
            response = await axios.put(endpoint);
          }
          
          if (response.data) {
            console.log("Success with endpoint:", endpoint, response.data);
            break;
          }
        } catch (err) {
          lastError = err;
          console.log(`Failed with endpoint ${endpoint}:`, err.message);
        }
      }
      
      if (response && (response.data.success || response.status === 200)) {
        await fetchTasks();
        if (onTaskUpdate) onTaskUpdate();
        alert("✅ Task marked as completed!");
      } else {
        throw new Error(lastError?.message || "Failed to complete task");
      }
      
    } catch (error) {
      console.error("Error completing task:", error);
      
      // Show detailed error message
      let errorMsg = "Failed to complete task. ";
      if (error.response) {
        errorMsg += `Server responded with: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMsg += "No response from server. Is the backend running?";
      } else {
        errorMsg += error.message;
      }
      
      alert(`❌ ${errorMsg}`);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleSubmitUpdate = async (taskId) => {
    const text = updateText[taskId]?.trim();
    if (!text) return;

    try {
      setSubmittingUpdate(taskId);
await axios.put(
  `${import.meta.env.VITE_API_URL}/update-task/${taskId}`,
  {
    description: text
  }
);      setUpdateText(prev => ({ ...prev, [taskId]: "" }));
      await fetchTasks();
      if (onTaskUpdate) onTaskUpdate();
    } catch (error) {
      console.error("Failed to update task:", error);
      alert("Failed to save update.");
    } finally {
      setSubmittingUpdate(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-sm">
        <div className="text-center text-gray-500">Loading your tasks...</div>
      </div>
    );
  }

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="space-y-6">
      {/* My Daily Tasks Header */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock size={24} />
            My Daily Tasks
          </h2>
          <p className="text-blue-100 text-sm mt-1">Track and manage your daily assignments</p>
        </div>

        {/* Pending Tasks Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AlertCircle size={20} className="text-orange-500" />
              Pending Tasks ({pendingTasks.length})
            </h3>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-2xl">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
              <p className="text-gray-500">No pending tasks! Great job! 🎉</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task._id} className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Task Title */}
                      <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                      
                      {/* Task Description - NOW VISIBLE */}
                      <p className="text-gray-600 mt-2 leading-relaxed">
                        {task.description || "No description provided"}
                      </p>
                      
                      {/* Task Progress Bar */}
                      {task.progress !== undefined && task.progress > 0 && task.progress < 100 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-600 h-full rounded-full transition-all" 
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                      
                      {/* Additional Task Details */}
                      <div className="mt-3 flex flex-wrap gap-3">
                        {task.deadline && (
                          <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full flex items-center gap-1">
                            <Clock size={12} />
                            Due: {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {task.projectId && (
                          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">
                            📁 Project Task
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 ml-4">
                      {/* Complete Button */}
                      <button
                        onClick={() => handleCompleteTask(task._id)}
                        disabled={updatingTaskId === task._id}
                        className="bg-green-50 hover:bg-green-600 text-green-600 hover:text-white px-5 py-2.5 rounded-xl transition flex items-center gap-2 disabled:opacity-50 font-medium min-w-[120px] justify-center"
                      >
                        {updatingTaskId === task._id ? (
                          <>
                            <Loader size={18} className="animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Update / Link Section */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={updateText[task._id] || ""}
                        onChange={(e) => setUpdateText(prev => ({ ...prev, [task._id]: e.target.value }))}
                        placeholder="Paste a link or type an update..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleSubmitUpdate(task._id)}
                        disabled={submittingUpdate === task._id || !updateText[task._id]?.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 text-sm font-medium disabled:opacity-50"
                      >
                        {submittingUpdate === task._id ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <CheckCircle size={20} className="text-green-500" />
              Completed Tasks ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.slice(0, 5).map((task) => (
                <div key={task._id} className="flex items-center gap-3 text-gray-500">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="line-through">{task.title}</span>
                  {task.description && (
                    <span className="text-xs text-gray-400 line-through">- {task.description.substring(0, 50)}</span>
                  )}
                </div>
              ))}
              {completedTasks.length > 5 && (
                <p className="text-sm text-gray-400 mt-2">+ {completedTasks.length - 5} more completed tasks</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TasksSection;