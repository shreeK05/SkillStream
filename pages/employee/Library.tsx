import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, PlayCircle, FileText, Code, Clock, Check } from 'lucide-react';
import { Asset } from '../../types';

const Library: React.FC = () => {
    const { assets, startCourse, assignments, currentUser } = useAppContext();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');

    // Helper to check status
    const getStatus = (assetId: string) => {
        const assignment = assignments.find(a => a.userId === currentUser?.id && a.assetId === assetId);
        return assignment ? assignment.status : null;
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
        startCourse(assetId);
        // Find the new assignment ID (simulated delay or finding it directly)
        // For smoother UX, we can just navigate to my learning or stay here showing 'Enrolled'
        setTimeout(() => navigate('/employee/learning'), 500);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'Video': return <PlayCircle className="w-5 h-5" />;
            case 'Doc': return <FileText className="w-5 h-5" />;
            case 'Sandbox': return <Code className="w-5 h-5" />;
            default: return <PlayCircle className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Course Library</h1>
                    <p className="text-slate-500 mt-2">Explore new skills and advance your career with our curated content.</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Search courses, topics, skills..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer hover:bg-slate-100 min-w-[150px]"
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                    >
                        <option value="All">All Topics</option>
                        {topics.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select
                        className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer hover:bg-slate-100 min-w-[150px]"
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                    >
                        <option value="All">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAssets.map(asset => {
                    const status = getStatus(asset.id);
                    const isEnrolled = !!status;

                    return (
                        <div key={asset.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col h-full group">
                            <div className={`h-40 rounded-t-xl flex items-center justify-center relative ${asset.type === 'Video' ? 'bg-gradient-to-br from-indigo-900 to-slate-900' : 'bg-gradient-to-br from-slate-800 to-slate-900'
                                }`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm text-white group-hover:scale-110 transition-transform`}>
                                    {getIcon(asset.type)}
                                </div>
                                <span className="absolute top-3 right-3 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded border border-white/10">
                                    {asset.durationMinutes} min
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-wide">{asset.topic}</span>
                                    <span className="text-xs text-slate-500 border border-slate-200 px-2 py-0.5 rounded">{asset.difficulty}</span>
                                </div>

                                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">{asset.title}</h3>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{asset.description}</p>

                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    {isEnrolled ? (
                                        <button
                                            onClick={() => navigate('/employee/learning')}
                                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 rounded-lg flex items-center justify-center transition-colors"
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            {status === 'Completed' ? 'Completed' : 'Continue'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleStart(asset.id)}
                                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-lg shadow-md shadow-brand-500/20 transition-all active:scale-[0.98]"
                                        >
                                            Start Learning
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredAssets.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                    <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No courses found</h3>
                    <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
};

export default Library;