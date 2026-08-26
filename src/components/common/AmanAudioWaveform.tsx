import React, { useEffect, useState } from 'react';
import { speechEngine } from '../../utils/speechEngine';

interface AmanAudioWaveformProps {
  isSpeaking?: boolean;
  className?: string;
  barCount?: number;
}

export const AmanAudioWaveform: React.FC<AmanAudioWaveformProps> = ({ 
  isSpeaking: propSpeaking, 
  className = '',
  barCount = 12 
}) => {
  const [isSpeaking, setIsSpeaking] = useState(propSpeaking ?? speechEngine.isSpeaking());
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (propSpeaking !== undefined) {
      setIsSpeaking(propSpeaking);
    }
  }, [propSpeaking]);

  useEffect(() => {
    const unsub = speechEngine.subscribeVisualizer((speaking, level) => {
      setIsSpeaking(speaking);
      setAudioLevel(level);
    });
    return () => unsub();
  }, []);

  if (!isSpeaking) return null;

  return (
    <div className={`flex items-center gap-0.5 sm:gap-1 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-1" />
      <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider hidden sm:inline mr-1">
        AMAN SPEAKING
      </span>
      <div className="flex items-end gap-[2px] h-3.5">
        {Array.from({ length: barCount }).map((_, i) => {
          // Compute pseudo randomized height with sine waves
          const heightMultiplier = Math.sin((i / barCount) * Math.PI) * 0.8 + 0.2;
          const dynamicHeight = Math.max(15, (audioLevel * heightMultiplier) % 100);
          return (
            <div
              key={i}
              className="w-[2px] sm:w-[3px] bg-cyan-400 rounded-full transition-all duration-75"
              style={{
                height: `${dynamicHeight}%`,
                opacity: (i % 2 === 0) ? 1 : 0.75
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
