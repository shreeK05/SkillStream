import React from 'react';
import { CheckCircle2, Circle, Lock, PlayCircle, FileText, Code, AlertTriangle, FastForward } from 'lucide-react';
import { Assignment, Asset } from '../types';

interface TimelineProps {
  assignments: Assignment[];
  assets: Asset[];
  onStart: (assignmentId: string) => void;
}

const Timeline: React.FC<TimelineProps> = ({ assignments, assets, onStart }) => {

  const getAsset = (id: string) => assets.find(a => a.id === id);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Video': return <PlayCircle className="w-4 h-4" />;
      case 'Doc': return <FileText className="w-4 h-4" />;
      case 'Sandbox': return <Code className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  // Sort assignments: Completed first, then In-Progress, then Pending/Locked
  const sortedAssignments = [...assignments].sort((a, b) => {
    const statusOrder = { 'Completed': 0, 'Failed': 1, 'In-Progress': 2, 'Pending': 3, 'Locked': 4 };
    return (statusOrder[a.status] - statusOrder[b.status]) || (a.assignedDate > b.assignedDate ? 1 : -1);
  });

  return (
    <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/5 p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">Your Learning Path</h3>
          <p className="text-sm text-gray-400 mt-1">AI-Curated sequence based on your goals</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full">{assignments.length} Modules</span>
      </div>

      <div className="relative space-y-8">
        {/* Vertical Line */}
        <div className="absolute left-[22px] top-4 bottom-4 w-0.5 bg-gray-700/50" style={{ zIndex: 0 }}></div>

        {sortedAssignments.map((item, index) => {
          const asset = getAsset(item.assetId);
          if (!asset) return null;

          const isCompleted = item.status === 'Completed';
          const isFailed = item.status === 'Failed';
          const isCurrent = item.status === 'In-Progress' || item.status === 'Pending';
          const isLocked = item.status === 'Locked';
          const isRemedial = item.assignedBy === 'AdaptiveEngine';
          const isFastTracked = isCompleted && item.score === 100 && item.progress === 100 && item.assignedBy !== 'AdaptiveEngine';

          return (
            <div key={item.id} className={`relative flex items-start group z-10`}>

              {/* Status Indicator Bubble */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 bg-[#0f172a] transition-all duration-300
                ${isCompleted ? 'border-emerald-500/20' : isFailed ? 'border-red-500/20' : isCurrent ? 'border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border-gray-700/30'}
              `}>
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300
                  ${isCompleted ? 'text-emerald-400' : isFailed ? 'text-red-400' : isCurrent ? 'text-indigo-400' : 'text-gray-600'}
                `}>
                  {isCompleted ? <CheckCircle2 className="w-full h-full" /> :
                    isFailed ? <AlertTriangle className="w-full h-full" /> :
                      isCurrent ? <PlayCircle className="w-full h-full fill-current" /> :
                        <Lock className="w-4 h-4" />}
                </div>
              </div>

              {/* Content Card */}
              <div className="ml-6 flex-1">
                <div className={`
                  p-5 rounded-2xl border transition-all duration-300 group-hover:border-white/10 relative overflow-hidden
                  ${isCurrent
                    ? 'bg-[#1e293b] border-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'bg-[#1e293b]/40 border-white/5 hover:bg-[#1e293b]/70'}
                `}>
                  {isCurrent && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>}

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2 flex-wrap gap-y-2">
                        <span className={`
                          text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border flex items-center space-x-1.5
                          ${asset.type === 'Video' ? 'bg-purple-500/10 border-purple-500/20 text-purple-300' :
                            asset.type === 'Sandbox' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                              'bg-cyan-500/10 border-cyan-500/20 text-cyan-300'}
                        `}>
                          {getIconForType(asset.type)}
                          <span>{asset.type}</span>
                        </span>

                        {isRemedial && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border bg-orange-500/10 border-orange-500/20 text-orange-300 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Remedial
                          </span>
                        )}
                        {isFastTracked && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border bg-emerald-500/10 border-emerald-500/20 text-emerald-300 flex items-center">
                            <FastForward className="w-3 h-3 mr-1" />
                            Fast-Track
                          </span>
                        )}
                        {isFailed && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border bg-red-500/10 border-red-500/20 text-red-300">
                            Review Required
                          </span>
                        )}
                      </div>

                      <h4 className={`text-lg font-bold tracking-tight mb-1 ${isCompleted ? 'text-gray-400' : 'text-white'}`}>
                        {asset.title}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${asset.difficulty === 'Beginner' ? 'bg-green-500' :
                            asset.difficulty === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></span>
                        {asset.difficulty} • {asset.durationMinutes} mins
                      </p>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      {isCurrent && (
                        <button
                          onClick={() => onStart(item.id)}
                          className="bg-indigo-600 text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                        >
                          {item.progress > 0 ? 'Resume Learning' : 'Start Module'}
                        </button>
                      )}
                      {isCompleted && (
                        <div className="text-right px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          <div className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-wider">Score</div>
                          <div className="text-xl font-bold text-emerald-400">{item.score}%</div>
                        </div>
                      )}
                      {isFailed && (
                        <button
                          onClick={() => onStart(item.id)}
                          className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors whitespace-nowrap"
                        >
                          Retake Module
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;