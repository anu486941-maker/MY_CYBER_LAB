import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ShieldAlert, 
  Layers, 
  Award, 
  Compass, 
  Terminal,
  Clock,
  Target,
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { speechEngine } from '../../utils/speechEngine';

export interface PathBriefingData {
  type: 'PATH_START' | 'PATH_TRANSITION' | 'CAPSTONE_PREP' | 'PATH_DEBRIEF';
  title: string;
  subtitle?: string;
  pathName: string;
  nextPathName?: string;
  whyItMatters: string;
  whyHinglish?: string;
  prerequisitesMet?: string[];
  keyCompetencies: string[];
  firstActionLabel?: string;
  firstActionLink?: string;
  estimatedMinutes?: number;
}

interface AmanPathBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PathBriefingData | null;
}

export const AmanPathBriefingModal: React.FC<AmanPathBriefingModalProps> = ({ isOpen, onClose, data }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && data && speechEngine.shouldAutoSpeak('important_moments')) {
      const speechText = `${data.title}. ${data.whyItMatters}`;
      speechEngine.speak(speechText, {
        playChime: true
      });
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const isCapstone = data.type === 'CAPSTONE_PREP';
  const isTransition = data.type === 'PATH_TRANSITION';
  const isDebrief = data.type === 'PATH_DEBRIEF';

  const handleAction = () => {
    speechEngine.stop();
    onClose();
    if (data.firstActionLink) {
      navigate(data.firstActionLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className={`bg-slate-900 border rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative overflow-hidden ${
        isCapstone 
          ? 'border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]'
          : isTransition
          ? 'border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.2)]'
          : 'border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.2)]'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg ${
            isCapstone
              ? 'bg-purple-950 border-purple-500/40 text-purple-400'
              : isTransition
              ? 'bg-indigo-950 border-indigo-500/40 text-indigo-400'
              : 'bg-cyan-950 border-cyan-500/40 text-cyan-400'
          }`}>
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border bg-slate-950 text-cyan-400 border-cyan-500/30">
                {data.type.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-slate-400">AMAN INSTRUCTOR BRIEFING</span>
            </div>
            <h2 className="text-xl font-mono font-bold text-white mt-1">
              {data.title}
            </h2>
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-5">
          {/* Why It Matters */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" /> STRATEGIC OBJECTIVE & REASONING
            </div>
            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              {data.whyItMatters}
            </p>
            {data.whyHinglish && (
              <p className="text-xs text-cyan-300/90 font-sans italic border-t border-slate-900 pt-2">
                💬 {data.whyHinglish}
              </p>
            )}
          </div>

          {/* Key Competencies or Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-cyan-400" /> KEY COMPETENCIES
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {data.keyCompetencies.map((comp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {data.prerequisitesMet && data.prerequisitesMet.length > 0 ? (
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> PREREQUISITES VERIFIED
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {data.prerequisitesMet.map((prereq, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-400" /> ESTIMATED COMMITMENT
                </div>
                <div className="text-sm font-mono text-cyan-300 font-bold">
                  {data.estimatedMinutes || 25} Minutes
                </div>
                <p className="text-xs text-slate-400">
                  Includes hands-on terminal tasks and concept verification checkpoints.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-5 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-mono border border-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            Review Later
          </button>

          <button
            onClick={handleAction}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isCapstone
                ? 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            }`}
          >
            {data.firstActionLabel || 'START NOW'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
