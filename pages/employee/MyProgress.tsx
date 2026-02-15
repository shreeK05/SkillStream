import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';
import { Award, Clock, Target, TrendingUp, Zap, Activity } from 'lucide-react';

const MyProgress: React.FC = () => {
    const { currentUser, assignments, assets } = useAppContext();
    const myAssignments = assignments.filter(a => a.userId === currentUser.id);

    // Data for Charts
    const topicPerformance: Record<string, number> = {};

    myAssignments.forEach(a => {
        if (a.status === 'Completed' && a.score) {
            const asset = assets.find(as => as.id === a.assetId);
            if (asset) {
                topicPerformance[asset.topic] = a.score;
            }
        }
    });

    const radarData = Object.keys(topicPerformance).map(topic => ({
        subject: topic,
        A: topicPerformance[topic],
        fullMark: 100
    }));

    const barData = myAssignments.filter(a => a.status === 'Completed').map(a => {
        const asset = assets.find(as => as.id === a.assetId);
        return {
            name: asset?.title.substring(0, 10) + '...',
            score: a.score
        };
    });

    const StatsCard = ({ icon: Icon, label, value, color }: any) => (
        <div className="bg-[#1e293b]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/5 relative overflow-hidden group hover:bg-[#1e293b] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${color.replace('text', 'border').replace('400', '500/20').replace('500', '500/20')} bg-opacity-10`}>
                    +12%
                </span>
            </div>
            <div>
                <div className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</div>
                <div className="text-gray-400 text-sm font-medium">{label}</div>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${color.replace('text-', 'from-').replace('400', '500')} to-transparent opacity-50`}></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                        Performance Analytics
                        <Activity className="w-6 h-6 text-indigo-400 ml-3 animate-pulse" />
                    </h1>
                    <p className="text-gray-400 mt-1">Deep dive into your learning metrics and growth trajectory.</p>
                </div>
                <div className="hidden md:flex space-x-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-600/20">Weekly</button>
                    <button className="px-4 py-2 bg-[#1e293b] text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors">Monthly</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard icon={Target} label="Total Modules" value={myAssignments.length} color="text-indigo-400" />
                <StatsCard icon={Award} label="Completed" value={myAssignments.filter(a => a.status === 'Completed').length} color="text-emerald-400" />
                <StatsCard icon={TrendingUp} label="Avg. Score" value={`${currentUser.avgScore}%`} color="text-amber-400" />
                <StatsCard icon={Clock} label="Hours Invested" value={currentUser.hoursLearned} color="text-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#1e293b]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="font-bold text-lg text-white flex items-center">
                            <Zap className="w-5 h-5 text-amber-400 mr-2 fill-current" />
                            Skill Proficiency Radar
                        </h3>
                    </div>
                    <div className="h-80 min-h-[320px] relative z-10">
                        {radarData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="#334155" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name="My Skills" dataKey="A" stroke="#818cf8" strokeWidth={3} fill="#6366f1" fillOpacity={0.4} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#818cf8' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <Target className="w-8 h-8 opacity-50" />
                                </div>
                                <p>Complete assessments to visualize your skill matrix</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#1e293b]/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="font-bold text-lg text-white flex items-center">
                            <TrendingUp className="w-5 h-5 text-emerald-400 mr-2" />
                            Module Performance
                        </h3>
                    </div>
                    <div className="h-80 min-h-[320px] relative z-10">
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.5} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} axisLine={false} tickLine={false} />
                                    <YAxis domain={[0, 100]} hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                                    />
                                    <Bar dataKey="score" fill="url(#colorScore)" radius={[6, 6, 0, 0]} barSize={40} />
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                    <Activity className="w-8 h-8 opacity-50" />
                                </div>
                                <p>No performance data available yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProgress;