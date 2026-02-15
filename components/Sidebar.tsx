import React from 'react';
import { LayoutDashboard, BookOpen, Users, FilePlus, BarChart2, User, LogOut, Zap, Library } from 'lucide-react';
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
    { id: '/employee/library', icon: Library, label: 'Course Library' }, // New Link
    { id: '/employee/learning', icon: BookOpen, label: 'My Learning' },
    { id: '/employee/progress', icon: BarChart2, label: 'Performance' },
    { id: '/employee/profile', icon: User, label: 'My Profile' },
  ];

  const menuItems = currentUser.role === 'Admin' ? adminMenu : employeeMenu;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-40 hidden md:flex shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
      <div className="h-20 flex items-center px-8 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="bg-brand-600 p-2 rounded-xl shadow-lg shadow-brand-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 tracking-tight leading-none block">SkillStream</span>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Main Menu
        </p>
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group ${isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600"></div>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-red-600 transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;