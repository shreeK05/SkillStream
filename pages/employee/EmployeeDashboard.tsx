import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { CheckCircle, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Timeline from '../../components/Timeline';

const EmployeeDashboard: React.FC = () => {
    const { currentUser, getEmployeeAssignments, assets } = useAppContext();
    const navigate = useNavigate();
    const myAssignments = getEmployeeAssignments(currentUser.id);

    const completed = myAssignments.filter(a => a.status === 'Completed').length;
    const inProgress = myAssignments.filter(a => a.status === 'In-Progress').length;
    const pending = myAssignments.length - completed - inProgress;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                            <Zap className="w-3 h-3 mr-1 fill-current" /> {currentUser.streak} Day Streak
                        </span>
                    </div>
                    <p className="text-slate-500 mb-8 max-w-xl">
                        Your adaptive learning engine is active. You have <strong className="text-slate-900">{inProgress + pending}</strong> modules in your queue.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Modules Completed</p>
                            <p className="text-2xl font-bold text-slate-900 flex items-center">
                                {completed} <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Hours Learned</p>
                            <p className="text-2xl font-bold text-slate-900">{currentUser.hoursLearned}h</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Avg Score</p>
                            <p className="text-2xl font-bold text-slate-900">{currentUser.avgScore}%</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">XP Points</p>
                            <p className="text-2xl font-bold text-slate-900 text-brand-600">{currentUser.xp}</p>
                        </div>
                    </div>
                </div>
                {/* Decorative bg element */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand-50 to-transparent pointer-events-none"></div>
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
                        <div className="bg-slate-50 rounded-xl p-8 border border-dashed border-slate-300 text-center h-64 flex flex-col items-center justify-center">
                            <p className="text-slate-500 mb-4">No active learning path assigned yet.</p>
                            <Link to="/employee/library" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm">
                                Browse Training Library
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Stats / Preferences */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-900">Learning Preferences</h3>
                            <button className="text-xs text-brand-600 font-medium">Edit</button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Manual Preference</span>
                                <span className="font-medium text-slate-900">{currentUser.learningPreference}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Language</span>
                                <span className="font-medium text-slate-900">English</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Daily Goal</span>
                                <span className="font-medium text-green-600">30 min/day</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4">Areas to Improve</h3>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-sm font-medium text-slate-900">No weak areas identified</p>
                            <p className="text-xs text-slate-500">Keep up the great work!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;