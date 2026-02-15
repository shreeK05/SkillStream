import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { User, LearningStyle } from '../../types';
import { Save, User as UserIcon, Mail, Briefcase, Award, Zap, Brain, Sparkles } from 'lucide-react';

const UserProfile: React.FC = () => {
    const { currentUser, updateUser } = useAppContext();
    const [name, setName] = useState(currentUser?.name || '');
    const [preference, setPreference] = useState<LearningStyle>(currentUser?.learningPreference || 'Visual');
    const [isSaving, setIsSaving] = useState(false);

    if (!currentUser) return null;

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate API call
        setTimeout(() => {
            updateUser({ name, learningPreference: preference });
            setIsSaving(false);
            // Maybe show toast here
            // alert("Profile updated successfully!"); 
        }, 800);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Personal Profile</h1>
                <p className="text-gray-400 mt-1">Manage your identity and AI personalization settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Avatar */}
                <div className="space-y-6">
                    <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl p-8 border border-white/5 flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-6 shadow-2xl ring-4 ring-[#1e293b] relative z-10">
                            {currentUser.name.charAt(0)}
                        </div>
                        <h2 className="text-2xl font-bold text-white relative z-10">{currentUser.name}</h2>
                        <p className="text-sm text-indigo-300 font-medium mb-6 relative z-10">{currentUser.role} • {currentUser.department}</p>

                        <div className="w-full grid grid-cols-3 gap-3 text-center relative z-10">
                            <div className="bg-[#0f172a]/50 p-3 rounded-xl border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">XP</div>
                                <div className="font-bold text-white text-lg">{currentUser.xp}</div>
                            </div>
                            <div className="bg-[#0f172a]/50 p-3 rounded-xl border border-white/10 group-hover:border-amber-500/30 transition-colors">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Streak</div>
                                <div className="font-bold text-amber-400 text-lg flex justify-center items-center">{currentUser.streak} <Zap className="w-3 h-3 ml-1 fill-current" /></div>
                            </div>
                            <div className="bg-[#0f172a]/50 p-3 rounded-xl border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Score</div>
                                <div className="font-bold text-emerald-400 text-lg">{currentUser.avgScore}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-white/10">
                        <div className="relative z-10">
                            <div className="flex items-center mb-4">
                                <Award className="w-6 h-6 mr-3 text-indigo-200" />
                                <h3 className="font-bold text-lg">Top Performer</h3>
                            </div>
                            <p className="text-indigo-100/90 text-sm mb-6 leading-relaxed">
                                You are in the <span className="font-bold text-white">top 10%</span> of learners in your cohort. Your dedication involves mastering complex topics ahead of schedule.
                            </p>
                            <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-white h-full rounded-full shadow-[0_0_10px_white]" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center bg-white/5">
                            <UserIcon className="w-5 h-5 mr-3 text-indigo-400" />
                            <h3 className="font-bold text-lg text-white">
                                Account Details
                            </h3>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                                    <div className="relative group">
                                        <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all outline-none text-white font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-600" />
                                        <input
                                            type="email"
                                            value={currentUser.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-[#0f172a]/30 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                                    <div className="relative">
                                        <Briefcase className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-600" />
                                        <input
                                            type="text"
                                            value={currentUser.department}
                                            disabled
                                            className="w-full pl-10 pr-4 py-3 bg-[#0f172a]/30 border border-white/5 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-3 flex items-center justify-between">
                                        <span>Learning Preference</span>
                                        <span className="text-[10px] text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">AI Recommendation Engine</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Visual', 'Text', 'Hands-on'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setPreference(type as LearningStyle)}
                                                className={`px-2 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all ${preference === type
                                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25'
                                                    : 'bg-[#0f172a]/50 border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl border border-amber-500/20 p-6 flex items-start gap-4 backdrop-blur-sm">
                        <div className="bg-amber-500/20 p-3 rounded-xl text-amber-500 shrink-0">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white mb-1 flex items-center">
                                Svadhyaya Adaptive Engine
                                <Sparkles className="w-3 h-3 text-amber-400 ml-2 animate-pulse" />
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                The AI engine is currently optimizing your feed based on your <strong>{preference}</strong> preference.
                                Adjusting this setting will immediately recalibrate future module recommendations in your dashboard.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
