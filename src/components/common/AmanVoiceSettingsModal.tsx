import React, { useState, useEffect } from 'react';
import { 
  speechEngine, 
  VoicePersona, 
  SpeechRate, 
  AutoVoiceMode,
  VoiceInfo 
} from '../../utils/speechEngine';
import { 
  Volume2, 
  VolumeX, 
  Sliders, 
  Radio, 
  Sparkles, 
  Play, 
  Square, 
  Check, 
  X, 
  Shield, 
  Bell, 
  Cpu, 
  Mic
} from 'lucide-react';

interface AmanVoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmanVoiceSettingsModal: React.FC<AmanVoiceSettingsModalProps> = ({ isOpen, onClose }) => {
  const [persona, setPersona] = useState<VoicePersona>(speechEngine.getPersona());
  const [rate, setRate] = useState<SpeechRate>(speechEngine.getRate());
  const [autoVoice, setAutoVoice] = useState<AutoVoiceMode>(speechEngine.getAutoVoiceMode());
  const [soundFx, setSoundFx] = useState<boolean>(speechEngine.isSoundFxEnabled());
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(speechEngine.getVoiceURI());
  const [availableVoices, setAvailableVoices] = useState<VoiceInfo[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  // Custom User-Owned Project Voice Settings
  const [customVoiceEnabled, setCustomVoiceEnabled] = useState<boolean>(() => {
    return localStorage.getItem('mcl_custom_voice_enabled') === 'true';
  });
  const [customVoiceConsent, setCustomVoiceConsent] = useState<boolean>(() => {
    return localStorage.getItem('mcl_custom_voice_consent') === 'true';
  });

  useEffect(() => {
    if (isOpen) {
      setPersona(speechEngine.getPersona());
      setRate(speechEngine.getRate());
      setAutoVoice(speechEngine.getAutoVoiceMode());
      setSoundFx(speechEngine.isSoundFxEnabled());
      setSelectedVoiceURI(speechEngine.getVoiceURI());
      setAvailableVoices(speechEngine.getAvailableVoices());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCustomVoiceToggle = (enabled: boolean) => {
    if (enabled && !customVoiceConsent) {
      // Need explicit consent first
      return;
    }
    setCustomVoiceEnabled(enabled);
    localStorage.setItem('mcl_custom_voice_enabled', String(enabled));
  };

  const handleConsentToggle = (consent: boolean) => {
    setCustomVoiceConsent(consent);
    localStorage.setItem('mcl_custom_voice_consent', String(consent));
    if (!consent) {
      setCustomVoiceEnabled(false);
      localStorage.setItem('mcl_custom_voice_enabled', 'false');
    }
  };

  const handlePersonaSelect = (p: VoicePersona) => {
    setPersona(p);
    speechEngine.setPersona(p);
    // Clear custom URI if changing preset persona
    speechEngine.setVoiceURI('');
    setSelectedVoiceURI('');
  };

  const handleRateSelect = (r: SpeechRate) => {
    setRate(r);
    speechEngine.setRate(r);
  };

  const handleAutoVoiceSelect = (mode: AutoVoiceMode) => {
    setAutoVoice(mode);
    speechEngine.setAutoVoiceMode(mode);
  };

  const handleSoundFxToggle = () => {
    const next = !soundFx;
    setSoundFx(next);
    speechEngine.setSoundFxEnabled(next);
    if (next) {
      speechEngine.playChime('radio_on');
    }
  };

  const handleVoiceURISelect = (uri: string) => {
    setSelectedVoiceURI(uri);
    speechEngine.setVoiceURI(uri);
  };

  const handleTestVoice = () => {
    if (isPlayingTest) {
      speechEngine.stop();
      setIsPlayingTest(false);
      return;
    }

    let sampleText = "Welcome to MY CYBER LAB. I am AMAN, your Senior AI Cybersecurity Instructor. All training systems, simulated terminals, and defensive cyber-ranges are initialized and ready for your tactical command.";
    
    if (persona === 'hinglish_mentor') {
      sampleText = "Namaste Operator! Main hoon AMAN, aapka senior cybersecurity mentor. Hum real-world labs, simulated terminals, aur live hands-on practice se aapko zero se professional banayenge. Let's start!";
    } else if (persona === 'cyber_commander') {
      sampleText = "Operator, this is AMAN Commander. Red Team threat signatures detected in sector 4. Review the packet capture in Wireshark and prepare the firewall rules.";
    }

    setIsPlayingTest(true);
    speechEngine.speak(sampleText, {
      persona,
      rate,
      voiceURI: selectedVoiceURI,
      onStart: () => setIsPlayingTest(true),
      onEnd: () => setIsPlayingTest(false),
      onError: () => setIsPlayingTest(false),
    });
  };

  const personas: { id: VoicePersona; label: string; tag: string; desc: string; icon: string }[] = [
    {
      id: 'tactical_instructor',
      label: 'Tactical Senior Instructor',
      tag: 'Default Profile',
      desc: 'Balanced, authoritative, high-clarity voice optimized for technical cybersecurity instruction.',
      icon: '🛡️'
    },
    {
      id: 'hinglish_mentor',
      label: 'Hinglish / Indian Cyber Mentor',
      tag: 'Bilingual Natural',
      desc: 'Warm, natural Indian English & Hindi bilingual pronunciation for smooth conversational guidance.',
      icon: '🇮🇳'
    },
    {
      id: 'cyber_commander',
      label: 'Cyber Range Commander',
      tag: 'SOC / CTF Focus',
      desc: 'Crisp, military-grade mission briefing cadence for high-intensity lab scenarios.',
      icon: '🎯'
    },
    {
      id: 'neural_auto',
      label: 'Dynamic Neural HD',
      tag: 'Auto-Select Best',
      desc: 'Automatically scans and uses the highest-fidelity natural cloud neural voice available on your system.',
      icon: '✨'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-mono font-bold text-sm text-slate-100 flex items-center gap-2">
                AMAN AI VOICE & AUDIO PROTOCOL
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/30">HD AUDIO</span>
              </h3>
              <p className="text-xs text-slate-400">Configure neural speech synthesis, personas, and tactical audio feedback</p>
            </div>
          </div>
          <button
            onClick={() => {
              speechEngine.stop();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Persona Selection */}
          <div>
            <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AMAN Voice Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSelect(p.id)}
                  className={`p-3 rounded-xl border text-left transition-all relative cursor-pointer ${
                    persona === p.id && !selectedVoiceURI
                      ? 'bg-cyan-950/50 border-cyan-400 ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-lg">{p.icon}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      persona === p.id && !selectedVoiceURI ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {p.tag}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-200">{p.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate Selection */}
          <div>
            <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Speech Cadence / Playback Speed
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  { id: 'slower', label: '0.8x Slow', desc: 'Detailed' },
                  { id: 'normal', label: '1.0x Normal', desc: 'Standard' },
                  { id: 'faster', label: '1.2x Fast', desc: 'Dynamic' },
                  { id: 'turbo', label: '1.45x Turbo', desc: 'Pro' },
                ] as { id: SpeechRate; label: string; desc: string }[]
              ).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleRateSelect(opt.id)}
                  className={`py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                    rate === opt.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono">{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* AMAN Auto Voice Protocol Setting */}
          <div>
            <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-cyan-400" />
              AMAN Proactive Auto Voice Trigger
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'important_moments', label: 'Important Moments', desc: 'Briefings & Debriefs' },
                  { id: 'always', label: 'Always On', desc: 'All Transitions' },
                  { id: 'manual', label: 'Manual Only', desc: 'Click to Speak' },
                  { id: 'off', label: 'Voice Muted', desc: 'Speech Disabled' },
                ] as { id: AutoVoiceMode; label: string; desc: string }[]
              ).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleAutoVoiceSelect(opt.id)}
                  className={`py-2 px-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    autoVoice === opt.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono">{opt.label}</div>
                  <div className="text-[10px] text-slate-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tactical Sound Effects Toggle */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                soundFx ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-400' : 'bg-slate-800 text-slate-500'
              }`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-200 font-mono">Tactical Audio Transceiver Cues</div>
                <div className="text-[11px] text-slate-400">Play radio mic activation clicks and frequency chimes</div>
              </div>
            </div>
            <button
              onClick={handleSoundFxToggle}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                soundFx ? 'bg-cyan-500' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-slate-950 absolute top-1 transition-transform ${
                  soundFx ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Advanced Hardware Voice Picker */}
          {availableVoices.length > 0 && (
            <div>
              <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                Advanced System / Neural Voice Override
              </label>
              <select
                value={selectedVoiceURI}
                onChange={(e) => handleVoiceURISelect(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="">-- Use Auto-Optimized Aman Voice Persona --</option>
                {availableVoices.map((v, i) => (
                  <option key={i} value={v.voiceURI}>
                    {v.name} ({v.lang}) {v.isNeural ? '★ Neural' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* User-Owned AMAN Voice Option */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                customVoiceEnabled ? 'bg-cyan-950 border border-cyan-500/40 text-cyan-400' : 'bg-slate-800 text-slate-500'
              }`}>
                <Mic className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-200 font-mono">User-Owned AMAN Voice Profile</div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                  Configure a custom local voice profile for your browser. This uses local speech synthesis and stores all configurations securely on your system.
                </p>
              </div>
            </div>

            {/* Explicit Consent Checkbox */}
            <label className="flex items-start gap-2.5 p-2 rounded bg-slate-900/60 border border-slate-850/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={customVoiceConsent}
                onChange={(e) => handleConsentToggle(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-[10px] text-slate-400 leading-normal">
                I explicitly consent to allow AMAN to utilize my system's custom voice synthesis. No voice data or audio samples are ever recorded or transmitted to any remote networks.
              </span>
            </label>

            {/* Voice Source Hierarchy Choices */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCustomVoiceToggle(false)}
                className={`flex-1 py-1.5 rounded-lg border text-center transition-all cursor-pointer font-mono text-[10px] uppercase font-bold ${
                  !customVoiceEnabled
                    ? 'bg-slate-900 border-slate-750 text-slate-200'
                    : 'bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-350'
                }`}
              >
                Default Voice Fallback
              </button>
              <button
                type="button"
                disabled={!customVoiceConsent}
                onClick={() => handleCustomVoiceToggle(true)}
                className={`flex-1 py-1.5 rounded-lg border text-center transition-all cursor-pointer font-mono text-[10px] uppercase font-bold ${
                  customVoiceEnabled
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-950/40 border-slate-850 text-slate-500 hover:text-slate-350 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                Custom Project Voice
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleTestVoice}
            className={`px-4 py-2 rounded-lg border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer ${
              isPlayingTest
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            {isPlayingTest ? (
              <>
                <Square className="w-3.5 h-3.5" />
                Stop Test Audio
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                Test AMAN Voice
              </>
            )}
          </button>

          <button
            onClick={() => {
              speechEngine.stop();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Apply & Save
          </button>
        </div>

      </div>
    </div>
  );
};
