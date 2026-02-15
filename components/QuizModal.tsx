import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number) => void;
  assetTitle: string;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, onSubmit, assetTitle }) => {
  const [score, setScore] = useState<number>(75); // Default to middle
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900">Module Quiz</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-600 mb-4">
            Simulating completion for <strong>{assetTitle}</strong>.
            <br/>
            Please enter a mock quiz score to test the <span className="text-brand-600 font-bold">Adaptive Engine</span>.
          </p>
          
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Quiz Score (0-100%)</label>
                <div className="flex items-center space-x-4">
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={score} 
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                    />
                    <span className={`text-lg font-bold w-12 text-center ${
                        score > 89 ? 'text-green-600' : score < 60 ? 'text-red-500' : 'text-amber-500'
                    }`}>{score}%</span>
                </div>
             </div>

             <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-slate-500">
                <p><strong>Scenario Guide:</strong></p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li><span className="text-red-500 font-medium">&lt; 60%</span>: Engine adds remedial content.</li>
                    <li><span className="text-amber-600 font-medium">60-90%</span>: Normal progression.</li>
                    <li><span className="text-green-600 font-medium">&gt; 90%</span>: Engine skips next intermediate module.</li>
                </ul>
             </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
            >
                Cancel
            </button>
            <button 
                onClick={() => onSubmit(score)}
                className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg flex items-center shadow-lg shadow-brand-500/30 transition-all"
            >
                <Check className="w-4 h-4 mr-2" />
                Submit Result
            </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;