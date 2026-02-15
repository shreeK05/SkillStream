import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { PlayCircle, FileText, Lock, CheckCircle } from 'lucide-react';

const MyLearning: React.FC = () => {
  const { currentUser, getEmployeeAssignments, assets } = useAppContext();
  const assignments = getEmployeeAssignments(currentUser.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
        <p className="text-slate-500">Browse and continue your training resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map(assignment => {
          const asset = assets.find(a => a.id === assignment.assetId);
          if (!asset) return null;

          const isLocked = assignment.status === 'Locked';
          const isCompleted = assignment.status === 'Completed';

          return (
            <div key={assignment.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
               <div className={`h-40 ${isCompleted ? 'bg-green-50' : 'bg-slate-900'} flex items-center justify-center relative`}>
                  {asset.type === 'Video' ? (
                      <PlayCircle className={`w-12 h-12 ${isCompleted ? 'text-green-500' : 'text-white opacity-80'}`} />
                  ) : (
                      <FileText className={`w-12 h-12 ${isCompleted ? 'text-green-500' : 'text-white opacity-80'}`} />
                  )}
                  {isCompleted && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full p-1">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                  )}
               </div>
               
               <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 mb-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${asset.type === 'Video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {asset.type}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded">{asset.difficulty}</span>
                  </div>
                  
                  <h3 className="font-bold text-slate-900 mb-2">{asset.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1">{asset.description}</p>
                  
                  <div className="mt-auto">
                      <div className="flex justify-between text-xs text-slate-500 mb-2">
                          <span>{asset.topic}</span>
                          <span>{asset.durationMinutes} min</span>
                      </div>
                      
                      {isLocked ? (
                          <button disabled className="w-full bg-slate-100 text-slate-400 py-2 rounded-lg text-sm font-medium flex items-center justify-center cursor-not-allowed">
                              <Lock className="w-4 h-4 mr-2" /> Locked
                          </button>
                      ) : (
                          <Link 
                            to={`/employee/learning/${assignment.id}`}
                            className={`w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                                isCompleted 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                : 'bg-brand-600 text-white hover:bg-brand-700'
                            }`}
                          >
                             {isCompleted ? 'Review' : (assignment.progress > 0 ? 'Resume' : 'Start')}
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
