import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ArrowLeft, CheckCircle, FileText, AlertTriangle, Play, Pause, Download, Award, ChevronRight, Loader2 } from 'lucide-react';

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

  if (!assignment || !asset) return <div>Assignment not found</div>;

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
        setDownloadComplete(true);
    }, 1500);
  };

  // Helper to ensure autoplay works when user clicks our custom play button
  const getVideoSrc = (url: string) => {
      // If URL already has params, append with &, else ?
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}autoplay=1`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate('/employee/learning')} className="flex items-center text-slate-500 hover:text-brand-600 transition-colors group font-medium">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Library
        </button>
        {assignment.status === 'Completed' && (
            <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-emerald-200 shadow-sm">
                <CheckCircle className="w-3 h-3 mr-1.5" /> MODULE COMPLETED
            </div>
        )}
      </div>

      {viewState === 'content' && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
              {/* Media Column */}
              <div className="w-full lg:w-3/4 bg-slate-900 relative">
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
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                                <div className="text-center p-8 max-w-lg">
                                    <button 
                                        onClick={() => setIsPlaying(true)}
                                        className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-8 cursor-pointer hover:bg-brand-600 hover:scale-105 transition-all duration-300 group shadow-2xl ring-1 ring-white/20"
                                    >
                                        <Play className="w-8 h-8 text-white ml-1 fill-current group-hover:text-white" />
                                    </button>
                                    <h3 className="text-white text-3xl font-bold mb-3 tracking-tight">{asset.title}</h3>
                                    <p className="text-slate-400 font-medium text-lg flex items-center justify-center gap-2">
                                        <span className="px-2 py-0.5 bg-white/10 rounded text-sm">{asset.durationMinutes} min</span>
                                        <span>•</span>
                                        <span>{asset.difficulty}</span>
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="absolute inset-0 flex flex-col bg-white">
                            <div className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar bg-slate-50/50">
                                <div className="bg-white p-12 shadow-sm border border-slate-100 min-h-full max-w-3xl mx-auto rounded-xl">
                                    <span className="text-brand-600 font-bold tracking-wider text-xs uppercase mb-2 block">Documentation</span>
                                    <h1 className="text-4xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100">{asset.title}</h1>
                                    <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
                                        <p className="font-serif italic text-xl text-slate-500 border-l-4 border-brand-200 pl-4">{asset.description}</p>
                                        
                                        <h3 className="font-bold text-slate-900 text-xl mt-8">1. Introduction</h3>
                                        <p>Comprehensive mastery of {asset.topic} requires understanding both the theoretical underpinnings and practical applications. This module covers the essential components required for proficiency.</p>
                                        
                                        <h3 className="font-bold text-slate-900 text-xl mt-8">2. Core Concepts</h3>
                                        <p>Key architectural patterns observed in modern enterprise systems include:</p>
                                        <ul className="list-disc pl-6 space-y-2 bg-slate-50 p-6 rounded-lg border border-slate-100 my-4">
                                            {asset.learningObjectives.map((obj, i) => (
                                                <li key={i} className="pl-2">{obj}</li>
                                            ))}
                                        </ul>
                                        <p>By applying these principles, you ensure scalability and maintainability of the codebase.</p>
                                        
                                        <p>Proceed to the assessment to verify your understanding of these concepts.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
              </div>

              {/* Info Column */}
              <div className="w-full lg:w-1/4 bg-white border-l border-slate-100 flex flex-col">
                  <div className="p-6 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${asset.type === 'Video' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                              {asset.type}
                          </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 leading-snug">{asset.title}</h2>
                  </div>

                  <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Module Overview</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{asset.description}</p>
                      </div>

                      <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Learning Objectives</h4>
                          <ul className="space-y-3">
                              {asset.learningObjectives.map((obj, i) => (
                                  <li key={i} className="flex items-start text-sm text-slate-600 group">
                                      <CheckCircle className="w-4 h-4 text-brand-500 mr-3 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                      <span className="leading-snug">{obj}</span>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>

                  <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                      <button 
                        onClick={handleMarkComplete}
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center group active:scale-[0.98]"
                      >
                          <span>{asset.type === 'Video' ? 'Take Assessment' : 'Complete Reading'}</span>
                          <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <p className="text-center text-xs text-slate-400 mt-3 font-medium">
                          70% passing score required for certification
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* Quiz and Result views remain the same as previous iteration, just ensuring the file is complete */}
      {viewState === 'quiz' && (
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8 md:p-16 max-w-4xl mx-auto">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                  <div className="inline-block p-3 rounded-full bg-brand-50 mb-4">
                    <FileText className="w-8 h-8 text-brand-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">Proficiency Assessment</h2>
                  <p className="text-slate-500 text-lg">Please answer the following questions to verify your mastery of <strong>{asset.title}</strong>.</p>
              </div>

              <div className="space-y-10">
                  {[1, 2, 3, 4, 5].map((q) => (
                      <div key={q} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards opacity-0" style={{animationDelay: `${q * 150}ms`}}>
                          <div className="flex gap-6">
                            <div className="flex-shrink-0">
                                <span className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 text-slate-400 font-bold flex items-center justify-center text-lg shadow-sm">
                                    {q}
                                </span>
                            </div>
                            <div className="flex-1 pt-1">
                                <p className="font-semibold text-slate-900 text-xl mb-5 leading-relaxed">
                                    Which of the following scenarios best demonstrates the application of {asset.topic} principles discussed in this module?
                                </p>
                                <div className="space-y-3">
                                    {['It ensures modularity and separation of concerns.', 'It tightly couples the data layer to the view layer.', 'It requires manual compilation for every change.', 'It is only applicable in legacy systems.'].map((opt, i) => (
                                        <label 
                                            key={i} 
                                            className={`flex items-center p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                                                quizAnswers[q] === i 
                                                ? 'bg-brand-50/50 border-brand-500 shadow-sm' 
                                                : 'border-slate-100 hover:border-brand-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors ${
                                                quizAnswers[q] === i ? 'border-brand-600 bg-brand-600' : 'border-slate-300 group-hover:border-brand-400'
                                            }`}>
                                                {quizAnswers[q] === i && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                            </div>
                                            <input 
                                                type="radio" 
                                                name={`q-${q}`} 
                                                className="hidden"
                                                onChange={() => setQuizAnswers(prev => ({...prev, [q]: i}))}
                                            />
                                            <span className={`text-base font-medium ${quizAnswers[q] === i ? 'text-brand-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                          </div>
                      </div>
                  ))}
              </div>

              <div className="mt-16 pt-8 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={calculateScore}
                    disabled={Object.keys(quizAnswers).length < 5}
                    className="bg-brand-600 hover:bg-brand-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-brand-500/20 transition-all text-lg transform active:scale-[0.98]"
                  >
                      Submit Assessment
                  </button>
              </div>
          </div>
      )}

      {viewState === 'result' && (
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden max-w-xl mx-auto text-center relative mt-12">
              <div className={`h-3 ${score >= 70 ? 'bg-emerald-500' : 'bg-red-500'} w-full`}></div>
              
              <div className="p-12">
                {score >= 70 ? (
                    <div className="animate-in zoom-in duration-500">
                        <div className="relative inline-block mb-8">
                            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center relative shadow-inner">
                                <Award className="w-14 h-14 text-emerald-600" />
                            </div>
                        </div>
                        
                        <h2 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">Certified!</h2>
                        <p className="text-slate-500 mb-10 text-lg">You have successfully mastered <br/><strong className="text-slate-900">{asset.title}</strong></p>
                        
                        <div className="grid grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 mb-10 shadow-sm">
                            <div className="bg-slate-50 p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Score</p>
                                <p className="text-2xl font-bold text-emerald-600">{score}%</p>
                            </div>
                            <div className="bg-slate-50 p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration</p>
                                <p className="text-2xl font-bold text-slate-900">{asset.durationMinutes}m</p>
                            </div>
                            <div className="bg-slate-50 p-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">XP</p>
                                <p className="text-2xl font-bold text-amber-500">+150</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {downloadComplete ? (
                                <button disabled className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center shadow-lg transition-colors cursor-default">
                                    <CheckCircle className="w-5 h-5 mr-2" /> Certificate Saved
                                </button>
                            ) : (
                                <button 
                                    onClick={handleDownloadCertificate}
                                    disabled={isDownloading}
                                    className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5 mr-2" /> Download Certificate
                                        </>
                                    )}
                                </button>
                            )}
                            
                            <button 
                                onClick={() => navigate('/employee/learning')} 
                                className="bg-white text-slate-600 border border-slate-200 px-8 py-3.5 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                                Return to Library
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in zoom-in duration-500">
                        <div className="w-28 h-28 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <AlertTriangle className="w-14 h-14 text-red-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Keep Learning</h2>
                        <p className="text-slate-500 mb-8 text-lg">You scored <span className="text-red-500 font-bold">{score}%</span>. <br/>Review the material and try again to certify.</p>
                        
                        <div className="bg-red-50 text-red-900 p-5 rounded-xl mb-10 border border-red-100 text-sm font-medium flex items-start text-left">
                            <div className="bg-white p-1 rounded-full mr-3 shrink-0">
                                <ArrowLeft className="w-3 h-3 text-red-500" />
                            </div>
                            Review Section 2: "Core Concepts of {asset.topic}" seems to be a weak area based on your responses.
                        </div>

                        <button 
                            onClick={() => setViewState('quiz')} 
                            className="w-full bg-brand-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-700 transition-colors"
                        >
                            Retake Assessment
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