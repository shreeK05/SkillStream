import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Asset, AssetType, Difficulty } from '../../types';
import { Plus, Trash2, Video, FileText, Code, Search, Filter, X } from 'lucide-react';

const AssetManagement: React.FC = () => {
  const { assets, addAsset, deleteAsset } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    title: '',
    description: '',
    type: 'Video',
    difficulty: 'Beginner',
    durationMinutes: 30,
    topic: '',
    tags: [],
    learningObjectives: []
  });

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const asset: Asset = {
      id: `a-${Date.now()}`,
      title: newAsset.title || 'Untitled',
      description: newAsset.description || '',
      type: newAsset.type as AssetType,
      difficulty: newAsset.difficulty as Difficulty,
      topic: newAsset.topic || 'General',
      tags: newAsset.tags || [],
      durationMinutes: newAsset.durationMinutes || 15,
      learningObjectives: newAsset.learningObjectives || ['Understand core concepts']
    };
    addAsset(asset);
    setIsModalOpen(false);
    setNewAsset({ type: 'Video', difficulty: 'Beginner', durationMinutes: 30, tags: [], learningObjectives: [] });
  };

  const getIcon = (type: string) => {
    if (type === 'Video') return <Video className="w-4 h-4" />;
    if (type === 'Doc') return <FileText className="w-4 h-4" />;
    return <Code className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-slate-500">Manage your organization's learning content</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Asset</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto">
          {['All', 'Video', 'Doc', 'Sandbox'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterType === type 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map(asset => (
          <div key={asset.id} className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <span className={`p-2 rounded-lg ${asset.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                  {getIcon(asset.type)}
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                  {asset.difficulty}
                </span>
              </div>
              <button 
                onClick={() => deleteAsset(asset.id)}
                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-bold text-slate-900 mb-1">{asset.title}</h3>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{asset.description}</p>
            
            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-50 pt-3 mt-auto">
              <span className="bg-slate-50 px-2 py-1 rounded">{asset.topic}</span>
              <span>{asset.durationMinutes} min</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Upload Learning Asset</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddAsset} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                    placeholder="e.g., Advanced React Patterns"
                    value={newAsset.title}
                    onChange={e => setNewAsset({...newAsset, title: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                    <select 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      value={newAsset.type}
                      onChange={e => setNewAsset({...newAsset, type: e.target.value as any})}
                    >
                      <option>Video</option>
                      <option>Doc</option>
                      <option>Sandbox</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                    <select 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      value={newAsset.difficulty}
                      onChange={e => setNewAsset({...newAsset, difficulty: e.target.value as any})}
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none h-24"
                    placeholder="Briefly describe what this module covers..."
                    value={newAsset.description}
                    onChange={e => setNewAsset({...newAsset, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      placeholder="e.g., Frontend"
                      value={newAsset.topic}
                      onChange={e => setNewAsset({...newAsset, topic: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Duration (min)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
                      value={newAsset.durationMinutes}
                      onChange={e => setNewAsset({...newAsset, durationMinutes: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-lg shadow-brand-500/20"
                >
                  Upload Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetManagement;