import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

interface PlatformFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformFeedbackModal: React.FC<PlatformFeedbackModalProps> = ({ isOpen, onClose }) => {
  const [whatHappened, setWhatHappened] = useState('');
  const [whatTried, setWhatTried] = useState('');
  const [amanHelpful, setAmanHelpful] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [useAgain, setUseAgain] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setWhatHappened('');
        setWhatTried('');
        setAmanHelpful(null);
        setDifficulty(null);
        setUseAgain(null);
        onClose();
      }, 2000);
    }, 800);
  };

  const RadioGroup = ({ 
    label, 
    options, 
    value, 
    onChange 
  }: { 
    label: string; 
    options: string[]; 
    value: string | null; 
    onChange: (val: string) => void; 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-300">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label 
            key={opt}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
              value === opt 
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
            }`}
          >
            <input 
              type="radio" 
              name={label} 
              value={opt} 
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="hidden"
            />
            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${value === opt ? 'border-cyan-400' : 'border-slate-500'}`}>
              {value === opt && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </div>
            <span className="text-sm font-medium">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Feedback</h2>
              <p className="text-xs text-slate-400 font-mono">Help improve MY CYBER LAB</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-pulse" />
              <div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">Feedback Sent</h3>
                <p className="text-slate-400">Thank you for helping us improve MY CYBER LAB.</p>
              </div>
            </div>
          ) : (
            <form id="feedback-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  What happened?
                </label>
                <textarea 
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all min-h-[80px] resize-y"
                  placeholder="Describe your experience or issue..."
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  What were you trying to do?
                </label>
                <textarea 
                  value={whatTried}
                  onChange={(e) => setWhatTried(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all min-h-[80px] resize-y"
                  placeholder="E.g., I was trying to complete the Linux Lab..."
                  required
                />
              </div>

              <RadioGroup 
                label="Was AMAN helpful?"
                options={['Yes', 'Partially', 'No']}
                value={amanHelpful}
                onChange={setAmanHelpful}
              />

              <RadioGroup 
                label="Difficulty:"
                options={['Too Easy', 'Good', 'Too Hard']}
                value={difficulty}
                onChange={setDifficulty}
              />

              <RadioGroup 
                label="Would you use MY CYBER LAB again?"
                options={['Yes', 'Maybe', 'No']}
                value={useAgain}
                onChange={setUseAgain}
              />

            </form>
          )}
        </div>

        {/* Footer */}
        {!isSuccess && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-mono text-sm font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              form="feedback-form"
              disabled={isSubmitting || !whatHappened.trim() || !whatTried.trim() || !amanHelpful || !difficulty || !useAgain}
              className="px-5 py-2 rounded-lg font-mono text-sm font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              SUBMIT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
