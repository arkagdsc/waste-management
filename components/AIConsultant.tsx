
import React, { useState } from 'react';
import { getWasteAdvice, ModelVariant } from '../services/geminiService';

interface AIConsultantProps {
  model: ModelVariant;
}

const AIConsultant: React.FC<AIConsultantProps> = ({ model }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const result = await getWasteAdvice(query, model);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full animate-pulse ${model.includes('pro') ? 'bg-purple-400' : 'bg-emerald-400'}`}></span>
          AI {model.includes('pro') ? 'Pro' : 'Flash'} Consultant
        </h3>
        <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded-full text-slate-400 uppercase tracking-widest font-bold">
          {model.includes('pro') ? 'Deep Reasoning' : 'High Speed'}
        </span>
      </div>
      <p className="text-slate-400 text-sm mb-6 italic">Instant guidance on composting, segregation, and laws.</p>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., How to compost eggshells?"
          className="flex-1 bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 text-slate-200 outline-none"
        />
        <button 
          disabled={loading}
          className={`p-3 rounded-xl transition-all disabled:opacity-50 ${model.includes('pro') ? 'bg-purple-600 hover:bg-purple-500' : 'bg-emerald-500 hover:bg-emerald-400'} text-slate-900`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
          <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${model.includes('pro') ? 'border-purple-500' : 'border-emerald-500'}`}></div>
          {model.includes('pro') ? 'Synthesizing complex reasoning...' : 'Generating expert advice...'}
        </div>
      )}

      {response && !loading && (
        <div className="mt-6 p-4 bg-slate-800/50 rounded-xl text-sm leading-relaxed border border-slate-700 text-slate-300">
          {response}
        </div>
      )}
    </div>
  );
};

export default AIConsultant;
