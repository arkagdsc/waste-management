
import React from 'react';
import { TrainingModule } from '../types';

const modules: TrainingModule[] = [
  { id: '1', title: 'The Science of Segregation', description: 'Deep dive into Dry, Wet, and Hazardous waste categories.', duration: '45 mins', isCompleted: true },
  { id: '2', title: 'Home Composting Masterclass', description: 'Using your distributed kit to manage wet waste at source.', duration: '60 mins', isCompleted: false },
  { id: '3', title: 'Plastic Reuse & Upcycling', description: 'Turning scrap into functional home utilities.', duration: '30 mins', isCompleted: false },
  { id: '4', title: 'Worker Safety & Protocols', description: 'Phase-wise training for our environmental front-liners.', duration: '90 mins', isCompleted: false },
];

const TrainingHub: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800">Mandatory Training Hub</h3>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Your Progress: 25%</span>
      </div>
      <div className="space-y-4">
        {modules.map((m) => (
          <div key={m.id} className="group p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all flex items-start justify-between">
            <div className="flex gap-4">
              <div className={`mt-1 p-1 rounded-full ${m.isCompleted ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800">{m.title}</h4>
                <p className="text-sm text-slate-500">{m.description}</p>
                <span className="text-xs font-medium text-slate-400 mt-1 block italic">{m.duration} duration</span>
              </div>
            </div>
            <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${m.isCompleted ? 'text-emerald-600 bg-white border border-emerald-100' : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm'}`}>
              {m.isCompleted ? 'Re-watch' : 'Start'}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
};

export default TrainingHub;
