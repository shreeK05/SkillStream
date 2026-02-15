import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Search, Filter, Mail, Award, Clock, AlertCircle, X } from 'lucide-react';
import { User, Assignment } from '../../types';

const EmployeeManagement: React.FC = () => {
  const { employees, assignments, assets } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);

  const filteredEmployees = employees.filter(emp => {
    if (emp.role !== 'Employee') return false;
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const getEmployeeStats = (userId: string) => {
    const userAssignments = assignments.filter(a => a.userId === userId);
    const completed = userAssignments.filter(a => a.status === 'Completed');
    return {
      total: userAssignments.length,
      completed: completed.length,
      avgScore: completed.length > 0 
        ? Math.round(completed.reduce((acc, curr) => acc + (curr.score || 0), 0) / completed.length) 
        : 0
    };
  };

  const EmployeeDetailModal = ({ employee, onClose }: { employee: User, onClose: () => void }) => {
    const empAssignments = assignments.filter(a => a.userId === employee.id);
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
           <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-start">
              <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                      {employee.name.charAt(0)}
                  </div>
                  <div>
                      <h2 className="text-2xl font-bold text-slate-900">{employee.name}</h2>
                      <div className="flex items-center text-slate-500 space-x-4 text-sm mt-1">
                          <span className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {employee.email}</span>
                          <span className="bg-slate-200 px-2 py-0.5 rounded text-slate-700 text-xs font-semibold">{employee.department}</span>
                      </div>
                  </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
              </button>
           </div>

           <div className="p-6 overflow-y-auto">
               <div className="grid grid-cols-3 gap-4 mb-8">
                   <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                       <p className="text-slate-500 text-xs font-bold uppercase">Avg Score</p>
                       <p className="text-2xl font-bold text-blue-700">{employee.avgScore}%</p>
                   </div>
                   <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                       <p className="text-slate-500 text-xs font-bold uppercase">Hours Learned</p>
                       <p className="text-2xl font-bold text-purple-700">{employee.hoursLearned}h</p>
                   </div>
                   <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                       <p className="text-slate-500 text-xs font-bold uppercase">Streak</p>
                       <p className="text-2xl font-bold text-green-700">{employee.streak} Days</p>
                   </div>
               </div>

               <h3 className="font-bold text-slate-900 mb-4">Training History</h3>
               {empAssignments.length > 0 ? (
                 <div className="border rounded-xl overflow-hidden border-slate-200">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 font-medium text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Asset</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Score</th>
                                <th className="px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {empAssignments.map(assign => {
                                const asset = assets.find(a => a.id === assign.assetId);
                                return (
                                    <tr key={assign.id}>
                                        <td className="px-4 py-3 font-medium text-slate-900">{asset?.title || 'Unknown Asset'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                assign.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                assign.status === 'Failed' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {assign.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">{assign.score ? `${assign.score}%` : '-'}</td>
                                        <td className="px-4 py-3 text-slate-500">{assign.completedDate || '-'}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 </div>
               ) : (
                   <p className="text-slate-500 italic text-center py-8">No training assigned yet.</p>
               )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Employee Management</h1>
        <p className="text-slate-500">View performance and manage workforce</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none cursor-pointer hover:bg-slate-100"
        >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Data Science">Data Science</option>
            <option value="Product">Product</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Avg Score</th>
                <th className="px-6 py-4">Learned</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                  const stats = getEmployeeStats(emp.id);
                  const isStruggling = emp.avgScore < 65;
                  
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                             {emp.name.charAt(0)}
                          </div>
                          <div>
                              <p className="font-semibold text-slate-900">{emp.name}</p>
                              <p className="text-xs text-slate-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{emp.department}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{emp.avgScore}%</td>
                      <td className="px-6 py-4 text-slate-600">{emp.hoursLearned} hrs</td>
                      <td className="px-6 py-4">
                          {isStruggling ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="w-3 h-3 mr-1" /> Struggling
                              </span>
                          ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  On Track
                              </span>
                          )}
                      </td>
                      <td className="px-6 py-4">
                          <button 
                            onClick={() => setSelectedEmployee(emp)}
                            className="text-brand-600 hover:text-brand-800 font-medium text-xs border border-brand-200 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                          >
                              View Details
                          </button>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEmployee && (
        <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}
    </div>
  );
};

export default EmployeeManagement;