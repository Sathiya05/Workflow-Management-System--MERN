import { ArrowRight, Briefcase, Users, CheckCircle, TrendingUp, Clock, Zap, Shield, BarChart3, Award, Sparkles, ChevronRight, Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminClick = () => {
    // Clear any existing session
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("employeeEmail");
    localStorage.removeItem("employeeRole");
    localStorage.removeItem("isAdmin");
    // Navigate to login with role parameter
    navigate("/login?role=admin");
  };

  const handleUserClick = () => {
    // Clear any existing session
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeName");
    localStorage.removeItem("employeeEmail");
    localStorage.removeItem("employeeRole");
    localStorage.removeItem("isAdmin");
    // Navigate to login with role parameter
    navigate("/login?role=user");
  };

  const features = [
    { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", desc: "Real-time task updates and instant notifications" },
    { icon: <Shield className="w-6 h-6" />, title: "Secure Platform", desc: "Enterprise-grade security for your data" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Analytics Dashboard", desc: "Insightful metrics and performance tracking" },
    { icon: <Users className="w-6 h-6" />, title: "Team Collaboration", desc: "Seamless communication and task delegation" },
  ];

  const testimonials = [
    { name: "Sarah Johnson", role: "Product Manager", content: "WorkFlow transformed how our team manages projects. Productivity increased by 40%!", rating: 5 },
    { name: "Michael Chen", role: "Tech Lead", content: "The best task management platform I've ever used. Intuitive and powerful.", rating: 5 },
    { name: "Emily Rodriguez", role: "CEO", content: "Real-time tracking and analytics have been game-changing for our business.", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      
      {/* NAVBAR - With Glassmorphism */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg">
                <Briefcase size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  WorkFlow
                </h1>
                <p className="text-xs text-gray-500">Smart Employee Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleUserClick}
                className="hidden md:flex border border-gray-200 hover:border-blue-400 hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-all duration-300 text-gray-700 font-medium"
              >
                User Dashboard
              </button>
              <button
                onClick={handleAdminClick}
                className="hidden md:flex bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-300 items-center gap-2 shadow-md hover:shadow-xl"
              >
                <Crown size={18} />
                Admin Panel
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 md:px-10 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* LEFT CONTENT */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                Modern SaaS Platform
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Empower
                </span>
                <br />
                Your Team With
                <br />
                Smart Workflow
              </h1>
              
              <p className="text-gray-500 text-lg leading-relaxed">
                Streamline employee productivity, manage tasks efficiently,
                monitor project performance, and improve company workflow
                using our modern MERN stack SaaS platform.
              </p>

              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleAdminClick}
                  className="group bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Crown size={20} />
                  Admin Portal
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition" />
                </button>
                <button
                  onClick={handleUserClick}
                  className="border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 text-gray-700"
                >
                  Employee Portal
                </button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-3 md:gap-6 pt-8">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2 text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    24+
                    <TrendingUp size={20} className="text-green-500 hidden md:inline" />
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">Active Projects</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2 text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    148+
                    <CheckCircle size={20} className="text-green-500 hidden md:inline" />
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">Tasks Completed</p>
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-1 md:gap-2 text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    32+
                    <Users size={20} className="text-orange-500 hidden md:inline" />
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-1">Team Members</p>
                </div>
              </div>
            </div>

            {/* RIGHT CONTENT - Animated Card */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-[300px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              {/* FLOATING CARDS */}
              <div className="hidden md:block absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl backdrop-blur-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Productivity Growth</p>
                    <h3 className="text-3xl font-bold text-green-600">+18%</h3>
                  </div>
                </div>
              </div>
              
              <div className="hidden md:block absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Active Now</p>
                    <p className="font-semibold text-sm">12 team members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADMIN INFO SECTION - NEW */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Crown size={16} />
              Admin Access
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Complete Platform Control
            </h2>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              Administrators have full access to manage employees, projects, tasks, and system settings
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Manage Employees</h3>
              <p className="text-sm text-gray-500">Add, edit, or remove employee accounts</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Project Oversight</h3>
              <p className="text-sm text-gray-500">Create and monitor all projects</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Analytics & Reports</h3>
              <p className="text-sm text-gray-500">View performance metrics and insights</p>
            </div>
          </div>

        
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold uppercase tracking-wider">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
              Everything you need to manage your team's workflow efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   

      {/* CTA SECTION */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-12 text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using WorkFlow to manage their projects efficiently
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleAdminClick}
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Crown size={18} />
                Admin Access
                <ArrowRight size={18} />
              </button>
              <button
                onClick={handleUserClick}
                className="border-2 border-white/30 hover:bg-white/10 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Employee Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Briefcase size={24} className="text-blue-400" />
                <span className="text-xl font-bold">WorkFlow</span>
              </div>
              <p className="text-gray-400 text-sm">
                Smart Employee Management System for modern teams.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 WorkFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;