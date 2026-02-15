import React from 'react';
import { LayoutDashboard, BookOpen, Users, FilePlus, BarChart2, User, LogOut, Zap, Library, Target, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const adminMenu = [
    { id: '/admin/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: '/admin/employees', icon: Users, label: 'Workforce' },
    { id: '/admin/assets', icon: BookOpen, label: 'Content Library' },
    { id: '/admin/assign', icon: FilePlus, label: 'Assignments' },
    { id: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  ];

  const employeeMenu = [
    { id: '/employee/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: '/employee/library', icon: Library, label: 'Course Library' },
    { id: '/employee/learning', icon: BookOpen, label: 'My Learning' },
    { id: '/employee/progress', icon: BarChart2, label: 'Performance' },
    { id: '/employee/chatbot', icon: Zap, label: 'AI Chatbot' },
    { id: '/employee/profile', icon: User, label: 'My Profile' },
  ];

  const menuItems = currentUser.role === 'Admin' ? adminMenu : employeeMenu;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-72 bg-[#1e293b]/70 backdrop-blur-xl border-r border-white/5 h-screen flex flex-col fixed left-0 top-0 z-40 hidden md:flex shadow-[4px_0_30px_rgba(0,0,0,0.2)]">
      <div className="h-24 flex items-center px-8 border-b border-white/5">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Svadhyaya Logo" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight leading-none block group-hover:to-white transition-all">Svadhyaya</span>
            <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-medium opacity-80">v2.0 Beta</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="mb-8">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4 font-mono">
            Main Navigation
          </p>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 font-medium border group relative overflow-hidden ${isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/10 border-indigo-500/30 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)]'
                    : 'bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>
                  )}
                  <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'}`} />
                  <span>{item.label}</span>

                  {isActive && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Optional Status Card */}
        <div className="mt-8 mx-2 p-4 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-purple-800/20 border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all"></div>
          <div className="flex items-center space-x-3 mb-2 relative z-10">
            <Target className="w-5 h-5 text-indigo-400" />
            <span className="text-sm font-bold text-white">Daily Goal</span>
          </div>
          <div className="w-full bg-black/30 h-1.5 rounded-full mb-2 overflow-hidden">
            <div className="w-[75%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-400 relative z-10">You're 75% focused today. Keep it up!</p>
        </div>
      </div>

      <div className="p-6 border-t border-white/5 bg-[#1e293b]/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all duration-300 text-sm font-medium group"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;