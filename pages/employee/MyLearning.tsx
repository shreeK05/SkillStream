import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { PlayCircle, FileText, Lock, CheckCircle, Code, Clock, Zap } from 'lucide-react';

const MyLearning: React.FC = () => {
  const { currentUser, getEmployeeAssignments, assets } = useAppContext();
  const assignments = getEmployeeAssignments(currentUser.id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Video': return <PlayCircle className="w-8 h-8" />;
      case 'Doc': return <FileText className="w-8 h-8" />;
      case 'Sandbox': return <Code className="w-8 h-8" />;
      default: return <PlayCircle className="w-8 h-8" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
          My Learning Path
          <Zap className="w-6 h-6 text-amber-400 ml-3 fill-current" />
        </h1>
        <p className="text-gray-400 mt-1">Continue your personalized training journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(assignment => {
          const asset = assets.find(a => a.id === assignment.assetId);
          if (!asset) return null;

          const isLocked = assignment.status === 'Locked';
          const isCompleted = assignment.status === 'Completed';
          const isInProgress = assignment.status === 'In-Progress';

          return (
            <div key={assignment.id} className="bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-lg overflow-hidden flex flex-col hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all group relative">
              {/* Card Header / Visual */}
              <div className={`h-48 relative overflow-hidden flex items-center justify-center`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${isCompleted ? 'from-emerald-900/40 to-slate-900' :
                    isInProgress ? 'from-indigo-900/40 to-purple-900/40' : 'from-slate-800 to-slate-900'
                  }`}></div>

                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative z-10 shadow-2xl backdrop-blur-md border border-white/10 ${isCompleted ? 'bg-emerald-500/20 text-emerald-300' :
                    isInProgress ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 text-gray-500'
                  } group-hover:scale-110 transition-transform duration-300`}>
                  {getIcon(asset.type)}
                </div>

                {isCompleted && (
                  <div className="absolute top-4 right-4 bg-emerald-500/20 backdrop-blur px-3 py-1 rounded-full border border-emerald-500/30 flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-1.5" />
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wide">Done</span>
                  </div>
                )}

                {isInProgress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                    <div className="h-full bg-indigo-500" style={{ width: `${assignment.progress}%` }}></div>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col relative z-10 bg-[#1e293b]/40">
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide ${asset.type === 'Video' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                      asset.type === 'Sandbox' ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                        'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                    }`}>
                    {asset.type}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">{asset.difficulty}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">{asset.title}</h3>
                <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed flex-1">{asset.description}</p>

                <div className="mt-auto">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-4 font-medium">
                    <span className="bg-white/5 px-2 py-1 rounded border border-white/5">{asset.topic}</span>
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {asset.durationMinutes}m</span>
                  </div>

                  {isLocked ? (
                    <button disabled className="w-full bg-[#0f172a] border border-white/5 text-gray-500 py-3 rounded-xl text-sm font-bold flex items-center justify-center cursor-not-allowed opacity-70">
                      <Lock className="w-4 h-4 mr-2" /> Locked
                    </button>
                  ) : (
                    <Link
                      to={`/employee/learning/${assignment.id}`}
                      className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center transition-all transform active:scale-[0.98] shadow-lg ${isCompleted
                          ? 'bg-[#0f172a] hover:bg-[#0f172a]/80 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 border border-indigo-500/50'
                        }`}
                    >
                      {isCompleted ? 'Review Material' : (assignment.progress > 0 ? 'Resume Learning' : 'Start Module')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyLearning;
