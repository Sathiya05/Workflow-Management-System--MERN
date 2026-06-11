import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://YOUR-VERCEL-URL.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

/* ==========================================
   MONGOOSE CONNECTION
========================================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected Successfully"))
  .catch((err) => console.log(" MongoDB Error:", err));

/* ==========================================
   SCHEMAS & MODELS
========================================== */
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    assignTo: { type: String, required: true },
    assignToName: { type: String, default: "" },
    projectId: { type: String, default: "" }, 
    deadline: { type: String, default: "" },
    progress: { type: Number, default: 0 }, 
    completed: { type: Boolean, default: false },
    userDeleted: { type: Boolean, default: false }, 
    archived: { type: Boolean, default: false },
    completedAt: { type: Date, default: null }
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    team: [{ type: String }], 
    deadline: { type: String, default: "" },
    progress: { type: Number, default: 0 },
    status: { type: String, default: "Active" }
  }, 
  { timestamps: true }
);
const Project = mongoose.model("Project", projectSchema);

const employeeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, default: "" },
    status: { type: String, default: "Active" },
    email: { type: String, default: "" },
    password: { type: String, default: "123" },
    isAdmin: { type: Boolean, default: false }
  },
  { timestamps: true }
);
const Employee = mongoose.model("Employee", employeeSchema);

/* ==========================================
   EMPLOYEE DATA (FULL LIST WITH ADMIN)
========================================= */
const EMPLOYEES = [
  // ========== ADMIN ACCOUNT ==========
  {
    _id: "ADMIN-001",
    id: "ADMIN-001",
    name: "Super Admin",
    role: "System Administrator",
    department: "Administration",
    status: "Active",
    email: "admin@test.com",
    password: "admin05",
    isAdmin: true
  },
  // ========== REGULAR EMPLOYEES ==========
  {
    _id: "GPK-25-003",
    id: "GPK-25-003",
    name: "AKILESH A",
    role: "Junior Software Developer",
    department: "Development",
    status: "Active",
    email: "akilesh@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-004",
    id: "GPK-25-004",
    name: "ARAVIND R",
    role: "Junior Software Developer",
    department: "Development",
    status: "Active",
    email: "aravind@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-005",
    id: "GPK-25-005",
    name: "JAYASHREE K",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "jayashree@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-006",
    id: "GPK-25-006",
    name: "MADHUMITHA J",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "madhumitha@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-007",
    id: "GPK-25-007",
    name: "PRANEASH M G",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "praneash@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-008",
    id: "GPK-25-008",
    name: "DHANUSH M N",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "dhanushmn@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-009",
    id: "GPK-25-009",
    name: "ASSWINTH P S",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "asswinth@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-010",
    id: "GPK-25-010",
    name: "SATHIYA PRIYA S",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "sathiyapriya@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-011",
    id: "GPK-25-011",
    name: "NAVEEN KUMAR S",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "naveen@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-012",
    id: "GPK-25-012",
    name: "ARUL PRAKASH S",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "arulprakash@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-013",
    id: "GPK-25-013",
    name: "NITHISH KUMAR R",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "nithish@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-014",
    id: "GPK-25-014",
    name: "ANBUMANI V",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "anbumani@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-015",
    id: "GPK-25-015",
    name: "SAM JOHN D",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "samjohn@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-016",
    id: "GPK-25-016",
    name: "DHANUSHA S",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "dhanusha@test.com",
    password: "123",
    isAdmin: false
  },
  {
    _id: "GPK-25-017",
    id: "GPK-25-017",
    name: "TAMILSELVAN S",
    role: "Frontend Developer",
    department: "Development",
    status: "Active",
    email: "tamilselvan@test.com",
    password: "123",
    isAdmin: false
  }
];

/* ==========================================
   TASK ROUTES
========================================== */

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({ archived: { $ne: true } }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/tasks/:employeeId", async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const allUserTasks = await Task.find({ 
      assignTo: employeeId,
      archived: { $ne: true } 
    }).sort({ createdAt: -1 });
    
    const filteredTasks = allUserTasks.filter(task => !task.userDeleted);
    res.json(filteredTasks);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/assign-task", async (req, res) => {
  try {
    const taskData = req.body;
    
    if (!taskData.assignToName && taskData.assignTo) {
      let employee = EMPLOYEES.find(e => e.id === taskData.assignTo || e._id === taskData.assignTo);
      if (!employee) {
        try {
          employee = await Employee.findOne({ id: taskData.assignTo });
        } catch (e) {}
      }
      if (employee) {
        taskData.assignToName = employee.name;
      }
    }
    
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json(error);
  }
});

app.put("/update-task/:id", async (req, res) => {
  try {
    const { progress, description } = req.body; 
    const isCompleted = progress >= 100;

    const updatePayload = { progress: progress, completed: isCompleted };
    if (description !== undefined) updatePayload.description = description; 
    if (isCompleted) updatePayload.completedAt = new Date();

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updatePayload, { new: true });

    if (updatedTask && updatedTask.projectId) {
      const pid = updatedTask.projectId;
      const allProjectTasks = await Task.find({ projectId: pid, archived: { $ne: true } });
      
      if (allProjectTasks.length > 0) {
        const totalPercentage = allProjectTasks.reduce((sum, task) => sum + (task.progress || 0), 0);
        const projectAverage = Math.round(totalPercentage / allProjectTasks.length);
        await Project.findByIdAndUpdate(pid, { progress: projectAverage });
      }
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/complete-task/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    
    const updatedTask = await Task.findByIdAndUpdate(
      taskId, 
      { 
        completed: true, 
        progress: 100,
        completedAt: new Date()
      }, 
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (updatedTask.projectId) {
      const pid = updatedTask.projectId;
      const allProjectTasks = await Task.find({ projectId: pid, archived: { $ne: true } });
      
      if (allProjectTasks.length > 0) {
        const totalPercentage = allProjectTasks.reduce((sum, task) => sum + (task.progress || 0), 0);
        const projectAverage = Math.round(totalPercentage / allProjectTasks.length);
        await Project.findByIdAndUpdate(pid, { progress: projectAverage });
      }
    }

    res.json({ success: true, message: "Task completed successfully", task: updatedTask });
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ message: "Error completing task", error: error.message });
  }
});

app.put("/hide-task/:id", async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, { userDeleted: true });
    res.json({ success: true, message: "Task hidden from user dashboard." });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/delete-task/:id", async (req, res) => {
  try {
    const taskToDelete = await Task.findById(req.params.id);
    if (!taskToDelete) return res.status(404).json({ message: "Task not found" });

    const pid = taskToDelete.projectId;
    await Task.findByIdAndDelete(req.params.id);

    if (pid) {
      const remainingTasks = await Task.find({ projectId: pid, archived: { $ne: true } });
      if (remainingTasks.length > 0) {
        const totalPercentage = remainingTasks.reduce((sum, task) => sum + (task.progress || 0), 0);
        const projectAverage = Math.round(totalPercentage / remainingTasks.length);
        await Project.findByIdAndUpdate(pid, { progress: projectAverage });
      } else {
        await Project.findByIdAndUpdate(pid, { progress: 0 });
      }
    }

    res.json({ success: true, message: "Task Permanently Deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ==========================================
   PROJECT ROUTES
========================================== */
app.post("/create-project", async (req, res) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/all-projects", async (req, res) => {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/projects/:employeeId", async (req, res) => {
  try {
    const empId = req.params.employeeId;
    let projects = await Project.find({ team: empId }).sort({ createdAt: -1 });

    // Fallback 1: if empId is a custom ID, find the MongoDB doc and check its _id
    if (projects.length === 0) {
      try {
        const employee = await Employee.findOne({ id: empId });
        if (employee) {
          projects = await Project.find({ team: employee._id.toString() }).sort({ createdAt: -1 });
        }
      } catch (e) {}
    }

    // Fallback 2: if empId is a MongoDB _id, find the doc and check its custom id
    if (projects.length === 0) {
      try {
        const employee = await Employee.findById(empId);
        if (employee && employee.id) {
          projects = await Project.find({ team: employee.id }).sort({ createdAt: -1 });
        }
      } catch (e) {}
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.put("/update-project/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/delete-project/:id", async (req, res) => {
  try {
    const projectIdToDelete = req.params.id;
    await Task.deleteMany({ projectId: projectIdToDelete });
    await Project.findByIdAndDelete(projectIdToDelete);
    res.json({ success: true, message: "Project and all tasks deleted!" });
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ==========================================
   EMPLOYEE ROUTES
========================================== */
app.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find({}).sort({ id: 1 });
    const employeeList = employees.map(emp => ({
      _id: emp._id.toString(),
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      status: emp.status,
      email: emp.email,
      isAdmin: emp.isAdmin === true
    }));
    res.json(employeeList);
  } catch (error) {
    const employeeList = EMPLOYEES.map(emp => ({
      _id: emp.id,
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      status: emp.status,
      email: emp.email,
      isAdmin: emp.isAdmin === true
    }));
    res.json(employeeList);
  }
});

app.get("/employees/:id", async (req, res) => {
  try {
    const empId = req.params.id;
    let emp = await Employee.findOne({ id: empId });
    if (!emp) {
      emp = EMPLOYEES.find(e => e.id === empId || e._id === empId);
    }
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({
      _id: emp.id || emp._id,
      id: emp.id || emp._id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      status: emp.status,
      email: emp.email,
      isAdmin: emp.isAdmin === true
    });
  } catch (error) {
    const empId = req.params.id;
    const emp = EMPLOYEES.find(e => e.id === empId || e._id === empId);
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({
      _id: emp.id,
      id: emp.id,
      name: emp.name,
      role: emp.role,
      department: emp.department,
      status: emp.status,
      email: emp.email,
      isAdmin: emp.isAdmin === true
    });
  }
});

app.post("/employees", async (req, res) => {
  try {
    const { id, name, role, department, status, email, password } = req.body;
    const existing = await Employee.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: `Employee ID ${id} already exists` });
    }
    const employee = await Employee.create({
      id, name, role, department: department || "", status: status || "Active",
      email: email || `${name?.toLowerCase().replace(/\s+/g, "")}@test.com`,
      password: password || "123", isAdmin: false
    });
    res.status(201).json({
      _id: employee._id.toString(),
      id: employee.id,
      name: employee.name,
      role: employee.role,
      department: employee.department,
      status: employee.status,
      email: employee.email,
      isAdmin: false
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/employees/:id", async (req, res) => {
  try {
    const identifier = req.params.id;
    let employee;
    try {
      employee = await Employee.findByIdAndDelete(identifier);
    } catch (e) {
      employee = null;
    }
    if (!employee) {
      employee = await Employee.findOneAndDelete({ id: identifier });
    }
    if (!employee) {
      return res.status(404).json({ message: `Employee not found` });
    }
    console.log(` Deleted employee: ${employee.name} (${employee.id})`);
    res.json({ success: true, message: `Employee deleted` });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

app.put("/employees/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const identifier = req.params.id;
    let employee;
    try {
      employee = await Employee.findByIdAndUpdate(identifier, { status }, { new: true });
    } catch (e) {
      employee = await Employee.findOneAndUpdate({ id: identifier }, { status }, { new: true });
    }
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({
      _id: employee._id.toString(),
      id: employee.id,
      name: employee.name,
      role: employee.role,
      department: employee.department,
      status: employee.status,
      email: employee.email,
      isAdmin: employee.isAdmin === true
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

/* ==========================================
   LOGIN ROUTE - WITH ADMIN CHECK
========================================= */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("=================================");
  console.log(" LOGIN ATTEMPT:");
  console.log("   Email:", email);
  console.log("   Password:", password);
  console.log("=================================");

  let user;
  let isAdmin = false;
  try {
    user = await Employee.findOne({
      email: email?.toLowerCase(),
      password: password
    });
    if (user) {
      isAdmin = user.isAdmin === true;
    }
  } catch (e) {
    user = EMPLOYEES.find(
      u =>
        u.email === email?.toLowerCase() &&
        u.password === password
    );
    if (user) {
      isAdmin = user.isAdmin === true;
    }
  }

  if (!user) {
    user = EMPLOYEES.find(
      u =>
        u.email === email?.toLowerCase() &&
        u.password === password
    );
    if (user) {
      isAdmin = user.isAdmin === true;
    }
  }

  if (user) {
 const response = {
  _id: user.id || user._id,
  id: user.id || user._id,
  name: user.name,
  role: user.role,
  department: user.department,
  status: user.status,
  email: user.email,
  employeeId: user.id || user._id,
  isAdmin: isAdmin
};

    console.log("  LOGIN SUCCESS:", user.name, "(Admin:", isAdmin + ")");
    console.log("LOGIN RESPONSE:", response);
    res.json(response);
  } else {
    console.log("  LOGIN FAILED: Invalid credentials");
    res.status(401).json({ message: "Invalid email or password" });
  }
});

async function seedEmployees() {
  try {
    const count = await Employee.countDocuments();
    if (count === 0) {
      const seedData = EMPLOYEES.map(({ _id, ...rest }) => rest);
      await Employee.insertMany(seedData);
      console.log(` Seeded ${seedData.length} employees into MongoDB`);
    } else {
      console.log(` Employees already in DB: ${count}`);
      // Fix existing documents: ensure isAdmin is stored as boolean, not string
      for (const emp of EMPLOYEES) {
        await Employee.updateOne(
          { email: emp.email },
          { $set: { isAdmin: emp.isAdmin === true } }
        );
      }
    }
  } catch (error) {
    console.log(" Seed skipped (MongoDB not ready yet):", error.message);
  }
}

/* ==========================================
   DEBUG ENDPOINT
========================================= */
app.get("/debug/users", (req, res) => {
  res.json({
    total: EMPLOYEES.length,
    adminCount: EMPLOYEES.filter(u => u.isAdmin).length,
    users: EMPLOYEES.map(u => ({
      name: u.name,
      email: u.email,
      id: u.id,
      isAdmin: u.isAdmin || false
    }))
  });
});

/* ==========================================
   SERVER INITIALIZATION
========================================== */
const PORT = process.env.PORT || 5000;
seedEmployees();
app.listen(PORT, () => {
  console.log(` Server Running On Port ${PORT}`);
  console.log(` Total Employees Loaded: ${EMPLOYEES.length}`);
  console.log(` Admin Account: admin@test.com / admin05`);
  console.log(` Test employee: sathiyapriya@test.com / 123`);
});