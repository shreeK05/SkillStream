import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Search, Menu, ChevronDown, LogOut, User as UserIcon, Settings, Bell } from 'lucide-react';
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
    <div className="flex min-h-screen bg-[#0f172a] relative overflow-hidden text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-[100vh] bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pointer-events-none z-0"></div>
      <div className="fixed top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[10%] right-[10%] w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <Sidebar />

      <div className="flex-1 flex flex-col md:ml-72 transition-all duration-300 relative z-10">
        {/* Header */}
        <header className="bg-[#1e293b]/70 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-8 sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <div className="md:hidden flex items-center space-x-3">
            <button className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-white text-lg tracking-tight">Svadhyaya</span>
          </div>

          <div className="hidden md:flex flex-col">
            <h2 className="text-white font-bold text-lg leading-none tracking-tight">{currentUser.role === 'Admin' ? 'Command Center' : 'Learning Portal'}</h2>
            <span className="text-gray-500 text-xs font-medium mt-1">Svadhyaya Enterprise v2.0</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block group">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#0f172a]/50 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:bg-[#1e293b] focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 w-72 transition-all outline-none text-white placeholder-gray-500"
              />
            </div>

            <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border border-[#1e293b]"></span>
            </button>

            <div className="h-8 w-px bg-white/10 hidden md:block"></div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 pl-2 cursor-pointer group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-[#1e293b] shadow-lg shadow-indigo-500/20 flex items-center justify-center text-white font-bold overflow-hidden transform group-hover:scale-105 transition-transform">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-gray-200 group-hover:text-indigo-400 transition-colors">{currentUser.name}</p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 hidden md:block transition-transform duration-200 group-hover:text-gray-300 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-[#1e293b] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-white/5 py-2 animate-in fade-in zoom-in-95 duration-200 origin-top-right ring-1 ring-white/5">
                  <div className="px-4 py-3 border-b border-white/5">
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mt-2">
                      {currentUser.department}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/employee/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-indigo-400 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 mr-3" />
                      My Profile
                    </Link>
                    <button
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-indigo-400 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                  </div>

                  <div className="border-t border-white/5 py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
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