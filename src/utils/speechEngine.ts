/**
 * Advanced High-Fidelity Speech Engine for AMAN AI Senior Instructor.
 * Features:
 * - Multi-tier Neural/Natural voice prioritization (Edge Natural, Google Pro, Apple Siri, System)
 * - Curated Aman Voice Personas (Tactical Instructor, Cyber Commander, Hinglish Mentor, Fast Synth)
 * - Cyber-phonetic dictionary for accurate pronunciation of security acronyms & commands
 * - Tactical Web Audio transceiver chimes and radio telemetry cues
 * - Real-time state & waveform visualizer event stream
 * - Rate, pitch, and voice persistence in localStorage
 */

export type SpeechRate = 'slower' | 'normal' | 'faster' | 'turbo';
export type VoicePersona = 'tactical_instructor' | 'cyber_commander' | 'hinglish_mentor' | 'neural_auto';
export type AutoVoiceMode = 'always' | 'important_moments' | 'manual' | 'off';

export interface SpeechOptions {
  rate?: SpeechRate | number;
  pitch?: number;
  persona?: VoicePersona;
  voiceURI?: string;
  playChime?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface VoiceInfo {
  name: string;
  lang: string;
  voiceURI: string;
  isNeural: boolean;
  isIndianEnglish: boolean;
  isHindi: boolean;
  isNative: boolean;
}

class AmanSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSpeakingState = false;
  private isMutedState = false;
  private lastSpokenText = '';
  private currentRate: SpeechRate = 'normal';
  private currentPitch = 1.0;
  private currentVolume = 1.0;
  private soundFxEnabled = true;
  private selectedPersona: VoicePersona = 'tactical_instructor';
  private selectedVoiceURI: string = '';
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private listeners: Set<(speaking: boolean, level: number) => void> = new Set();
  private visualizerInterval: any = null;
  private audioCtx: AudioContext | null = null;

  private autoVoiceMode: AutoVoiceMode = 'important_moments';

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }

      // Load preferences
      try {
        const savedRate = localStorage.getItem('aman_voice_rate');
        if (savedRate) this.currentRate = savedRate as SpeechRate;
        const savedPersona = localStorage.getItem('aman_voice_persona');
        if (savedPersona) this.selectedPersona = savedPersona as VoicePersona;
        const savedVoiceURI = localStorage.getItem('aman_voice_uri');
        if (savedVoiceURI) this.selectedVoiceURI = savedVoiceURI;
        const savedSoundFx = localStorage.getItem('aman_voice_fx');
        if (savedSoundFx !== null) this.soundFxEnabled = savedSoundFx === 'true';
        const savedAutoVoice = localStorage.getItem('aman_auto_voice');
        if (savedAutoVoice) this.autoVoiceMode = savedAutoVoice as AutoVoiceMode;
      } catch (e) {
        // LocalStorage fallback
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.cachedVoices = this.synth.getVoices();
  }

  public getAvailableVoices(): VoiceInfo[] {
    if (this.cachedVoices.length === 0 && this.synth) {
      this.cachedVoices = this.synth.getVoices();
    }
    return this.cachedVoices.map(v => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      isNeural: v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('online') || v.name.toLowerCase().includes('premium'),
      isIndianEnglish: v.lang === 'en-IN' || v.name.toLowerCase().includes('india'),
      isHindi: v.lang === 'hi-IN' || v.lang.startsWith('hi'),
      isNative: v.localService ?? true,
    }));
  }

  public isAvailable(): boolean {
    return !!this.synth;
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState || (this.synth ? this.synth.speaking : false);
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public setMuted(muted: boolean) {
    this.isMutedState = muted;
    if (muted) {
      this.stop();
    }
  }

  public setRate(rate: SpeechRate) {
    this.currentRate = rate;
    try { localStorage.setItem('aman_voice_rate', rate); } catch (e) {}
  }

  public getRate(): SpeechRate {
    return this.currentRate;
  }

  public setPersona(persona: VoicePersona) {
    this.selectedPersona = persona;
    try { localStorage.setItem('aman_voice_persona', persona); } catch (e) {}
  }

  public getPersona(): VoicePersona {
    return this.selectedPersona;
  }

  public setVoiceURI(uri: string) {
    this.selectedVoiceURI = uri;
    try { localStorage.setItem('aman_voice_uri', uri); } catch (e) {}
  }

  public getVoiceURI(): string {
    return this.selectedVoiceURI;
  }

  public setSoundFxEnabled(enabled: boolean) {
    this.soundFxEnabled = enabled;
    try { localStorage.setItem('aman_voice_fx', String(enabled)); } catch (e) {}
  }

  public isSoundFxEnabled(): boolean {
    return this.soundFxEnabled;
  }

  public getAutoVoiceMode(): AutoVoiceMode {
    return this.autoVoiceMode;
  }

  public setAutoVoiceMode(mode: AutoVoiceMode) {
    this.autoVoiceMode = mode;
    try { localStorage.setItem('aman_auto_voice', mode); } catch (e) {}
  }

  public shouldAutoSpeak(eventImportance: 'always' | 'important_moments' | 'manual' = 'important_moments'): boolean {
    if (this.isMutedState || this.autoVoiceMode === 'off') return false;
    if (this.autoVoiceMode === 'always') return true;
    if (this.autoVoiceMode === 'important_moments') {
      return eventImportance === 'important_moments' || eventImportance === 'always';
    }
    return false;
  }

  public subscribeVisualizer(cb: (speaking: boolean, level: number) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notifyListeners(speaking: boolean, level: number) {
    this.listeners.forEach(cb => cb(speaking, level));
  }

  private startVisualizer() {
    this.stopVisualizer();
    this.visualizerInterval = setInterval(() => {
      if (!this.isSpeakingState) {
        this.stopVisualizer();
        return;
      }
      // Generate realistic randomized sound bar fluctuations for the visualizer
      const randLevel = Math.floor(Math.random() * 65) + 35;
      this.notifyListeners(true, randLevel);
    }, 90);
  }

  private stopVisualizer() {
    if (this.visualizerInterval) {
      clearInterval(this.visualizerInterval);
      this.visualizerInterval = null;
    }
    this.notifyListeners(false, 0);
  }

  /**
   * Synthesize a tactical audio chime using Web Audio API
   */
  public playChime(type: 'radio_on' | 'radio_off' | 'alert' | 'success' = 'radio_on') {
    if (!this.soundFxEnabled || typeof window === 'undefined') return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) this.audioCtx = new AudioContextClass();
      }
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'radio_on') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === 'radio_off') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.07);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (e) {
      // AudioContext restriction in iframe before user gesture
    }
  }

  private getNumericRate(rate: SpeechRate | number): number {
    if (typeof rate === 'number') return rate;
    switch (rate) {
      case 'slower': return 0.82;
      case 'turbo': return 1.45;
      case 'faster': return 1.22;
      case 'normal':
      default: return 1.02;
    }
  }

  /**
   * Cyber-Phonetic processor: makes cybersecurity terminology, acronyms,
   * markdown, and Linux commands sound natural and authentic.
   */
  public cleanTextForSpeech(text: string): string {
    let clean = text
      // Remove action directives [ACTION:...]
      .replace(/\[ACTION:[^\]]+\]/g, '')
      // Code blocks
      .replace(/```[\s\S]*?```/g, 'Code block omitted for voice.')
      .replace(/`([^`]+)`/g, '$1')
      // Markdown headings & bold/italics
      .replace(/#+\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Links & bullets
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/^[•*-]\s+/gm, '')
      // Acronyms & technical term phonetics
      .replace(/\bTCP\/IP\b/gi, 'T C P I P')
      .replace(/\bIPv4\b/gi, 'I P version 4')
      .replace(/\bIPv6\b/gi, 'I P version 6')
      .replace(/\bCIDR\b/gi, 'Cider')
      .replace(/\bSIEM\b/gi, 'Seem')
      .replace(/\bSOC\b/gi, 'Sock')
      .replace(/\bNmap\b/gi, 'N-map')
      .replace(/\bWireshark\b/gi, 'Wire shark')
      .replace(/\bchmod\b/gi, 'ch mod')
      .replace(/\bchown\b/gi, 'ch own')
      .replace(/\biptables\b/gi, 'I P tables')
      .replace(/\bCVE-(\d{4})-(\d+)/gi, 'C V E $1 $2')
      .replace(/\bSQLi\b/gi, 'S Q L injection')
      .replace(/\bXSS\b/gi, 'Cross Site Scripting')
      .replace(/\bCSRF\b/gi, 'Cross Site Request Forgery')
      .replace(/\bMITRE\b/gi, 'My-ter')
      .replace(/\bATT&CK\b/gi, 'Attack')
      .replace(/\bOSINT\b/gi, 'Oh-sint')
      .replace(/\bPCAP\b/gi, 'P-cap')
      .replace(/\bDNS\b/gi, 'D N S')
      .replace(/\bDHCP\b/gi, 'D H C P')
      .replace(/\bSSH\b/gi, 'S S H')
      .replace(/\bFTP\b/gi, 'F T P')
      .replace(/\bHTTP\b/gi, 'H T T P')
      .replace(/\bHTTPS\b/gi, 'H T T P S')
      .replace(/\bAPI\b/gi, 'A P I')
      .replace(/\bIDS\b/gi, 'I D S')
      .replace(/\bIPS\b/gi, 'I P S')
      .replace(/\bEDR\b/gi, 'E D R')
      // Clean spacing
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    return clean;
  }

  /**
   * Intelligently selects the best voice for the chosen Persona and available system voices.
   */
  private resolveBestVoice(): { voice: SpeechSynthesisVoice | null; pitch: number; rateMultiplier: number } {
    if (!this.synth) return { voice: null, pitch: 1.0, rateMultiplier: 1.0 };
    if (this.cachedVoices.length === 0) {
      this.cachedVoices = this.synth.getVoices();
    }
    const voices = this.cachedVoices;

    // Explicit URI match
    if (this.selectedVoiceURI) {
      const matched = voices.find(v => v.voiceURI === this.selectedVoiceURI);
      if (matched) {
        return { voice: matched, pitch: this.currentPitch, rateMultiplier: 1.0 };
      }
    }

    // Persona-based selection
    if (this.selectedPersona === 'hinglish_mentor') {
      // Prioritize Indian English & Hindi Neural voices
      const indianVoice = voices.find(v => (v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.lang === 'hi-IN') && (v.name.includes('Natural') || v.name.includes('Online')))
        || voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india') || v.lang === 'hi-IN')
        || voices.find(v => v.lang.startsWith('en'));
      return { voice: indianVoice || null, pitch: 1.0, rateMultiplier: 1.0 };
    }

    if (this.selectedPersona === 'cyber_commander') {
      // Authoritative, crisp US/UK English voice
      const commanderVoice = voices.find(v => (v.lang === 'en-GB' || v.lang === 'en-US') && (v.name.includes('Natural') || v.name.includes('Guy') || v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('Male')))
        || voices.find(v => v.lang === 'en-GB' || v.lang === 'en-US')
        || voices.find(v => v.lang.startsWith('en'));
      return { voice: commanderVoice || null, pitch: 0.95, rateMultiplier: 1.05 };
    }

    if (this.selectedPersona === 'tactical_instructor') {
      // Measured, deep, high-clarity voice
      const instructorVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Premium')) && v.lang.startsWith('en'))
        || voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Google US English') || v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Rishi'))
        || voices.find(v => v.lang === 'en-IN' || v.lang === 'en-US' || v.lang === 'en-GB')
        || voices.find(v => v.lang.startsWith('en'));
      return { voice: instructorVoice || null, pitch: 0.96, rateMultiplier: 1.0 };
    }

    // neural_auto: Pick the highest quality neural / natural voice available
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Online')) && v.lang.startsWith('en'))
      || voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'))
      || voices.find(v => v.lang.startsWith('en'))
      || voices[0] || null;

    return { voice: naturalVoice, pitch: 1.0, rateMultiplier: 1.0 };
  }

  /**
   * Speak a text string with AMAN's high-fidelity voice.
   */
  public speak(text: string, options: SpeechOptions = {}): boolean {
    if (!this.synth || this.isMutedState || !text) {
      return false;
    }

    // Cancel any previous speech
    this.stop();

    this.lastSpokenText = text;
    const cleanText = this.cleanTextForSpeech(text);
    if (!cleanText) return false;

    try {
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const { voice, pitch, rateMultiplier } = this.resolveBestVoice();
      
      if (voice) {
        utterance.voice = voice;
      }

      const targetRate = options.rate !== undefined ? options.rate : this.currentRate;
      utterance.rate = this.getNumericRate(targetRate) * rateMultiplier;
      utterance.pitch = options.pitch !== undefined ? options.pitch : pitch;
      utterance.volume = this.currentVolume;

      // Tactical chime
      if (options.playChime !== false && this.soundFxEnabled) {
        this.playChime('radio_on');
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
        this.startVisualizer();
        options.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.stopVisualizer();
        this.currentUtterance = null;
        if (this.soundFxEnabled) {
          this.playChime('radio_off');
        }
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeakingState = false;
        this.stopVisualizer();
        this.currentUtterance = null;
        options.onError?.(e);
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
      return true;
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      this.isSpeakingState = false;
      this.stopVisualizer();
      return false;
    }
  }

  /**
   * Stop speech immediately.
   */
  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.stopVisualizer();
    this.currentUtterance = null;
  }

  /**
   * Repeat the last spoken text.
   */
  public repeat(options: SpeechOptions = {}): boolean {
    if (!this.lastSpokenText) return false;
    return this.speak(this.lastSpokenText, options);
  }

  public getLastSpokenText(): string {
    return this.lastSpokenText;
  }
}

export const speechEngine = new AmanSpeechEngine();

