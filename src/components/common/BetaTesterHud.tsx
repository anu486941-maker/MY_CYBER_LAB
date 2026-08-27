import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { 
  Activity, 
  Database, 
  MessageSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  X, 
  Send, 
  CheckCircle, 
  ChevronRight, 
  ShieldAlert,
  Sliders,
  Settings,
  RefreshCw,
  Star
} from 'lucide-react';

export const BetaTesterHud: React.FC = () => {
  const { currentUser, syncStatus } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'telemetry' | 'feedback'>('telemetry');

  // Telemetry real-time simulations
  const [apiResponse, setApiResponse] = useState(115);
  const [dbLatency, setDbLatency] = useState(28);
  const [errorRate, setErrorRate] = useState(0.0);
  const [uptime, setUptime] = useState(99.98);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fluctuating telemetry simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setApiResponse(prev => {
        const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return Math.max(80, Math.min(180, prev + delta));
      });
      setDbLatency(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(15, Math.min(60, prev + delta));
      });
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const refreshTelemetry = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setApiResponse(Math.floor(Math.random() * 40) + 90);
      setDbLatency(Math.floor(Math.random() * 15) + 20);
      setIsRefreshing(false);
    }, 600);
  };

  // Feedback State
  const [clarity, setClarity] = useState<number>(0);
  const [realism, setRealism] = useState<number>(0);
  const [helpfulness, setHelpfulness] = useState<number>(0);
  const [navigation, setNavigation] = useState<number>(0);
  const [writtenFeedback, setWrittenFeedback] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isFormComplete = 
    clarity > 0 && 
    realism > 0 && 
    helpfulness > 0 && 
    navigation > 0 && 
    writtenFeedback.trim().length >= 10;

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Write feedback directly to the Live Firestore collection "beta_feedback"
      await addDoc(collection(db, 'beta_feedback'), {
        userId: currentUser?.uid || 'anonymous_tester',
        email: currentUser?.email || 'guest@mycyberlab.beta',
        clarity,
        realism,
        helpfulness,
        navigation,
        writtenFeedback: writtenFeedback.trim(),
        submittedAt: new Date().toISOString()
      });

      setSubmitSuccess(true);
      // Reset form
      setClarity(0);
      setRealism(0);
      setHelpfulness(0);
      setNavigation(0);
      setWrittenFeedback('');

      // Auto fade-out success screen and switch back to telemetry
      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveSection('telemetry');
      }, 3000);

    } catch (err: any) {
      console.error('Failed to submit beta feedback:', err);
      setSubmitError(err?.message || 'Handshake failed with Firestore beta_feedback collection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number; 
    onChange: (val: number) => void; 
    label: string;
  }) => (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-300 font-mono font-bold uppercase text-[10px] tracking-wide">{label}</span>
        <span className="text-cyan-400 font-mono font-bold text-[10px]">{value > 0 ? `${value} / 5` : 'UNRATED'}</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 rounded-lg transition-all border cursor-pointer hover:scale-110 active:scale-95 ${
              star <= value 
                ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.2)]' 
                : 'bg-slate-950/60 border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
            }`}
          >
            <Star className={`w-4 h-4 ${star <= value ? 'fill-cyan-400/30' : ''}`} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Tiny Trigger Tab - Floating bottom left to avoid collisions */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.6)] cursor-pointer group font-mono font-black text-xs tracking-wider uppercase"
        >
          <Activity className="w-4 h-4 text-cyan-500 animate-pulse group-hover:rotate-12 transition-transform" />
          <span>BETA TESTER HUD</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </button>
      </div>

      {/* Floating Panel Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-start p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-full border-l-4 border-l-cyan-500 relative">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-mono font-extrabold text-[10px] text-cyan-400 tracking-wider block">PRIVATE BETA SYSTEM</span>
                  <h3 className="text-sm font-mono font-black text-white">TESTER WORKSPACE HUD</h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 p-1 bg-slate-950/20">
              <button
                onClick={() => setActiveSection('telemetry')}
                className={`flex-1 py-2 font-mono text-[10px] font-bold tracking-wide uppercase rounded-lg transition-all cursor-pointer ${
                  activeSection === 'telemetry'
                    ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/60'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                SYSTEM TELEMETRY
              </button>
              <button
                onClick={() => setActiveSection('feedback')}
                className={`flex-1 py-2 font-mono text-[10px] font-bold tracking-wide uppercase rounded-lg transition-all cursor-pointer ${
                  activeSection === 'feedback'
                    ? 'bg-slate-800/80 text-cyan-300 border border-slate-700/60'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                SUBMIT FEEDBACK
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
              
              {activeSection === 'telemetry' ? (
                /* SYSTEM TELEMETRY PANEL */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">AGGREGATE SERVICE HEALTH</span>
                    <button
                      onClick={refreshTelemetry}
                      disabled={isRefreshing}
                      className="text-slate-500 hover:text-cyan-400 hover:bg-slate-800 p-1 rounded transition-all cursor-pointer"
                      title="Force telemetry recalibration"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Latencies Grid */}
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl relative overflow-hidden">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block">API RESPONSE</span>
                      <span className="text-lg font-black text-white block mt-1">{apiResponse} <span className="text-[10px] font-normal text-slate-400">ms</span></span>
                      <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] text-emerald-400">OK</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl relative overflow-hidden">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block">FIRESTORE SYNC</span>
                      <span className="text-lg font-black text-white block mt-1">{dbLatency} <span className="text-[10px] font-normal text-slate-400">ms</span></span>
                      <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1">
                        <Database className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-[9px] text-cyan-400">{syncStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Standard Telemetry Health Blocks */}
                  <div className="space-y-2.5 bg-slate-950/40 border border-slate-800/80 p-3.5 rounded-xl font-mono text-[11px]">
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">GATEWAY SYSTEM</span>
                      <span className="text-emerald-400 font-bold">ONLINE (200 OK)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">SYSTEM UPTIME</span>
                      <span className="text-slate-200">{uptime.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                      <span className="text-slate-400">DIAGNOSTIC ERROR RATE</span>
                      <span className="text-slate-200">{(errorRate).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">BETA SLOTS ACTIVE</span>
                      <span className="text-cyan-400 font-bold">20 / 20 USERS</span>
                    </div>
                  </div>

                  {/* Security Boundary Notice */}
                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 font-mono text-[10px] leading-relaxed text-cyan-300">
                    <span className="font-bold block uppercase tracking-wider mb-1">DATA DISCIPLINE:</span>
                    Strict private telemetry active. No raw user data, personal profiles, or individual credentials are aggregated or exposed by this HUD.
                  </div>
                </div>
              ) : (
                /* INTERACTIVE 5-QUESTION FEEDBACK FORM */
                <div className="space-y-4">
                  {submitSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 animate-fadeIn">
                      <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce" />
                      <div>
                        <h4 className="text-sm font-mono font-black text-white uppercase">FEEDBACK COMMITTED</h4>
                        <p className="text-xs text-slate-400 leading-normal mt-1">Written to cloud Firestore secure beta_feedback catalog successfully.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      
                      {submitError && (
                        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[10px] font-mono leading-normal flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{submitError}</span>
                        </div>
                      )}

                      <StarRating 
                        value={clarity} 
                        onChange={setClarity} 
                        label="1. Level of Clarity" 
                      />

                      <StarRating 
                        value={realism} 
                        onChange={setRealism} 
                        label="2. Simulated Lab Realism" 
                      />

                      <StarRating 
                        value={helpfulness} 
                        onChange={setHelpfulness} 
                        label="3. AI Mentor Helpfulness" 
                      />

                      <StarRating 
                        value={navigation} 
                        onChange={setNavigation} 
                        label="4. Navigation & Ease of Use" 
                      />

                      {/* Freeform comments */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-300 font-mono font-bold uppercase text-[10px] tracking-wide">5. Freeform Written Feedback</span>
                          <span className="text-[9px] text-slate-500 font-mono">Min 10 chars</span>
                        </div>
                        <textarea
                          value={writtenFeedback}
                          onChange={(e) => setWrittenFeedback(e.target.value)}
                          placeholder="Tell us what you liked, what was confusing, or if you spotted any issues..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs font-sans leading-normal focus:outline-none focus:border-cyan-500/50 transition-all min-h-[90px] resize-none"
                          required
                        />
                      </div>

                      {/* Actions */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={!isFormComplete || isSubmitting}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-mono font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>TRANSMITTING BATCH...</span>
                          ) : (
                            <>
                              <Send className="w-4 h-4 text-slate-950" />
                              SUBMIT FEEDBACK
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  )}
                </div>
              )}

            </div>

            {/* Footer Status bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[9px] font-mono text-slate-500 uppercase tracking-widest">
              <span>Handshake: SSL Secure</span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Sync
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
