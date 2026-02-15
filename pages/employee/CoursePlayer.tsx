import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, CheckCircle, FileText, AlertTriangle, Play, Pause, Download, Award, ChevronRight, Loader2, Sparkles, BookOpen } from 'lucide-react';

const CoursePlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { assignments, assets, updateAssignmentProgress, currentUser } = useAppContext();

    const assignment = assignments.find(a => a.id === id);
    const asset = assets.find(a => a.id === assignment?.assetId);

    const [viewState, setViewState] = useState<'content' | 'quiz' | 'result'>('content');
    const [isPlaying, setIsPlaying] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
    const [score, setScore] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadComplete, setDownloadComplete] = useState(false);

    if (!assignment || !asset) return <div className="text-white text-center mt-20">Assignment not found</div>;

    const handleMarkComplete = () => {
        setViewState('quiz');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const calculateScore = () => {
        const answeredCount = Object.keys(quizAnswers).length;
        const calculatedScore = answeredCount * 20;
        setScore(calculatedScore);

        if (calculatedScore >= 70) {
            updateAssignmentProgress(assignment.id, 100, 'Completed', calculatedScore);
        } else {
            updateAssignmentProgress(assignment.id, 50, 'Failed', calculatedScore);
        }
        setViewState('result');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDownloadCertificate = () => {
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            // In a real app, this would trigger a PDF download
            setDownloadComplete(true);
        }, 1500);
    };

    const getVideoSrc = (url: string) => {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}autoplay=1`;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate('/employee/learning')} className="flex items-center text-gray-400 hover:text-white transition-colors group font-medium px-4 py-2 rounded-lg hover:bg-white/5">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Library
                </button>
                {assignment.status === 'Completed' && (
                    <div className="bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold flex items-center border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        <CheckCircle className="w-3 h-3 mr-1.5" /> MODULE COMPLETED
                    </div>
                )}
            </div>

            {viewState === 'content' && (
                <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    {/* Media Column */}
                    <div className="w-full lg:w-3/4 bg-[#0f172a] relative">
                        {asset.type === 'Video' ? (
                            isPlaying ? (
                                <iframe
                                    src={getVideoSrc(asset.contentUrl || '')}
                                    title={asset.title}
                                    className="w-full h-full absolute inset-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]">
                                    <div className="text-center p-8 max-w-lg relative z-10">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
                                        <button
                                            onClick={() => setIsPlaying(true)}
                                            className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-md flex items-center justify-center mx-auto mb-8 cursor-pointer hover:bg-indigo-600 hover:scale-110 transition-all duration-300 group shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] border border-white/10"
                                        >
                                            <Play className="w-10 h-10 text-white ml-2 fill-current" />
                                        </button>
                                        <h3 className="text-white text-3xl font-bold mb-3 tracking-tight">{asset.title}</h3>
                                        <p className="text-gray-400 font-medium text-lg flex items-center justify-center gap-3">
                                            <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-sm">{asset.durationMinutes} min</span>
                                            <span className="text-white/20">•</span>
                                            <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-sm">{asset.difficulty}</span>
                                        </p>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="absolute inset-0 flex flex-col bg-[#0f172a]">
                                <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
                                    <div className="bg-[#1e293b]/50 p-12 shadow-inner border border-white/5 min-h-full max-w-3xl mx-auto rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                                        <span className="text-indigo-400 font-bold tracking-widest text-xs uppercase mb-4 block flex items-center">
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            Documentation
                                        </span>
                                        <h1 className="text-4xl font-bold text-white mb-8 pb-6 border-b border-white/10">{asset.title}</h1>
                                        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
                                            <p className="font-serif italic text-xl text-gray-400 border-l-4 border-indigo-500/50 pl-6 py-2 bg-gradient-to-r from-indigo-500/5 to-transparent rounded-r-lg">
                                                {asset.description}
                                            </p>

                                            <div>
                                                <h3 className="font-bold text-white text-2xl mb-4 flex items-center">
                                                    <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm mr-3 border border-indigo-500/30">01</span>
                                                    Introduction
                                                </h3>
                                                <p>Comprehensive mastery of {asset.topic} requires understanding both the theoretical underpinnings and practical applications. This module covers the essential components required for proficiency in modern environments.</p>
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-white text-2xl mb-4 flex items-center">
                                                    <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm mr-3 border border-indigo-500/30">02</span>
                                                    Core Concepts
                                                </h3>
                                                <p className="mb-4">Key architectural patterns observed in modern enterprise systems include:</p>
                                                <ul className="space-y-3 bg-[#0f172a]/50 p-8 rounded-xl border border-white/5">
                                                    {asset.learningObjectives.map((obj, i) => (
                                                        <li key={i} className="flex items-start">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2.5 mr-3 shrink-0 shadow-[0_0_5px_#6366f1]"></div>
                                                            {obj}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <p className="text-gray-400 border-t border-white/5 pt-6 text-sm">
                                                Proceed to the assessment to verify your understanding of these critical concepts.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Info Column */}
                    <div className="w-full lg:w-1/4 bg-[#1e293b]/80 backdrop-blur-md border-l border-white/5 flex flex-col">
                        <div className="p-8 border-b border-white/5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${asset.type === 'Video' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                                    }`}>
                                    {asset.type}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-white leading-snug">{asset.title}</h2>
                        </div>

                        <div className="p-8 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Overview</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{asset.description}</p>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Objectives</h4>
                                <ul className="space-y-4">
                                    {asset.learningObjectives.map((obj, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-400 group hover:text-gray-300 transition-colors">
                                            <CheckCircle className="w-4 h-4 text-emerald-500/70 mr-3 shrink-0 mt-0.5 group-hover:text-emerald-400 transition-colors" />
                                            <span className="leading-snug">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/5 bg-[#0f172a]/30">
                            <button
                                onClick={handleMarkComplete}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center group active:scale-[0.98] border border-indigo-500/50"
                            >
                                <span>{asset.type === 'Video' ? 'Start Quiz' : 'Complete Reading'}</span>
                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-[10px] text-gray-500 mt-4 font-medium uppercase tracking-wide">
                                Score 70%+ to unlock badge
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {viewState === 'quiz' && (
                <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 p-8 md:p-16 max-w-4xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="text-center mb-16 max-w-2xl mx-auto relative z-10">
                        <div className="inline-block p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6 shadow-lg shadow-indigo-500/10">
                            <FileText className="w-10 h-10 text-indigo-400" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Proficiency Check</h2>
                        <p className="text-gray-400 text-lg">Verify your mastery of <br /><strong className="text-white">{asset.title}</strong></p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        {[1, 2, 3, 4, 5].map((q) => (
                            <div key={q} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards opacity-0" style={{ animationDelay: `${q * 100}ms` }}>
                                <div className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-8 hover:border-indigo-500/20 transition-colors">
                                    <div className="flex gap-6">
                                        <div className="flex-shrink-0">
                                            <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-bold flex items-center justify-center text-sm shadow-sm">
                                                0{q}
                                            </span>
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <p className="font-semibold text-white text-lg mb-6 leading-relaxed">
                                                Which of the following scenarios best demonstrates the application of {asset.topic} principles discussed in this module?
                                            </p>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {['It ensures separation of concerns.', 'Tight coupling of layers.', 'Requires manual recompilation.', 'Only for legacy systems.'].map((opt, i) => (
                                                    <label
                                                        key={i}
                                                        className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 group ${quizAnswers[q] === i
                                                                ? 'bg-indigo-600/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                                                                : 'bg-[#1e293b]/50 border-white/5 hover:border-white/20 hover:bg-[#1e293b]'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-all ${quizAnswers[q] === i ? 'border-indigo-400 bg-indigo-500' : 'border-gray-500 group-hover:border-indigo-400'
                                                            }`}>
                                                            {quizAnswers[q] === i && <div className="w-2 h-2 rounded-full bg-white shadow-sm" />}
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name={`q-${q}`}
                                                            className="hidden"
                                                            onChange={() => setQuizAnswers(prev => ({ ...prev, [q]: i }))}
                                                        />
                                                        <span className={`text-sm font-medium ${quizAnswers[q] === i ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/5 flex justify-end relative z-10">
                        <button
                            onClick={calculateScore}
                            disabled={Object.keys(quizAnswers).length < 5}
                            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#1e293b] disabled:text-gray-600 disabled:shadow-none disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all text-lg transform active:scale-[0.98] border border-indigo-500/20 disabled:border-white/5"
                        >
                            Complete Assessment
                        </button>
                    </div>
                </div>
            )}

            {viewState === 'result' && (
                <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/5 overflow-hidden max-w-xl mx-auto text-center relative mt-12">
                    <div className={`h-2 ${score >= 70 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-red-500 to-orange-500'} w-full`}></div>

                    <div className="p-12 relative">
                        {/* Background glow */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 ${score >= 70 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                        {score >= 70 ? (
                            <div className="animate-in zoom-in duration-500 relative z-10">
                                <div className="relative inline-block mb-10">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-full flex items-center justify-center relative shadow-[0_0_30px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/30">
                                        <Award className="w-16 h-16 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                                    </div>
                                    <Sparkles className="absolute -top-2 -right-2 text-emerald-300 w-8 h-8 animate-bounce" />
                                </div>

                                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Certified!</h2>
                                <p className="text-gray-400 mb-10 text-lg">You have mastered the concepts of <br /><strong className="text-white">{asset.title}</strong></p>

                                <div className="grid grid-cols-3 gap-px bg-[#0f172a]/50 rounded-2xl overflow-hidden border border-white/5 mb-10 shadow-inner">
                                    <div className="bg-[#1e293b]/30 p-5">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Score</p>
                                        <p className="text-2xl font-bold text-emerald-400">{score}%</p>
                                    </div>
                                    <div className="bg-[#1e293b]/30 p-5">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Duration</p>
                                        <p className="text-2xl font-bold text-white">{asset.durationMinutes}m</p>
                                    </div>
                                    <div className="bg-[#1e293b]/30 p-5">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">XP</p>
                                        <p className="text-2xl font-bold text-amber-400">+150</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {downloadComplete ? (
                                        <button disabled className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-8 py-4 rounded-xl font-bold flex items-center justify-center shadow-lg transition-colors cursor-default">
                                            <CheckCircle className="w-5 h-5 mr-2" /> Certificate Saved to Profile
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleDownloadCertificate}
                                            disabled={isDownloading}
                                            className="bg-[#0f172a] text-white border border-white/10 px-8 py-4 rounded-xl font-bold flex items-center justify-center hover:bg-[#0f172a]/70 hover:border-white/20 transition-all shadow-lg active:scale-[0.98] group"
                                        >
                                            {isDownloading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin text-indigo-400" /> Generating Credentials...
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-5 h-5 mr-2 text-indigo-400 group-hover:scale-110 transition-transform" /> Download Certificate
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => navigate('/employee/learning')}
                                        className="text-gray-400 px-8 py-4 rounded-xl font-bold hover:text-white transition-colors text-sm"
                                    >
                                        Return to Library
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in zoom-in duration-500 relative z-10">
                                <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.1)] ring-1 ring-red-500/20">
                                    <AlertTriangle className="w-16 h-16 text-red-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-3">Gap Identified</h2>
                                <p className="text-gray-400 mb-8 text-lg">You scored <span className="text-red-400 font-bold">{score}%</span>. <br />Review the documentation and retry.</p>

                                <div className="bg-red-500/5 text-red-200 p-6 rounded-2xl mb-10 border border-red-500/10 text-sm font-medium flex items-start text-left shadow-lg">
                                    <div className="bg-red-500/20 p-1.5 rounded-full mr-4 shrink-0 mt-0.5">
                                        <ArrowLeft className="w-3 h-3 text-red-400" />
                                    </div>
                                    <span className="leading-relaxed text-gray-300">
                                        AI Analysis Suggests: <span className="text-red-300">"Core Concepts of {asset.topic}"</span> appears to be a weak area based on your answers. Re-read Section 2.
                                    </span>
                                </div>

                                <button
                                    onClick={() => setViewState('quiz')}
                                    className="w-full bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-colors border border-indigo-500/50"
                                >
                                    Retry Assessment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoursePlayer;