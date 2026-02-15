import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Users, BookOpen, BarChart, CheckCircle } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { employees, assets, assignments } = useAppContext();

  // Calculate Stats
  const totalEmployees = employees.filter(u => u.role === 'Employee').length;
  const totalAssets = assets.length;
  const avgScore = Math.round(employees.reduce((acc, curr) => acc + curr.avgScore, 0) / employees.length) || 0;
  
  const completedAssignments = assignments.filter(a => a.status === 'Completed').length;
  const totalAssignments = assignments.length;
  const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;

  // Chart Data: Top 5 Performers
  const performanceData = employees
    .filter(e => e.role === 'Employee')
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 10)
    .map(e => ({
      name: e.name.split(' ')[0],
      score: e.avgScore
    }));

  const StatsCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Workforce overview and training insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Employees" value={totalEmployees} icon={Users} color="bg-blue-500" />
        <StatsCard title="Total Assets" value={totalAssets} icon={BookOpen} color="bg-emerald-500" />
        <StatsCard title="Average Score" value={`${avgScore}%`} icon={BarChart} color="bg-purple-500" />
        <StatsCard title="Training Completion Rate" value={`${completionRate}%`} icon={CheckCircle} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Employees List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Recent Employees</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.filter(e => e.role === 'Employee').slice(0, 5).map((employee) => (
                  <tr key={employee.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                        {employee.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{employee.name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{employee.email}</td>
                    <td className="px-6 py-4 text-slate-500">{employee.department}</td>
                    <td className="px-6 py-4">
                        <span className={`font-bold ${employee.avgScore >= 80 ? 'text-green-600' : employee.avgScore >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            {employee.avgScore}%
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Workforce Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Workforce Performance Quick View</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={performanceData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#2563eb' : '#94a3b8'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
