import { CheckCircle, Clock, ListTodo } from "lucide-react";

function StatsCards({ tasks = [] }) {
  // 1. Calculate the real numbers from the database!
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-5">
        <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
          <ListTodo size={28} />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Total Assigned</p>
          <h3 className="text-2xl font-bold text-gray-800">{totalTasks}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-5">
        <div className="bg-green-100 p-4 rounded-2xl text-green-600">
          <CheckCircle size={28} />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Completed</p>
          <h3 className="text-2xl font-bold text-gray-800">{completedTasks}</h3>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-5">
        <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
          <Clock size={28} />
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Pending</p>
          <h3 className="text-2xl font-bold text-gray-800">{pendingTasks}</h3>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;