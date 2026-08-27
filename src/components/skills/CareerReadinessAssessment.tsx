import React from 'react';
import { Award, Shield, CheckCircle2, ArrowRight, Zap, Target } from 'lucide-react';
import { getWeakestSkills } from '../../utils/aiSkillGraphEngine';

interface CareerReadinessAssessmentProps {
  roleTitle?: string;
  overallScore?: number;
}

export const CareerReadinessAssessment: React.FC<CareerReadinessAssessmentProps> = ({
  roleTitle = 'SOC Analyst (Tier 1)',
  overallScore = 78
}) => {
  const weakest = getWeakestSkills();

  const dimensions = [
    { label: 'Overall Readiness Rating', score: overallScore, color: 'bg-cyan-500' },
    { label: 'Technical Proficiency', score: 82, color: 'bg-emerald-500' },
    { label: 'Practical Hands-On Lab Skills', score: 75, color: 'bg-blue-500' },
    { label: 'Investigation & Log Triage', score: 70, color: 'bg-amber-500' },
    { label: 'Security Report Quality', score: 85, color: 'bg-purple-500' },
    { label: 'Scope Discipline & Ethics', score: 98, color: 'bg-emerald-400' },
    { label: 'Communication & Debriefing', score: 80, color: 'bg-indigo-500' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-slate-100 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            AI Career Diagnostic Engine
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-2">Career Readiness Assessment</h2>
          <p className="text-xs text-slate-400">Target Role: <span className="text-cyan-300 font-bold">{roleTitle}</span></p>
        </div>

        <div className="bg-slate-950 border border-cyan-900 px-6 py-3 rounded-2xl text-center">
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">Readiness Level</span>
          <span className="text-3xl font-extrabold text-white">{overallScore}%</span>
        </div>
      </div>

      {/* 7 Dimensions Bar Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Dimensions:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dimensions.map((dim, idx) => (
            <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">{dim.label}</span>
                <span className="font-mono text-cyan-400">{dim.score}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`${dim.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next 3 Skills to Improve */}
      <div className="p-4 bg-slate-950 border border-amber-950 rounded-xl space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4 text-amber-400" /> Your Next 3 Skills to Improve:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {weakest.map((sk, idx) => (
            <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Priority {idx + 1}</span>
              <h4 className="text-sm font-bold text-white">{sk.name}</h4>
              <p className="text-xs text-rose-400 font-mono">Current Score: {sk.score}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
