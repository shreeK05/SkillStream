import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { User, LearningStyle } from '../../types';
import { Save, User as UserIcon, Mail, Briefcase, Award, Zap, Brain } from 'lucide-react';

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
            alert("Profile updated successfully!");
        }, 800);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500">Manage your personal information and learning preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Stats & Avatar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-3xl font-bold mb-4 shadow-inner">
                            {currentUser.name.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{currentUser.name}</h2>
                        <p className="text-sm text-slate-500">{currentUser.role} • {currentUser.department}</p>

                        <div className="mt-6 w-full grid grid-cols-3 gap-2 text-center">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">XP</div>
                                <div className="font-bold text-brand-600">{currentUser.xp}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Streak</div>
                                <div className="font-bold text-orange-500">{currentUser.streak} 🔥</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Score</div>
                                <div className="font-bold text-green-600">{currentUser.avgScore}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-6 text-white shadow-lg shadow-brand-500/30 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center mb-4">
                                <Award className="w-6 h-6 mr-2 text-brand-200" />
                                <h3 className="font-bold text-lg">Current Status</h3>
                            </div>
                            <p className="text-brand-100 text-sm mb-4">
                                You are in the top 10% of learners in your department. Keep up the great work!
                            </p>
                            <div className="w-full bg-brand-900/30 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-900 flex items-center">
                                <UserIcon className="w-5 h-5 mr-2 text-slate-400" />
                                Personal Details
                            </h3>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="email"
                                            value={currentUser.email}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                                    <div className="relative">
                                        <Briefcase className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={currentUser.department}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center justify-between">
                                        <span>Learning Preference</span>
                                        <span className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-medium">Affects Recommendations</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Visual', 'Text', 'Hands-on'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setPreference(type as LearningStyle)}
                                                className={`px-3 py-2.5 text-sm font-medium rounded-xl border transition-all ${preference === type
                                                        ? 'bg-brand-50 border-brand-200 text-brand-700 ring-1 ring-brand-200'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex items-center px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-all shadow-sm transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Saving...
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

                    <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
                        <div className="bg-amber-100 p-3 rounded-xl text-amber-600 shrink-0">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-1">AI Engine Configuration</h3>
                            <p className="text-sm text-slate-500 mb-3">
                                The SkillStream Adaptive Engine uses your <strong>{preference}</strong> learning preference to prioritize content types in your learning path.
                                Changing this will affect future module recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
