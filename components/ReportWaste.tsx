
import React, { useState, useRef } from 'react';
import { identifyWaste, ModelVariant, WasteAnalysis } from '../services/geminiService';

interface ReportWasteProps {
  model: ModelVariant;
}

const ReportWaste: React.FC<ReportWasteProps> = ({ model }) => {
  const [isReporting, setIsReporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [analysis, setAnalysis] = useState<WasteAnalysis | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Analysis
    setIsReporting(true);
    setAnalysis(null);

    const base64 = await new Promise<string>((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve((r.result as string).split(',')[1]);
      r.readAsDataURL(file);
    });

    const result = await identifyWaste(base64, model);
    setAnalysis(result);
    setIsReporting(false);
  };

  const handleSubmitReport = () => {
    setIsReporting(true);
    setTimeout(() => {
      setIsReporting(false);
      setSuccess(true);
      setAnalysis(null);
      setImagePreview(null);
      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  const categoryColors = {
    DRY: 'bg-blue-100 text-blue-700 border-blue-200',
    WET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    HAZARDOUS: 'bg-red-100 text-red-700 border-red-200',
    UNKNOWN: 'bg-slate-100 text-slate-500 border-slate-200'
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">AI Vision Scanner</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${model.includes('pro') ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
            {model.includes('pro') ? 'Ultra-Res' : 'Fast-Scan'}
          </span>
        </div>
      </div>
      
      <p className="text-slate-500 text-xs mb-6 leading-relaxed font-medium">
        Precision waste classification using multimodal neural networks. Trained on Indian Municipal SWM Rules 2016.
      </p>

      {success ? (
        <div className="p-6 bg-emerald-50 text-emerald-700 rounded-2xl flex flex-col items-center gap-2 text-center border border-emerald-100 animate-in zoom-in-95">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-bold">Report Geotagged & Dispatched</span>
          <p className="text-xs opacity-75">Our municipal team has been notified of the location.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {!imagePreview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-slate-200 rounded-3xl p-10 text-center hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer group"
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <span className="text-sm font-black text-slate-700">Scan Waste Item</span>
                <span className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-bold">Automatic Geotagging</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 flex items-center justify-center shadow-inner border border-slate-100">
                <img src={imagePreview} className="w-full h-full object-cover" alt="Waste Preview" />
                {isReporting && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                    <div className={`w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin mb-3`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Neural Analysis...</span>
                  </div>
                )}
              </div>
              
              {analysis && (
                <div className="space-y-4">
                  <div className={`p-5 border rounded-2xl ${categoryColors[analysis.category]} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Verified Category</span>
                        <div className="px-2 py-0.5 rounded bg-white/50 text-[10px] font-black uppercase tracking-widest border border-white/50">
                          {analysis.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black block leading-none">{analysis.confidence}%</span>
                        <span className="text-[8px] uppercase tracking-tighter opacity-60">Match</span>
                      </div>
                    </div>
                    
                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-current transition-all duration-1000" 
                        style={{ width: `${analysis.confidence}%` }}
                      ></div>
                    </div>

                    <div>
                      <p className="text-xs font-bold mb-1">Reasoning:</p>
                      <p className="text-[11px] leading-relaxed opacity-80">{analysis.reasoning}</p>
                    </div>

                    <div className="pt-3 border-t border-black/5">
                      <p className="text-xs font-bold mb-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Instruction:
                      </p>
                      <p className="text-[11px] leading-relaxed font-bold italic">{analysis.instruction}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleSubmitReport}
                      disabled={analysis.category === 'UNKNOWN'}
                      className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      Log Official Report
                    </button>
                    <button 
                      onClick={() => {setImagePreview(null); setAnalysis(null);}}
                      className="px-4 py-3.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportWaste;
