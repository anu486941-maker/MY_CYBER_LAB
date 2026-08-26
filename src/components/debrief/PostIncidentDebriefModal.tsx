import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowRight,
  Send,
  X,
  FileText,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { IncidentState, generatePostIncidentDebrief } from '../../utils/incidentStateEngine';

interface PostIncidentDebriefModalProps {
  state: IncidentState;
  onClose: () => void;
}

export const PostIncidentDebriefModal: React.FC<PostIncidentDebriefModalProps> = ({
  state,
  onClose
}) => {
  const debrief = generatePostIncidentDebrief(state);
  const [socraticChat, setSocraticChat] = useState<Array<{ role: 'AMAN' | 'USER'; text: string }>>([
    {
      role: 'AMAN',
      text: `Congratulations on completing Incident ${state.incidentId}! You achieved Grade ${state.score.grade} with a total score of ${state.score.totalScore}/100. What was the most critical piece of evidence that validated your vulnerability hypothesis?`
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');
    setSocraticChat(prev => [...prev, { role: 'USER', text: userText }]);

    setTimeout(() => {
      setSocraticChat(prev => [
        ...prev,
        {
          role: 'AMAN',
          text: `Excellent insight regarding "${userText.substring(0, 40)}...". Reflecting on the Blue Team remediation cycle: How did applying the WAF security rule alter the target's HTTP response code and prevent further database exfiltration?`
        }
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] p-6 rounded-2xl bg-slate-900 border border-purple-500/40 shadow-2xl space-y-5 overflow-y-auto custom-scrollbar font-mono text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              state.score.grade === 'S+' || state.score.grade === 'S'
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-purple-950/80 border-purple-500/50 text-purple-300'
            }`}>
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-bold uppercase">
                  POST-INCIDENT DEBRIEF & EXECUTIVE REPORT
                </span>
                <span className="text-xs text-slate-400">Incident Seed: {state.seed}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                Debrief & Performance Analysis — Grade {state.score.grade}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grade Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-blue-950/60 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold border shadow-xl ${
              state.score.grade === 'S+' ? 'bg-amber-950 text-amber-300 border-amber-500/60 shadow-amber-950/50' :
              state.score.grade === 'S' ? 'bg-purple-950 text-purple-300 border-purple-500/60 shadow-purple-950/50' :
              'bg-blue-950 text-blue-300 border-blue-500/60'
            }`}>
              {state.score.grade}
            </div>
            <div>
              <div className="text-xs text-slate-400 font-bold uppercase">Overall Performance Grade</div>
              <div className="text-xl font-extrabold text-slate-100">{state.score.totalScore} / 100 Points</div>
              <div className="text-xs text-purple-300">{state.score.breakdown.filter(b => b.points === b.maxPoints).length} / 10 Categories Maxed</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">Evidence Verified:</span>
              <p className="font-bold text-emerald-400">{debrief.evidenceQuality}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px]">MITRE Coverage:</span>
              <p className="font-bold text-purple-300">{debrief.mitreTechniques.join(', ') || 'T1190, T1548'}</p>
            </div>
          </div>
        </div>

        {/* 4 Quadrant Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Discovered */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4" />
              <span>WHAT YOU DISCOVERED</span>
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              {debrief.discovered.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Missed */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-amber-400 flex items-center gap-1.5 uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>WHAT YOU MISSED</span>
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              {debrief.missed.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Did Well */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-blue-400 flex items-center gap-1.5 uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>WHAT YOU DID WELL</span>
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              {debrief.didWell.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Recommended Modules */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h4 className="font-bold text-purple-400 flex items-center gap-1.5 uppercase">
              <BookOpen className="w-4 h-4" />
              <span>RECOMMENDED LEARNING MODULES</span>
            </h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              {debrief.recommendedModules.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Socratic AMAN Debrief Chat */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-purple-300 uppercase flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Socratic Post-Incident Conversation with AMAN</span>
          </h4>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 max-h-48 overflow-y-auto custom-scrollbar space-y-2 text-xs">
            {socraticChat.map((msg, idx) => (
              <div key={idx} className={`p-2.5 rounded-lg ${
                msg.role === 'AMAN' ? 'bg-purple-950/50 text-purple-200 border border-purple-500/30' : 'bg-slate-800 text-slate-200 ml-6'
              }`}>
                <span className="font-bold text-[10px] text-purple-400 block uppercase">{msg.role} Copilot</span>
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Reflect on your investigation strategy with AMAN..."
              className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Reflection</span>
            </button>
          </form>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Close & Lock Report in Evidence Locker
          </button>
        </div>
      </div>
    </div>
  );
};
