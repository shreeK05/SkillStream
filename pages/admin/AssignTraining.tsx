import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Check, Search, Filter, Loader2, Users, BookOpen } from 'lucide-react';

const AssignTraining: React.FC = () => {
  const { employees, assets, assignTraining } = useAppContext();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const activeEmployees = employees.filter(e => e.role === 'Employee');

  const toggleEmployee = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleAsset = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    setIsSubmitting(true);
    // Real-feel delay
    setTimeout(() => {
      assignTraining(selectedEmployees, selectedAssets);
      setIsSubmitting(false);
      setSuccessMsg(`Assignments deployed successfully to ${selectedEmployees.length} employees.`);
      setSelectedEmployees([]);
      setSelectedAssets([]);
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Assign Training</h1>
        <p className="text-slate-500">Deploy learning modules and certification paths</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="bg-emerald-100 rounded-full p-1 mr-3">
                <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Employee Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center space-x-2">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <Users className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-bold text-slate-900">Select Workforce</h3>
            </div>
            {selectedEmployees.length > 0 && (
                <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full animate-in zoom-in">{selectedEmployees.length} Selected</span>
            )}
          </div>
          <div className="p-3 border-b border-slate-100">
             <div className="relative">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                 <input type="text" placeholder="Search by name or department..." className="w-full bg-slate-50 border-none rounded-xl pl-9 text-sm py-2.5 focus:ring-2 focus:ring-brand-500 transition-all" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             {activeEmployees.map(emp => (
                 <div 
                    key={emp.id}
                    onClick={() => toggleEmployee(emp.id)}
                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${selectedEmployees.includes(emp.id) ? 'bg-brand-50/70 border-brand-200 shadow-sm' : 'hover:bg-slate-50 border-transparent'}`}
                 >
                    <div className={`w-5 h-5 rounded-md border mr-3 flex items-center justify-center transition-colors ${selectedEmployees.includes(emp.id) ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white'}`}>
                        {selectedEmployees.includes(emp.id) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${selectedEmployees.includes(emp.id) ? 'text-brand-900' : 'text-slate-900'}`}>{emp.name}</p>
                        <p className="text-xs text-slate-500 truncate">{emp.department}</p>
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${emp.avgScore > 80 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {emp.avgScore}%
                    </div>
                 </div>
             ))}
          </div>
        </div>

        {/* Asset Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center space-x-2">
                <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <BookOpen className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="font-bold text-slate-900">Select Content</h3>
            </div>
            {selectedAssets.length > 0 && (
                <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full animate-in zoom-in">{selectedAssets.length} Selected</span>
            )}
          </div>
          <div className="p-3 border-b border-slate-100 flex space-x-2">
             <div className="relative flex-1">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                 <input type="text" placeholder="Search catalog..." className="w-full bg-slate-50 border-none rounded-xl pl-9 text-sm py-2.5 focus:ring-2 focus:ring-brand-500 transition-all" />
             </div>
             <button className="p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                 <Filter className="w-4 h-4" />
             </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
             {assets.map(asset => (
                 <div 
                    key={asset.id}
                    onClick={() => toggleAsset(asset.id)}
                    className={`flex items-center p-3 rounded-xl cursor-pointer transition-all border ${selectedAssets.includes(asset.id) ? 'bg-brand-50/70 border-brand-200 shadow-sm' : 'hover:bg-slate-50 border-transparent'}`}
                 >
                    <div className={`w-5 h-5 rounded-md border mr-3 flex items-center justify-center transition-colors ${selectedAssets.includes(asset.id) ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white'}`}>
                        {selectedAssets.includes(asset.id) && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-0.5">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${asset.type === 'Video' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                {asset.type}
                            </span>
                        </div>
                        <p className={`text-sm font-medium truncate ${selectedAssets.includes(asset.id) ? 'text-brand-900' : 'text-slate-900'}`}>{asset.title}</p>
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap ml-2">{asset.difficulty}</span>
                 </div>
             ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-200">
          <button 
            disabled={selectedEmployees.length === 0 || selectedAssets.length === 0 || isSubmitting}
            onClick={handleAssign}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center transform active:scale-[0.98]"
          >
            {isSubmitting ? (
                <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
                </>
            ) : (
                <>
                    Confirm Assignment
                </>
            )}
          </button>
      </div>
    </div>
  );
};

export default AssignTraining;