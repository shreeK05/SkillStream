import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const Analytics: React.FC = () => {
  const { employees, assignments, assets } = useAppContext();

  // 1. Skill Gap Analysis (Topic vs Avg Score)
  const topicStats: Record<string, { totalScore: number, count: number }> = {};
  
  // Aggregate scores by topic
  assignments.forEach(assign => {
    if (assign.status === 'Completed' && assign.score) {
        const asset = assets.find(a => a.id === assign.assetId);
        if (asset) {
            if (!topicStats[asset.topic]) {
                topicStats[asset.topic] = { totalScore: 0, count: 0 };
            }
            topicStats[asset.topic].totalScore += assign.score;
            topicStats[asset.topic].count += 1;
        }
    }
  });

  const skillGapData = Object.keys(topicStats).map(topic => ({
      name: topic,
      score: Math.round(topicStats[topic].totalScore / topicStats[topic].count),
      gap: 100 - Math.round(topicStats[topic].totalScore / topicStats[topic].count)
  })).sort((a, b) => a.score - b.score);

  // 2. Learning Velocity (Based on time to complete? Simulating via mock "streak" logic for demo)
  // Let's categorize employees based on their avgScore and hoursLearned
  const velocityData = [
      { name: 'Fast Learners', value: employees.filter(e => e.role === 'Employee' && e.avgScore > 85).length, color: '#22c55e' },
      { name: 'Average Learners', value: employees.filter(e => e.role === 'Employee' && e.avgScore >= 65 && e.avgScore <= 85).length, color: '#3b82f6' },
      { name: 'Slow Learners', value: employees.filter(e => e.role === 'Employee' && e.avgScore < 65).length, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Workforce Analytics</h1>
        <p className="text-slate-500">Training effectiveness and skill gap analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Skill Gap Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Skill Gap Analysis</h3>
              <p className="text-xs text-slate-500 mb-6">Topics below 60% are flagged as gaps (Red)</p>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={skillGapData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                          <XAxis type="number" domain={[0, 100]} hide />
                          <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                          <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px'}} />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                              {skillGapData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.score < 60 ? '#ef4444' : '#6366f1'} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Velocity Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-2">Learning Velocity Distribution</h3>
              <p className="text-xs text-slate-500 mb-6">Speed at which employees progress through training</p>
              <div className="h-80 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie
                            data={velocityData}
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {velocityData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">AI Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="text-red-800 font-bold mb-1">2 Critical Gaps Found</div>
                  <p className="text-sm text-red-600">Department "Sales" is falling behind in "Data Science" topics. Assign remedial content.</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="text-green-800 font-bold mb-1">High Performers</div>
                  <p className="text-sm text-green-600">3 Employees qualify for the "Advanced Cloud Architecture" certification path.</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="text-blue-800 font-bold mb-1">Content Usage</div>
                  <p className="text-sm text-blue-600">Video content has a 40% higher completion rate than Docs. Prioritize video uploads.</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Analytics;