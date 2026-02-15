import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Award, Clock, Target, TrendingUp } from 'lucide-react';

const MyProgress: React.FC = () => {
  const { currentUser, assignments, assets } = useAppContext();
  const myAssignments = assignments.filter(a => a.userId === currentUser.id);

  // Data for Charts
  const topicPerformance: Record<string, number> = {};
  
  myAssignments.forEach(a => {
      if (a.status === 'Completed' && a.score) {
          const asset = assets.find(as => as.id === a.assetId);
          if (asset) {
              topicPerformance[asset.topic] = a.score;
          }
      }
  });

  const radarData = Object.keys(topicPerformance).map(topic => ({
      subject: topic,
      A: topicPerformance[topic],
      fullMark: 100
  }));

  const barData = myAssignments.filter(a => a.status === 'Completed').map(a => {
      const asset = assets.find(as => as.id === a.assetId);
      return {
          name: asset?.title.substring(0, 10) + '...',
          score: a.score
      };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
        <p className="text-slate-500">Track your performance with advanced analytics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase">Total Modules</div>
                  <Target className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{myAssignments.length}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase">Completed</div>
                  <Award className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{myAssignments.filter(a => a.status === 'Completed').length}</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase">Avg Score</div>
                  <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{currentUser.avgScore}%</div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                  <div className="text-slate-500 text-xs font-bold uppercase">Total Hours</div>
                  <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{currentUser.hoursLearned}</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Skills Proficiency Radar</h3>
              <div className="h-80">
                {radarData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                            <Radar name="My Skills" dataKey="A" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.5} />
                            <Tooltip />
                        </RadarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        Complete quizzes to visualize skills
                    </div>
                )}
              </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Topic Performance</h3>
              <div className="h-80">
                {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                            <YAxis domain={[0, 100]} hide />
                            <Tooltip cursor={{fill: '#f8fafc'}} />
                            <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        No data available
                    </div>
                )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default MyProgress;