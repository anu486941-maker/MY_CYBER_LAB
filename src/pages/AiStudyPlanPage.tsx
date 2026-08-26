import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Bot, 
  BookOpen, 
  Award, 
  ArrowRight,
  Edit3,
  Check
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export const AiStudyPlanPage: React.FC = () => {
  const { learningState, profile, addNote } = useApp();
  const [dailyTime, setDailyTime] = useState<string>(profile.dailyTime || '30 min');
  const [level, setLevel] = useState<string>(profile.experienceLevel || 'Absolute Zero');
  const [savedToNotes, setSavedToNotes] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const { studyPlan, nextMove } = learningState;

  const defaultScheduleDays = [
    {
      day: 'Day 1',
      title: 'Workstation Setup & Linux Shell Basics',
      duration: dailyTime,
      tasks: [
        { id: 'd1-1', title: 'Complete Lesson: What is an Operating System & Linux', xp: 50 },
        { id: 'd1-2', title: 'Execute whoami, uname -a, and pwd in Linux Lab', xp: 75 },
        { id: 'd1-3', title: 'Pass Level 0 Concept Checkpoint Quiz', xp: 75 }
      ]
    },
    {
      day: 'Day 2',
      title: 'File System Navigation & Permissions',
      duration: dailyTime,
      tasks: [
        { id: 'd2-1', title: 'Read Theory: Linux File Permissions (rwx & chmod)', xp: 50 },
        { id: 'd2-2', title: 'Complete Mission 02: Your First Linux Command', xp: 150 },
        { id: 'd2-3', title: 'Solve CTF Challenge: Linux Hidden Files', xp: 100 }
      ]
    },
    {
      day: 'Day 3',
      title: 'Networking Basics — IP Addresses & Subnets',
      duration: dailyTime,
      tasks: [
        { id: 'd3-1', title: 'Review IPv4 vs IPv6 structures in Network Lab', xp: 50 },
        { id: 'd3-2', title: 'Calculate /24 and /28 subnets with CIDR trainer', xp: 50 },
        { id: 'd3-3', title: 'Execute Mission 04: Find Your IP Address', xp: 150 }
      ]
    },
    {
      day: 'Day 4',
      title: 'Transport Layer — TCP vs UDP & Port Discovery',
      duration: dailyTime,
      tasks: [
        { id: 'd4-1', title: 'Simulate ICMP ping packets to 192.168.1.1', xp: 50 },
        { id: 'd4-2', title: 'Study 3-Way Handshake (SYN, SYN-ACK, ACK)', xp: 75 },
        { id: 'd4-3', title: 'Complete Mission 06: TCP vs UDP & Mission 07: Service Discovery', xp: 300 }
      ]
    },
    {
      day: 'Day 5',
      title: 'Web Vulnerabilities & Reconnaissance',
      duration: dailyTime,
      tasks: [
        { id: 'd5-1', title: 'Inspect HTTP GET/POST headers & status codes', xp: 50 },
        { id: 'd5-2', title: 'Solve Web CTF: Parameter Tampering', xp: 150 },
        { id: 'd5-3', title: 'Ask AI Mentor to explain SQL Injection basics', xp: 50 }
      ]
    }
  ];

  const [scheduleDays, setScheduleDays] = useState(defaultScheduleDays);

  // Daily task checklist state
  const [checkedTasks, setCheckedTasks] = useState<{ [id: string]: boolean }>({
    'd1-1': true,
    'd1-2': true,
    'd2-1': false
  });

  const toggleTask = (id: string) => {
    setCheckedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyTime,
          experienceLevel: level,
          currentLevel: profile.cyberLevel,
          goal: `Become proficient in cybersecurity fundamentals and ethical hacking methodologies`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.plan && data.plan.days) {
          const formatted = data.plan.days.map((d: any, idx: number) => ({
            day: `Day ${d.day || idx + 1}`,
            title: d.theme || `Operational Study Focus ${idx + 1}`,
            duration: dailyTime,
            tasks: (d.tasks || []).map((tStr: string, tIdx: number) => ({
              id: `gen-${idx}-${tIdx}`,
              title: tStr,
              xp: 75
            }))
          }));
          setScheduleDays(formatted);
          setIsGenerating(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Study plan generation fallback:', err);
    }

    // Default update based on dailyTime
    setTimeout(() => {
      setScheduleDays(defaultScheduleDays.map(d => ({ ...d, duration: dailyTime })));
      setIsGenerating(false);
    }, 400);
  };

  const handleExportToNotebook = () => {
    addNote({
      title: `Personal AI Study Plan (${dailyTime}/day - ${level})`,
      category: 'Tactics',
      content: `# 5-Day Guided Cybersecurity Roadmap\n\nDaily Commitment: ${dailyTime}\nExperience Tier: ${level}\n\nKey Objectives:\n- Day 1: Shell triage & hardware basics\n- Day 2: Linux permissions & hidden file discovery\n- Day 3: IPv4 addressing & subnetting\n- Day 4: TCP 3-Way Handshake & port scanners\n- Day 5: Web HTTP inspection & CTF challenges\n\nGenerated by AI Study Plan Navigator.`,
      tags: ['StudyPlan', 'Roadmap', level]
    });
    setSavedToNotes(true);
    setTimeout(() => setSavedToNotes(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/30 text-purple-400 font-mono text-xs font-semibold">
              SMART ROADMAP
            </span>
            <StatusBadge type="ai_demo" label="AI STUDY GENERATOR" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-slate-100">
            Personalized AI Study Plan
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Structured daily micro-curriculum tailored to your exact pace and schedule.
          </p>
        </div>

        <button
          onClick={handleExportToNotebook}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-2 cursor-pointer shadow-sm"
        >
          {savedToNotes ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {savedToNotes ? 'SAVED TO NOTEBOOK!' : 'SAVE PLAN TO NOTEBOOK'}
        </button>
      </div>

      {/* Plan Tuning Controls */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2">
              DAILY TIME AVAILABILITY:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['15 min', '30 min', '1 hour', '2+ hours'].map(t => (
                <button
                  key={t}
                  onClick={() => setDailyTime(t)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    dailyTime === t
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2">
              EXPERIENCE LEVEL:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Absolute Zero', 'Tech-Savvy Beginner', 'IT Support', 'CS Student'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-mono font-bold truncate transition-all cursor-pointer ${
                    level === lvl
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end border-t border-slate-800/80">
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'GENERATING PERSONALIZED CURRICULUM...' : 'REGENERATE AI STUDY SCHEDULE'}
          </button>
        </div>
      </div>

      {/* 5-Day Weekly Roadmap Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold text-slate-200 uppercase flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            GENERATED 5-DAY OPERATIONAL CURRICULUM
          </h2>
          <span className="text-xs font-mono text-cyan-400">Total Reward: +1,175 XP</span>
        </div>

        <div className="space-y-3">
          {scheduleDays.map((sched, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold">
                    {sched.day}
                  </span>
                  <h3 className="font-mono font-bold text-sm text-slate-100">
                    {sched.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{sched.duration}</span>
                </div>
              </div>

              {/* Tasks Checklist */}
              <div className="space-y-2">
                {sched.tasks.map((task) => {
                  const isChecked = checkedTasks[task.id] || false;
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded flex items-center justify-center ${isChecked ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800'}`}>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={isChecked ? 'line-through text-slate-400' : 'text-slate-200'}>
                          {task.title}
                        </span>
                      </div>

                      <span className="text-cyan-400 font-bold shrink-0">+{task.xp} XP</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
