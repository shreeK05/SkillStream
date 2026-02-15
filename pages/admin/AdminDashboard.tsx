import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Users, BookOpen, BarChart, CheckCircle, Activity, TrendingUp } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

  const StatsCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-[#1e293b]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/5 shadow-lg group hover:bg-[#1e293b] transition-all duration-300 relative overflow-hidden">
      {/* Hover Glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg shadow-indigo-500/20`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className="flex items-center space-x-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
            <TrendingUp className="w-3 h-3" />
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Command Center</h1>
          <p className="text-gray-400 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-indigo-400" />
            Real-time workforce intelligence
          </p>
        </div>
        <div className="hidden md:flex space-x-3">
          <button className="px-4 py-2 bg-[#1e293b] text-gray-300 border border-white/5 rounded-xl text-sm font-medium hover:text-white hover:border-white/20 transition-all">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all">
            + Assign Training
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Workforce" value={totalEmployees} icon={Users} color="from-indigo-500 to-indigo-600" trend="+12%" />
        <StatsCard title="Active Modules" value={totalAssets} icon={BookOpen} color="from-cyan-500 to-cyan-600" trend="+5%" />
        <StatsCard title="Global Score" value={`${avgScore}%`} icon={BarChart} color="from-purple-500 to-purple-600" trend="+2.4%" />
        <StatsCard title="Completion Rate" value={`${completionRate}%`} icon={CheckCircle} color="from-emerald-500 to-emerald-600" trend="+8%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workforce Performance Chart */}
        <div className="lg:col-span-1 bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/5 p-6 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-white text-lg">Performance Leaderboard</h3>
            <button className="text-xs text-indigo-400 hover:text-indigo-300">View All</button>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={performanceData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
                <Bar dataKey="score" barSize={12} radius={[0, 4, 4, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index < 3 ? '#6366f1' : '#334155'} />
                  ))}
                </Bar>
                {/* We can't easily customize YAxis in Recharts to show names nicely inside bars without complex custom components, sticking to tooltip for simplicity in this constrained edit */}
              </ReBarChart>
            </ResponsiveContainer>
          </div>
          {/* Manual Legend overlay as simpler alternative */}
          <div className="absolute top-20 left-6 space-y-3 pointer-events-none">
            {performanceData.slice(0, 5).map((p, i) => (
              <div key={i} className="flex flex-col h-[28px] justify-center mb-[18px]">
                <span className="text-xs text-gray-300 font-medium">{p.name} <span className="text-gray-500">({p.score}%)</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Employees List */}
        <div className="lg:col-span-2 bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/5 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-white text-lg">Recent Employee Activity</h3>
            <div className="flex space-x-2">
              <input type="text" placeholder="Filter..." className="bg-[#0f172a] border border-white/10 rounded-lg px-3 py-1 text-xs text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Role / Dept</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {employees.filter(e => e.role === 'Employee').slice(0, 5).map((employee) => (
                  <tr key={employee.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block group-hover:text-indigo-300 transition-colors">{employee.name}</span>
                          <span className="text-xs text-gray-500">{employee.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{employee.department}</div>
                      <div className="text-xs text-gray-500">Full-time</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className={`text-lg font-bold ${employee.avgScore >= 80 ? 'text-emerald-400' : employee.avgScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                          {employee.avgScore}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${employee.avgScore >= 80 ? 'bg-emerald-500' : employee.avgScore >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${employee.avgScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
