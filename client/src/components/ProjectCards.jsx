import { UploadCloud, CheckCircle, AlertCircle, Calendar, Users, Info } from "lucide-react";

function ProjectCards({ projects = [], tasks = [], openUpdateModal }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {projects.map((project) => {
        const myTask = tasks.find(t => t.projectId === project._id || t.projectId === project.title);
        const progress = project.progress || 0;
        
        return (
          <div key={project._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
            {/* Top colored bar based on progress */}
            <div className={`h-1 bg-gradient-to-r ${
              progress >= 75 ? "from-green-500 to-emerald-600" : 
              progress >= 50 ? "from-blue-500 to-indigo-600" : 
              progress >= 25 ? "from-yellow-500 to-orange-600" : 
              "from-red-500 to-pink-600"
            }`}></div>
            
            <div className="p-6">
              {/* Title and Status */}
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold text-gray-800">{project.title}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  project.status === "Active" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {project.status || "Active"}
                </span>
              </div>
              
              {/* Description Box - NOW VISIBLE */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-sm text-gray-600 border border-gray-100">
                <div className="font-semibold text-gray-700 mb-1 text-xs uppercase tracking-wide flex items-center gap-1">
                  <Info size={12} /> Description
                </div>
                {project.description || "No description provided"}
              </div>
              
              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Team Progress</span>
                  <span className="font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {/* Progress level text */}
                <div className="text-right text-xs text-gray-400 mt-1">
                  {progress === 100 ? "✅ Complete" : 
                   progress >= 75 ? "🚀 Almost Done" : 
                   progress >= 50 ? "📈 Half Way" : 
                   progress >= 25 ? "⚡ In Progress" : 
                   "🌱 Just Started"}
                </div>
              </div>
              
              {/* Deadline and Team */}
              <div className="flex justify-between items-center mb-4 text-xs">
                {project.deadline && (
                  <div className="text-orange-600 flex items-center gap-1">
                    <Calendar size={12} /> Due: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                )}
                {project.team && project.team.length > 0 && (
                  <div className="text-gray-500 flex items-center gap-1">
                    <Users size={12} /> {project.team.length} members
                  </div>
                )}
              </div>
              
              {/* Update Button */}
              {myTask && !myTask.completed && (
                <button 
                  onClick={() => openUpdateModal(myTask, project.title)}
                  className="w-full mt-2 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-medium py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <UploadCloud size={16} />
                  Update Admin on Progress
                </button>
              )}
              {myTask && myTask.completed && (
                <div className="mt-2 text-center text-green-600 bg-green-50 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                  <CheckCircle size={16} />
                  Task Completed
                </div>
              )}
              {!myTask && (
                <div className="mt-2 text-center text-gray-400 bg-gray-50 py-2 rounded-xl text-sm">
                  No task assigned
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {projects.length === 0 && (
        <div className="col-span-2 text-center py-12 bg-white rounded-2xl shadow-sm">
          <AlertCircle size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No projects assigned to you yet.</p>
        </div>
      )}
    </div>
  );
}

export default ProjectCards;