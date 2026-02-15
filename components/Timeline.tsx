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
  // This is a simple sort. In a real graph, we'd traverse the edges.
  const sortedAssignments = [...assignments].sort((a, b) => {
    const statusOrder = { 'Completed': 0, 'Failed': 1, 'In-Progress': 2, 'Pending': 3, 'Locked': 4 };
    return (statusOrder[a.status] - statusOrder[b.status]) || (a.assignedDate > b.assignedDate ? 1 : -1);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Your Learning Path</h3>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded text-slate-500">{assignments.length} Modules</span>
      </div>

      <div className="relative space-y-0">
        {/* Vertical Line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200" style={{ zIndex: 0 }}></div>

        {sortedAssignments.map((item, index) => {
          const asset = getAsset(item.assetId);
          if (!asset) return null;

          const isCompleted = item.status === 'Completed';
          const isFailed = item.status === 'Failed';
          const isCurrent = item.status === 'In-Progress' || item.status === 'Pending';
          const isLocked = item.status === 'Locked';
          const isRemedial = item.assignedBy === 'AdaptiveEngine';
          const isFastTracked = isCompleted && item.score === 100 && item.progress === 100 && item.assignedBy !== 'AdaptiveEngine'; // Heuristic for fast-track demo

          return (
            <div key={item.id} className={`relative flex items-start group ${index !== sortedAssignments.length - 1 ? 'pb-8' : ''} z-10`}>

              {/* Status Indicator Bubble */}
              <div className={`
                flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-4 bg-white
                ${isCompleted ? 'border-green-100' : isFailed ? 'border-red-100' : isCurrent ? 'border-brand-100' : 'border-slate-50'}
              `}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white
                  ${isCompleted ? 'bg-green-500' : isFailed ? 'bg-red-500' : isCurrent ? 'bg-brand-600 shadow-lg shadow-brand-500/30' : 'bg-slate-200 text-slate-400'}
                `}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                    isFailed ? <AlertTriangle className="w-5 h-5" /> :
                      isCurrent ? <PlayCircle className="w-5 h-5 fill-current" /> :
                        <Lock className="w-4 h-4" />}
                </div>
              </div>

              {/* Content Card */}
              <div className="ml-4 flex-1">
                <div className={`
                  p-4 rounded-xl border transition-all duration-200
                  ${isCurrent
                    ? 'bg-white border-brand-200 shadow-md ring-1 ring-brand-100 transform scale-[1.01]'
                    : 'bg-white border-slate-100 hover:border-slate-200'}
                `}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1 flex-wrap gap-y-1">
                        <span className={`
                          text-xs font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1
                          ${asset.type === 'Video' ? 'bg-purple-50 text-purple-700' :
                            asset.type === 'Sandbox' ? 'bg-amber-50 text-amber-700' :
                              'bg-blue-50 text-blue-700'}
                        `}>
                          {getIconForType(asset.type)}
                          <span>{asset.type}</span>
                        </span>

                        {isRemedial && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Recommended (Remedial)
                          </span>
                        )}
                        {isFastTracked && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center">
                            <FastForward className="w-3 h-3 mr-1" />
                            Fast-Tracked
                          </span>
                        )}
                        {isFailed && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            Needs Review
                          </span>
                        )}
                      </div>
                      <h4 className={`font-semibold text-base ${isCompleted ? 'text-slate-600' : 'text-slate-900'}`}>
                        {asset.title}
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        {asset.difficulty} • {asset.durationMinutes} mins
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {isCurrent && (
                        <button
                          onClick={() => onStart(item.id)}
                          className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 shadow-sm transition-colors whitespace-nowrap"
                        >
                          {item.progress > 0 ? 'Resume' : 'Start'}
                        </button>
                      )}
                      {isCompleted && (
                        <div className="text-right">
                          <div className="text-xs text-slate-400 font-medium uppercase">Score</div>
                          <div className="text-lg font-bold text-green-600">{item.score}%</div>
                        </div>
                      )}
                      {isFailed && (
                        <button
                          onClick={() => onStart(item.id)}
                          className="bg-white border border-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap"
                        >
                          Retake
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