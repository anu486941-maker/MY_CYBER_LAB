import React, { useState } from 'react';
import { CyberLab, EvidenceItem } from '../types/incidentLab';
import { Network, Shield, Clock, AlertTriangle, FileText, CheckCircle, Terminal as TerminalIcon, Brain, Search, Lightbulb, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EvidenceLocker } from './labs/EvidenceLocker';

interface Props {
  currentLab: CyberLab;
}

type LabStep = 'briefing' | 'thinking' | 'investigation' | 'decision' | 'report' | 'score';

export const IncidentLabEngine: React.FC<Props> = ({ currentLab }) => {
  const { language, addXp } = useApp();
  
  const t = (text: string, hinglishText: string) => language === 'Hinglish' ? hinglishText : text;
  const [step, setStep] = useState<LabStep>('briefing');
  const [hypothesis, setHypothesis] = useState<string>('');
  const [findings, setFindings] = useState<string>('');
  
  // Evidence locker state
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(currentLab.evidenceLocker || []);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ command: string; output: string }>>([
    { command: 'banner', output: `=== MY CYBER LAB SECURE TERMINAL v5.0 ===\nConnected to virtual environment: ${currentLab.title}\nType 'help' for available investigation commands.` }
  ]);

  const handleAddEvidence = (item: EvidenceItem) => {
    setEvidenceList(prev => [...prev, item]);
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    let output = '';

    const lowerCmd = cmd.toLowerCase();
    if (lowerCmd === 'help') {
      output = 'Available commands: ls, pwd, cat <file>, grep <pattern> <file>, nmap <target>, whoami, id, history, clear';
    } else if (lowerCmd === 'ls') {
      output = 'evidence/\nlogs/\ntargets/\nREADME.md\nauth.log\nconfig.conf';
    } else if (lowerCmd === 'pwd') {
      output = '/home/analyst/lab-workspace';
    } else if (lowerCmd === 'whoami') {
      output = 'student_analyst@mycyberlab-sandbox';
    } else if (lowerCmd === 'id') {
      output = 'uid=1001(student_analyst) gid=1001(analysts) groups=1001(analysts),27(sudo)';
    } else if (lowerCmd === 'history') {
      output = terminalHistory.map((h, i) => `  ${i + 1}  ${h.command}`).join('\n');
    } else if (lowerCmd === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (lowerCmd.startsWith('cat ')) {
      const target = lowerCmd.replace('cat ', '').trim();
      if (target.includes('auth.log') || target.includes('log')) {
        output = '[08:42:15] Failed login for root from 192.168.1.100\n[08:42:18] Failed login for root from 192.168.1.100\n[08:44:02] Successful login for admin from 192.168.1.100 via SSH';
      } else if (target.includes('config')) {
        output = '# Insecure configuration file\nDB_HOST=localhost\nDB_PASS=admin123\nPERMISSIONS=777';
      } else {
        output = `Contents of ${target}:\n[SIMULATED VIRTUAL FILE CONTENT]\nArtifact discovered successfully.`;
      }
    } else if (lowerCmd.startsWith('nmap ')) {
      output = 'Starting Nmap scan...\nPORT 22/tcp open ssh\nPORT 80/tcp open http\nPORT 3306/tcp open mysql\nNmap done: 1 IP address (1 host up) scanned in 1.42 seconds.';
    } else {
      output = `Command executed: ${cmd}\nResult: Completed with code 0 (simulated environment output).`;
    }

    setTerminalHistory(prev => [...prev, { command: cmd, output }]);
    setTerminalInput('');
  };

  const renderBriefing = () => (
    <div className="space-y-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs px-2.5 py-1 bg-cyan-950 text-cyan-400 border border-cyan-800/50 rounded-full font-mono uppercase">
            Track: {currentLab.careerTrack}
          </span>
          <span className="text-xs px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800/50 rounded-full font-mono uppercase">
            Difficulty: {currentLab.difficulty}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{currentLab.title}</h2>
        <p className="text-sm text-slate-300 leading-relaxed mb-6">{currentLab.briefing}</p>
        
        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('Learning Objectives', 'Objectives')}</h4>
          <ul className="space-y-1.5">
            {currentLab.objectives.map((obj, i) => (
              <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={() => setStep('thinking')}
          className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-950/50 flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          {t('Begin Investigation: Stop & Think', 'Investigation Shuru Karo')}
        </button>
      </div>
    </div>
  );

  const renderThinking = () => (
    <div className="space-y-4">
        <div className="bg-slate-900 p-6 rounded-xl border border-amber-900/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
                <Brain className="w-6 h-6" />
                <h3 className="text-lg font-bold text-white">{t('Stop and Think — Formulate Hypothesis', 'Stop & Think: Apni Hypothesis Likho')}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('Before launching terminal tools, state what you believe is happening based on the briefing. A strong hypothesis guides effective investigation.', 'Terminal tools use karne se pehle apni hypothesis likho.')}
            </p>
            <textarea 
                className="w-full h-36 p-4 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                placeholder={t("What do you think happened? What indicators or vulnerabilities are present?", "Tumhe kya lagta hai kya ho raha hai?")}
                value={hypothesis}
                onChange={(e) => setHypothesis(e.target.value)}
            />
            <button 
              onClick={() => {
                if (hypothesis.trim().length > 5) {
                  setStep('investigation');
                } else {
                  alert(t('Please provide a detailed hypothesis before proceeding.', 'Kripya thodi detail mein hypothesis likhein.'));
                }
              }}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-amber-950/50"
            >
              <Search className="w-4 h-4" />
              {t('Confirm Hypothesis & Open Lab Terminal', 'Confirm Karo aur Terminal Kholo')}
            </button>
        </div>
    </div>
  );

  const renderInvestigation = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Terminal Workspace */}
        <div className="lg:col-span-2 bg-black p-4 rounded-xl border border-slate-800 font-mono text-xs text-green-400 flex flex-col h-[520px] shadow-xl">
            <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 text-slate-300">
                    <TerminalIcon className="w-4 h-4 text-green-400" /> 
                    <span>{t('Secure Lab Terminal', 'Secure Terminal')}</span>
                </div>
                <span className="text-[10px] text-slate-500">sandbox@my-cyber-lab</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-3">
              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <span className="text-cyan-500">student@lab:~$</span>
                    <span className="text-white">{item.command}</span>
                  </div>
                  <pre className="text-slate-300 whitespace-pre-wrap text-[11px] bg-slate-950 p-2 rounded border border-slate-900">
                    {item.output}
                  </pre>
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} className="flex gap-2 pt-2 border-t border-slate-900">
              <span className="text-cyan-500 self-center">student@lab:~$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                placeholder="Type command (e.g. ls, cat auth.log, nmap)..."
                className="flex-1 bg-transparent text-white focus:outline-none font-mono text-xs"
              />
              <button type="submit" className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white rounded text-xs">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
        </div>
        
        {/* Evidence & Timeline Sidebar */}
        <div className="space-y-4 flex flex-col">
            <EvidenceLocker
              evidenceList={evidenceList}
              onAddEvidence={handleAddEvidence}
              onRemoveEvidence={handleRemoveEvidence}
            />

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-1">
                <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-cyan-400" /> {t('Incident Timeline', 'Timeline')}
                </h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {currentLab.timelineEvents.map((ev, idx) => (
                    <div key={idx} className="flex gap-3 p-2 bg-slate-950 rounded border border-slate-800/60 text-xs">
                      <span className="font-mono text-cyan-400 font-semibold">{ev.time}</span>
                      <span className="text-slate-300">{ev.description}</span>
                    </div>
                  ))}
                </div>
            </div>
            
            <button 
              onClick={() => setStep('decision')}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              {t('Proceed to Incident Decision', 'Decision Lo')}
            </button>
        </div>
    </div>
  );

  const renderDecision = () => (
    <div className="bg-slate-900 p-6 rounded-xl border border-amber-900/30 max-w-2xl mx-auto space-y-6 shadow-xl">
      <div className="flex items-center gap-2 text-amber-400">
        <AlertTriangle className="w-6 h-6" />
        <h3 className="text-lg font-bold text-white">{t('Investigation Decision Point', 'Decision Point')}</h3>
      </div>
      {currentLab.decisionPoints.map((dp) => (
        <div key={dp.id} className="space-y-4">
          <p className="text-sm text-slate-200 font-medium leading-relaxed">{dp.scenario}</p>
          <div className="grid gap-3">
            {dp.options.map((opt) => (
              <button 
                key={opt.id} 
                onClick={() => setStep('report')} 
                className="text-xs p-4 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-xl transition text-left text-slate-300 hover:text-white flex items-center justify-between group"
              >
                <span>{opt.text}</span>
                <span className="text-[10px] text-slate-500 group-hover:text-amber-400 font-mono">Select →</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderReport = () => (
      <div className="space-y-4 bg-slate-900 p-6 rounded-xl border border-slate-800 max-w-2xl mx-auto shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="text-cyan-400" />
            {t('Final Incident / Assessment Report', 'Incident Report likho')}
          </h3>
          <p className="text-xs text-slate-400">
            {t('Summarize your findings, identified indicators of compromise (IOCs), root cause, and remediation steps.', 'Apni findings aur root cause summarize karo.')}
          </p>
          <textarea 
            className="w-full h-44 p-4 bg-slate-950 text-slate-200 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
            placeholder={t("Executive Summary:\nRoot Cause:\nEvidence Cited:\nRemediation Recommendation...", "Report yahan likhein...")}
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
          />
          <button 
            onClick={() => setStep('score')}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {t('Submit Investigation Report', 'Report Submit Karo')}
          </button>
      </div>
  );

  const renderScore = () => (
      <div className="bg-slate-900 border border-emerald-900/50 rounded-xl p-8 text-center max-w-lg mx-auto space-y-6 shadow-xl">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <div>
            <h3 className="text-2xl font-bold text-white">{t('Investigation Successfully Completed!', 'Investigation Complete!')}</h3>
            <p className="text-xs text-slate-400 mt-1">{currentLab.title}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-800">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">SCORE</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">92/100</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">EVIDENCE</span>
              <span className="text-lg font-bold text-cyan-400 font-mono">{evidenceList.length} Items</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">XP EARNED</span>
              <span className="text-lg font-bold text-amber-400 font-mono">+{currentLab.xp}</span>
            </div>
          </div>

          <button 
            onClick={() => {
              addXp(currentLab.xp, `Completed lab: ${currentLab.title}`);
              alert(t('XP claimed successfully and progress saved!', 'XP successfully claim ho gaya!'));
            }} 
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-cyan-950/50 transition"
          >
            {t('Claim XP & Return to Cyber Range', 'Claim XP & Return')}
          </button>
      </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur px-6 py-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase">{currentLab.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {['briefing', 'thinking', 'investigation', 'decision', 'report', 'score'].map((s, idx) => (
            <div 
              key={s} 
              className={`text-[10px] px-2.5 py-1 rounded-full font-mono uppercase transition ${
                step === s ? 'bg-cyan-600 text-white font-bold shadow' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {idx + 1}. {s}
            </div>
          ))}
        </div>
      </div>

      {step === 'briefing' && renderBriefing()}
      {step === 'thinking' && renderThinking()}
      {step === 'investigation' && renderInvestigation()}
      {step === 'decision' && renderDecision()}
      {step === 'report' && renderReport()}
      {step === 'score' && renderScore()}
    </div>
  );
};
