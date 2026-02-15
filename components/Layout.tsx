import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Search, Menu, ChevronDown, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none z-0"></div>
      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300 relative z-10">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-20 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="md:hidden flex items-center space-x-3">
            <button className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-900 text-lg">SkillStream</span>
          </div>

          <div className="hidden md:flex flex-col">
            <h2 className="text-slate-900 font-bold text-lg leading-none">{currentUser.role === 'Admin' ? 'Admin Dashboard' : 'Learning Portal'}</h2>
            <span className="text-slate-500 text-xs font-medium mt-1">Enterprise Edition</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 group-focus-within:text-brand-500 transition-colors" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-slate-50 border border-transparent rounded-xl pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-brand-200 focus:ring-4 focus:ring-brand-500/10 w-72 transition-all outline-none"
              />
            </div>

            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 pl-2 cursor-pointer group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-white shadow-sm flex items-center justify-center text-brand-700 font-bold overflow-hidden">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 hidden md:block transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-50 text-brand-700 mt-2">
                      {currentUser.department}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/employee/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    <button
                      className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                  </div>

                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;