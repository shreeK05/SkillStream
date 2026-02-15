import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle, Zap, BookOpen, Clock, Award, Target, TrendingUp, AlertOctagon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Timeline from '../../components/Timeline';

const EmployeeDashboard: React.FC = () => {
    const { currentUser, getEmployeeAssignments, assets } = useAppContext();
    const navigate = useNavigate();
    const myAssignments = getEmployeeAssignments(currentUser.id);

    const completed = myAssignments.filter(a => a.status === 'Completed').length;
    const inProgress = myAssignments.filter(a => a.status === 'In-Progress').length;
    const pending = myAssignments.length - completed - inProgress;

    const StatsCard = ({ label, value, icon: Icon, color, subtext }: any) => (
        <div className="bg-[#1e293b]/60 backdrop-blur-xl p-5 rounded-2xl border border-white/5 relative overflow-hidden group hover:bg-[#1e293b] transition-all duration-300">
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon className={`w-16 h-16 ${color.text}`} />
            </div>
            <div className="relative z-10">
                <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center mb-3 shadow-lg`}>
                    <Icon className={`w-5 h-5 ${color.text}`} />
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                <div className="flex items-end space-x-2">
                    <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
                    {subtext && <span className="text-xs text-emerald-400 font-medium mb-1 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" />{subtext}</span>}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Hero Welcome */}
            <div className="relative bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-3xl p-8 border border-white/10 overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{currentUser.name.split(' ')[0]}</span>
                            </h1>
                            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                                <Zap className="w-3 h-3 mr-1 fill-current" /> {currentUser.streak} Day Streak
                            </span>
                        </div>
                        <p className="text-gray-300 max-w-xl text-lg font-light leading-relaxed">
                            Your AI learning engine has curated <span className="text-white font-semibold">{inProgress + pending} new modules</span> for your growth path today.
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={() => navigate('/employee/library')} className="px-5 py-2.5 bg-[#1e293b]/50 hover:bg-[#1e293b] text-white border border-white/10 rounded-xl font-medium transition-all backdrop-blur-md">
                            Browse Library
                        </button>
                        <button onClick={() => inProgress > 0 ? navigate('/employee/learning') : null} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center">
                            <PlayCircle className="w-4 h-4 mr-2 fill-current" /> Continue Learning
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    <StatsCard
                        label="Modules Completed"
                        value={completed}
                        icon={CheckCircle}
                        color={{ bg: 'bg-emerald-500/10', text: 'text-emerald-400' }}
                        subtext="+2 this week"
                    />
                    <StatsCard
                        label="Hours Invested"
                        value={currentUser.hoursLearned}
                        icon={Clock}
                        color={{ bg: 'bg-blue-500/10', text: 'text-blue-400' }}
                    />
                    <StatsCard
                        label="Knowledge Score"
                        value={`${currentUser.avgScore}%`}
                        icon={Target}
                        color={{ bg: 'bg-purple-500/10', text: 'text-purple-400' }}
                        subtext="Top 10%"
                    />
                    <StatsCard
                        label="XP Gained"
                        value={currentUser.xp}
                        icon={Award}
                        color={{ bg: 'bg-amber-500/10', text: 'text-amber-400' }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Path Timeline */}
                <div className="lg:col-span-2">
                    {myAssignments.length > 0 ? (
                        <Timeline
                            assignments={myAssignments}
                            assets={assets}
                            onStart={(id) => navigate(`/employee/learning/${id}`)}
                        />
                    ) : (
                        <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl p-12 border border-dashed border-gray-700 text-center h-80 flex flex-col items-center justify-center group hover:bg-[#1e293b] transition-all">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <BookOpen className="w-8 h-8 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No active learning path</h3>
                            <p className="text-gray-500 mb-6 max-w-sm">Your queue is empty. Explore our library to start a new skill track.</p>
                            <Link to="/employee/library" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/30">
                                Browse Training Library
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    {/* Learning Preferences */}
                    <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white flex items-center">
                                <span className="w-1 h-5 bg-indigo-500 rounded-full mr-3"></span>
                                Preferences
                            </h3>
                            <button className="text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors uppercase tracking-wider">Edit</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                                <span className="text-gray-400">Style</span>
                                <span className="font-medium text-white">{currentUser.learningPreference}</span>
                            </div>
                            <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                                <span className="text-gray-400">Language</span>
                                <span className="font-medium text-white">English</span>
                            </div>
                            <div className="flex justify-between text-sm p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                                <span className="text-gray-400">Daily Goal</span>
                                <span className="font-bold text-emerald-400">30 min/day</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-[#1e293b]/80 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>

                        <h3 className="font-bold text-white mb-4 flex items-center">
                            <Zap className="w-4 h-4 text-amber-400 mr-2 fill-current" />
                            AI Insights
                        </h3>

                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                            <p className="text-sm font-bold text-white">You're on track!</p>
                            <p className="text-xs text-emerald-400/80 mt-1">Consistency score is up 15%</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-start space-x-3 text-xs text-gray-400">
                                <div className="min-w-[4px] h-[4px] bg-indigo-500 rounded-full mt-1.5"></div>
                                <p>Review "React Hooks" module to improve frontend score.</p>
                            </div>
                            <div className="flex items-start space-x-3 text-xs text-gray-400">
                                <div className="min-w-[4px] h-[4px] bg-indigo-500 rounded-full mt-1.5"></div>
                                <p>Suggested: "Advanced TypeScript" based on recent heavy usage.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;