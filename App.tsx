
import React, { useState, useEffect } from 'react';
import WasteOverview from './components/WasteOverview';
import TrainingHub from './components/TrainingModules';
import ReportWaste from './components/ReportWaste';
import AIConsultant from './components/AIConsultant';
import Login from './components/Login';
import { ModelVariant } from './services/geminiService';

type View = 'LANDING' | 'LOGIN' | 'TRAINING' | 'REPORT';
type UserRole = 'CITIZEN' | 'MUNICIPAL_WORKER';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('LANDING');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modelVariant, setModelVariant] = useState<ModelVariant>('gemini-3-flash-preview');
  const [userRole, setUserRole] = useState<UserRole>('CITIZEN');
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success per instructions
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('LANDING');
  };

  const NavItem = ({ view, label }: { view: View, label: string }) => (
    <button 
      onClick={() => setCurrentView(view)}
      className={`text-sm font-semibold transition-all ${currentView === view ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600'}`}
    >
      {label}
    </button>
  );

  if (currentView === 'LOGIN' && !isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentView('LANDING')}
          >
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 19h10v-2H7v2zm10-7l-1.41-1.41L13 13.17V4h-2v9.17l-2.58-2.58L7 12l5 5 5-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none">CleanIndia</h1>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Action Hub v2.5</span>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
            <div className="flex gap-6">
              <NavItem view="LANDING" label="Dashboard" />
              <NavItem view="TRAINING" label="Academy" />
              <NavItem view="REPORT" label="AI Reporter" />
            </div>

            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

            {/* AI Intelligence Variant Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
              <button 
                onClick={() => setModelVariant('gemini-3-flash-preview')}
                className={`px-4 py-1.5 rounded-xl text-[11px] font-black transition-all ${modelVariant === 'gemini-3-flash-preview' ? 'bg-white text-emerald-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                FLASH
              </button>
              <button 
                onClick={() => setModelVariant('gemini-3-pro-preview')}
                className={`px-4 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center gap-1 ${modelVariant === 'gemini-3-pro-preview' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                PRO
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!hasKey && (
              <button 
                onClick={handleOpenKeyDialog}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-xs font-black rounded-xl border border-amber-200 hover:bg-amber-100 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>
                Configure AI
              </button>
            )}
            {isLoggedIn ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900">Green Warrior</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">{userRole}</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-white border-2 border-emerald-500 p-0.5 shadow-md">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} className="w-full h-full rounded-xl" alt="User" />
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentView('LOGIN')}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Join Movement
              </button>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* API Warning for Deployed States */}
        {!hasKey && (
          <div className="mb-12 p-6 bg-white border-2 border-amber-200 rounded-3xl shadow-xl shadow-amber-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-black text-slate-900 mb-1">AI Setup Required</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  To use the Vision Scanner and Pro reasoning, you must connect a paid Gemini API key. 
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-amber-600 font-bold ml-1 hover:underline">Read billing docs</a>.
                </p>
              </div>
              <button 
                onClick={handleOpenKeyDialog}
                className="px-8 py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-200"
              >
                Configure Now
              </button>
            </div>
          </div>
        )}

        {/* Role Variant Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-2">
            <button 
              onClick={() => setUserRole('CITIZEN')}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${userRole === 'CITIZEN' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Citizen View
            </button>
            <button 
              onClick={() => setUserRole('MUNICIPAL_WORKER')}
              className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${userRole === 'MUNICIPAL_WORKER' ? 'bg-slate-900 text-white shadow-lg shadow-slate-300' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Municipal View
            </button>
          </div>
        </div>

        {currentView === 'LANDING' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="mb-16 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-[11px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Intelligence Variant: {modelVariant === 'gemini-3-pro-preview' ? 'Deep Pro' : 'Light Flash'}
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
                  Towards a <span className="text-emerald-600">Zero-Waste</span> India.
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl leading-relaxed font-medium">
                  {userRole === 'CITIZEN' 
                    ? "Empowering households to master source segregation and home composting. Every scrap counts in our national journey."
                    : "Optimizing logistics and monitoring infrastructure. Real-time dashboards for India's environmental front-liners."}
                </p>
                <div className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => setCurrentView('TRAINING')}
                    className="px-8 py-5 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 hover:-translate-y-1 transition-all shadow-2xl shadow-emerald-200 flex items-center gap-3"
                  >
                    Start Mastery Training
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="px-8 py-5 bg-white text-slate-900 font-bold rounded-2xl border-2 border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                    View Local Facilities
                  </button>
                </div>
              </div>
              <div className="w-full lg:w-[400px]">
                <WasteOverview />
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <TrainingHub />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-indigo-600 rounded-3xl text-white shadow-2xl shadow-indigo-200">
                      <h4 className="text-2xl font-black mb-4 tracking-tight">The Pro Advantage</h4>
                      <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                        Switching to the <strong>Pro Variant</strong> enables complex reasoning for waste-to-energy calculations and policy interpretation.
                      </p>
                      <button 
                        onClick={() => setModelVariant(modelVariant === 'gemini-3-pro-preview' ? 'gemini-3-flash-preview' : 'gemini-3-pro-preview')}
                        className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all"
                      >
                        {modelVariant === 'gemini-3-pro-preview' ? 'Active: Pro Intelligence' : 'Unlock Pro Reasoning'}
                      </button>
                   </div>
                   <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Live Statistics</h4>
                      <p className="text-slate-500 text-sm mb-6">Daily processing metrics across major ULBs.</p>
                      <div className="space-y-4">
                        {[
                          { label: 'Indore', val: '100%', color: 'bg-emerald-500' },
                          { label: 'Surat', val: '92%', color: 'bg-emerald-400' },
                          { label: 'Navi Mumbai', val: '88%', color: 'bg-emerald-300' },
                        ].map((city) => (
                          <div key={city.label}>
                            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-1">
                              <span>{city.label}</span>
                              <span>{city.val}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`${city.color} h-full transition-all duration-1000`} style={{ width: city.val }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
              <div className="space-y-8">
                <AIConsultant model={modelVariant} />
                <ReportWaste model={modelVariant} />
              </div>
            </div>
          </div>
        )}

        {currentView === 'TRAINING' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
             <div className="bg-emerald-600 p-12 rounded-[40px] text-white mb-12 relative overflow-hidden shadow-2xl shadow-emerald-200">
                <div className="relative z-10">
                  <h2 className="text-4xl font-black mb-4 tracking-tighter">Certified Green Academy</h2>
                  <p className="text-emerald-50 text-lg opacity-80 max-w-xl font-medium">Complete certified modules to earn your 'Green Champion' status and unlock local tax benefits.</p>
                </div>
                <div className="absolute top-0 right-0 p-12 opacity-10">
                  <svg className="w-64 h-64" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
                  </svg>
                </div>
             </div>
             <TrainingHub />
          </div>
        )}

        {currentView === 'REPORT' && (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Neural Vision Reporting</h2>
                <p className="text-slate-500 max-w-2xl mx-auto font-medium">Using {modelVariant.includes('pro') ? 'Advanced Pro' : 'Flash'} Vision models to identify and geotag municipal issues in milliseconds.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <ReportWaste model={modelVariant} />
                   <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                      <p className="text-amber-800 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                        Pro-Tip
                      </p>
                      <p className="text-amber-900 text-sm leading-relaxed">
                        The <strong>Pro Model</strong> can identify smaller, contaminated items better than the Flash model. Use Pro for complex mixed-waste identification.
                      </p>
                   </div>
                </div>
                <div className="space-y-8">
                   <AIConsultant model={modelVariant} />
                   <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-200"></span>
                        Reporting Process
                      </h4>
                      <div className="space-y-8">
                        {[
                          { step: '01', title: 'Capture', desc: 'Take a clear photo of the waste or issue.' },
                          { step: '02', title: 'Verify', desc: 'AI analyzes and suggests the waste category.' },
                          { step: '03', title: 'Deploy', desc: 'Municipal team is dispatched via GPS coordinates.' },
                        ].map((item) => (
                          <div key={item.step} className="flex gap-4">
                            <span className="text-2xl font-black text-slate-200">{item.step}</span>
                            <div>
                              <p className="font-bold text-slate-800">{item.title}</p>
                              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 py-16 px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                   <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M7 19h10v-2H7v2zm10-7l-1.41-1.41L13 13.17V4h-2v9.17l-2.58-2.58L7 12l5 5 5-5z" /></svg>
                </div>
                <h1 className="text-xl font-black text-slate-900">CleanIndia</h1>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Transforming India's landscape through digital governance and AI-powered community action.
              </p>
            </div>
            <div>
              <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Explore</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-emerald-600">Action Dashboard</a></li>
                <li><a href="#" className="hover:text-emerald-600">Green Academy</a></li>
                <li><a href="#" className="hover:text-emerald-600">AI Reporter</a></li>
                <li><a href="#" className="hover:text-emerald-600">Facility Map</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Transparency</h5>
              <ul className="space-y-4 text-sm font-bold text-slate-500">
                <li><a href="#" className="hover:text-emerald-600">Monthly Reports</a></li>
                <li><a href="#" className="hover:text-emerald-600">Budget Allocation</a></li>
                <li><a href="#" className="hover:text-emerald-600">Policy Updates</a></li>
                <li><a href="#" className="hover:text-emerald-600">Open Data API</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-6">Stay Connected</h5>
              <p className="text-slate-500 text-xs mb-4">Get notified about local clean-up drives.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Your Email" className="bg-slate-100 border-none rounded-xl px-4 py-3 text-xs w-full outline-none focus:ring-2 focus:ring-emerald-500" />
                <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <p>© 2025 CleanIndia Action Hub. Unified Waste Governance.</p>
            <div className="flex gap-8">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Context Actions */}
      <div className="lg:hidden fixed bottom-24 right-4 z-50 flex flex-col gap-2">
        {!hasKey && (
          <button 
            onClick={handleOpenKeyDialog}
            className="p-4 rounded-full bg-amber-500 text-white shadow-2xl animate-bounce"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z" clipRule="evenodd" /></svg>
          </button>
        )}
        <button 
          onClick={() => setModelVariant(modelVariant === 'gemini-3-pro-preview' ? 'gemini-3-flash-preview' : 'gemini-3-pro-preview')}
          className={`p-4 rounded-full shadow-2xl flex items-center gap-2 text-white font-black text-[10px] transition-all ${modelVariant.includes('pro') ? 'bg-indigo-600' : 'bg-emerald-600'}`}
        >
          {modelVariant.includes('pro') ? 'PRO' : 'FLASH'}
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.477.859h4z"></path></svg>
        </button>
      </div>

      {/* Mobile Nav */}
      <div className="lg:hidden sticky bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex gap-2 z-50">
        <button onClick={() => setCurrentView('REPORT')} className="flex-1 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-200 active:scale-95 transition-transform">
          Report
        </button>
        <button onClick={() => setCurrentView('TRAINING')} className="flex-1 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-transform">
          Training
        </button>
      </div>
    </div>
  );
};

export default App;
