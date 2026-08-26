import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LABS_DATA } from '../data/labsData';
import { IncidentLabEngine } from '../components/IncidentLabEngine';

export const LabsPage: React.FC = () => {
  const { activeCareerTrack } = useApp();
  const labs = LABS_DATA.filter(l => l.careerTrack === activeCareerTrack);
  const [selectedLabId, setSelectedLabId] = useState<string | null>(labs[0]?.id || null);

  const selectedLab = labs.find(l => l.id === selectedLabId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Interactive {activeCareerTrack === 'ETHICAL_HACKER' ? 'Ethical Hacker' : 'SOC Analyst'} Labs</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 bg-slate-900 rounded-xl p-4">
            {labs.map(lab => (
                <button 
                    key={lab.id}
                    onClick={() => setSelectedLabId(lab.id)}
                    className={`w-full text-left p-3 rounded-lg text-sm ${selectedLabId === lab.id ? 'bg-cyan-900 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    {lab.title}
                </button>
            ))}
        </div>
        <div className="col-span-3">
            {selectedLab ? <IncidentLabEngine currentLab={selectedLab} /> : <p className="text-slate-400">Select a lab to begin.</p>}
        </div>
      </div>
    </div>
  );
};
