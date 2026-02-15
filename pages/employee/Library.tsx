import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, PlayCircle, FileText, Code, Clock, Check, Zap, Layers, Sparkles } from 'lucide-react';
import { Asset } from '../../types';

const Library: React.FC = () => {
    const { assets, startCourse, assignments, currentUser } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [isAnimating, setIsAnimating] = useState(false);

    // Helper to check status
    const getStatus = (assetId: string) => {
        const assignment = assignments.find(a => a.userId === currentUser?.id && a.assetId === assetId);
        return assignment ? assignment.status : null;
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Video': return <PlayCircle className="w-6 h-6" />;
            case 'Doc': return <FileText className="w-6 h-6" />;
            case 'Sandbox': return <Code className="w-6 h-6" />;
            default: return <PlayCircle className="w-6 h-6" />;
        }
    };

    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTopic = selectedTopic === 'All' || asset.topic === selectedTopic;
        const matchesDifficulty = selectedDifficulty === 'All' || asset.difficulty === selectedDifficulty;

        return matchesSearch && matchesTopic && matchesDifficulty;
    });

    const topics = Array.from(new Set(assets.map(a => a.topic)));

    const handleStart = (assetId: string) => {
        setIsAnimating(true);
        startCourse(assetId);
        setTimeout(() => navigate('/employee/learning'), 600);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-white tracking-tight mb-3">Knowledge Library</h1>
                    <p className="text-gray-300 text-lg max-w-2xl font-light">
                        Explore our vast collection of AI-curated modules designed to accelerate your technical growth.
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-[#1e293b]/60 backdrop-blur-xl p-4 rounded-2xl border border-white/5 shadow-lg flex flex-col lg:flex-row gap-4 sticky top-24 z-20">
                <div className="relative flex-1 group">
                    <Search className="w-5 h-5 text-gray-500 absolute left-4 top-3.5 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for skills, topics, or keywords..."
                        className="w-full pl-12 pr-4 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all text-white placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <select
                            className="appearance-none pl-4 pr-10 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl outline-none cursor-pointer hover:bg-[#0f172a] text-white min-w-[160px] focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            <option value="All">All Topics</option>
                            {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <Layers className="w-4 h-4 text-gray-400 absolute right-4 top-4 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            className="appearance-none pl-4 pr-10 py-3 bg-[#0f172a]/50 border border-white/10 rounded-xl outline-none cursor-pointer hover:bg-[#0f172a] text-white min-w-[160px] focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium"
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                        >
                            <option value="All">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <Sparkles className="w-4 h-4 text-gray-400 absolute right-4 top-4 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map(asset => {
                    const status = getStatus(asset.id);
                    const isEnrolled = !!status;

                    return (
                        <div key={asset.id} className="bg-[#1e293b]/40 backdrop-blur-md rounded-2xl border border-white/5 hover:border-indigo-500/30 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full group overflow-hidden relative">
                            {/* Card Header with Image/Icon */}
                            <div className={`h-48 relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] group-hover:scale-105 transition-transform duration-500"></div>
                                {/* Mesh Gradient Overlay */}
                                <div className={`absolute inset-0 opacity-30 bg-gradient-to-tr ${asset.type === 'Video' ? 'from-purple-600 to-indigo-600' :
                                        asset.type === 'Sandbox' ? 'from-amber-600 to-orange-600' : 'from-cyan-600 to-blue-600'
                                    } mix-blend-overlay`}></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-2xl backdrop-blur-xl border border-white/10 ${asset.type === 'Video' ? 'bg-purple-500/20 text-purple-300' :
                                            asset.type === 'Sandbox' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                                        } group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        {getIcon(asset.type)}
                                    </div>
                                    <div className="absolute bottom-3 right-3">
                                        <span className="bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg border border-white/10 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {asset.durationMinutes}m
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col relative z-20 bg-[#1e293b]/60">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 uppercase tracking-wide">
                                        {asset.topic}
                                    </span>
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide ${asset.difficulty === 'Beginner' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' :
                                            asset.difficulty === 'Intermediate' ? 'text-amber-400 border-amber-500/20 bg-amber-500/10' :
                                                'text-red-400 border-red-500/20 bg-red-500/10'
                                        }`}>
                                        {asset.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                                    {asset.title}
                                </h3>
                                <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed flex-1">
                                    {asset.description}
                                </p>

                                <div className="mt-auto">
                                    {isEnrolled ? (
                                        <button
                                            onClick={() => navigate('/employee/learning')}
                                            className="w-full bg-[#0f172a] hover:bg-[#0f172a]/80 text-gray-300 border border-white/10 font-medium py-3 rounded-xl flex items-center justify-center transition-all group/btn"
                                        >
                                            <Check className="w-4 h-4 mr-2 text-emerald-500" />
                                            <span className="group-hover/btn:text-white transition-colors">
                                                {status === 'Completed' ? 'Completed' : 'Continue Learning'}
                                            </span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStart(asset.id)}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all transform active:scale-[0.98] border border-indigo-500/50 flex items-center justify-center relative overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center">
                                                Enroll Now
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer"></div>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredAssets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-[#1e293b]/40 backdrop-blur-xl rounded-3xl border border-dashed border-gray-700">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Search className="w-7 h-7 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No matching modules found</h3>
                    <p className="text-gray-400">Try adjusting your filters or search terms to explore our library.</p>
                </div>
            )}
        </div>
    );
};

export default Library;