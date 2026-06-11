import { Timer } from "lucide-react";

function DeadlineCountdown({ tasks = [] }) {
  // Find only incomplete tasks that have a deadline set
  const pendingTasks = tasks.filter((t) => !t.completed && t.deadline);

  // Sort them so the closest date is first
  const sortedTasks = pendingTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  
  // Grab the most urgent task
  const urgentTask = sortedTasks.length > 0 ? sortedTasks[0] : null;

  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-500 p-8 rounded-3xl shadow-md text-white">
      <div className="flex items-center gap-3 mb-4">
        <Timer size={28} />
        <h2 className="text-2xl font-bold">Closest Deadline</h2>
      </div>

      {urgentTask ? (
        <div>
          <p className="text-white/80 text-sm mb-1">Task: {urgentTask.title}</p>
          <h3 className="text-4xl font-extrabold mt-2">{urgentTask.deadline}</h3>
          <p className="mt-4 bg-white/20 inline-block px-4 py-2 rounded-xl text-sm font-medium">
            Keep pushing! You can do this.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <h3 className="text-2xl font-bold">No Urgent Tasks</h3>
          <p className="text-white/80 mt-2">You are all caught up!</p>
        </div>
      )}
    </div>
  );
}

export default DeadlineCountdown;