import React, { useState } from 'react';
import { Users, GraduationCap, Award, BookOpen, AlertTriangle, CheckCircle2, Shield, Search } from 'lucide-react';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  skillLevel: string;
  readinessPercentage: number;
  weakSkill: string;
  labsCompleted: number;
  lastActive: string;
}

const MOCK_STUDENTS: StudentProfile[] = [
  {
    id: 'std-01',
    name: 'Alex Rivera',
    email: 'arivera@cyberacademy.edu',
    role: 'SOC Analyst (Tier 1)',
    skillLevel: 'Intermediate',
    readinessPercentage: 78,
    weakSkill: 'SIEM Log Correlation',
    labsCompleted: 14,
    lastActive: '10 mins ago'
  },
  {
    id: 'std-02',
    name: 'Sarah Chen',
    email: 'schen@cyberacademy.edu',
    role: 'Ethical Hacker / Pentester',
    skillLevel: 'Advanced',
    readinessPercentage: 86,
    weakSkill: 'SQL Injection Union Payloads',
    labsCompleted: 22,
    lastActive: '2 hours ago'
  },
  {
    id: 'std-03',
    name: 'Marcus Vance',
    email: 'mvance@cyberacademy.edu',
    role: 'Digital Forensics (DFIR)',
    skillLevel: 'Beginner',
    readinessPercentage: 54,
    weakSkill: 'Memory Dump Parsing',
    labsCompleted: 6,
    lastActive: '1 day ago'
  }
];

export const InstructorDashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assignedTask, setAssignedTask] = useState('');

  const filteredStudents = MOCK_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssignTask = (studentName: string) => {
    if (!assignedTask.trim()) {
      alert('Please enter a task description before assigning.');
      return;
    }
    alert(`Successfully assigned task "${assignedTask}" to ${studentName}.`);
    setAssignedTask('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
            Academy Instructor & Admin Portal
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-2">Instructor Oversight Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor student career progress, readiness ratings, diagnostic weak skills, and assign remediation tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Students</span>
            <span className="text-xl font-bold text-cyan-400">{MOCK_STUDENTS.length}</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 uppercase font-semibold block">Avg Readiness</span>
            <span className="text-xl font-bold text-emerald-400">72.6%</span>
          </div>
        </div>
      </div>

      {/* Roster Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Assign video/lab to student..."
            value={assignedTask}
            onChange={(e) => setAssignedTask(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500 flex-1 sm:w-64"
          />
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase border-b border-slate-800">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Career Role</th>
              <th className="p-4">Readiness Rating</th>
              <th className="p-4">Diagnostic Weak Skill</th>
              <th className="p-4">Labs Completed</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredStudents.map(std => (
              <tr key={std.id} className="hover:bg-slate-800/50 transition">
                <td className="p-4">
                  <div className="font-bold text-white">{std.name}</div>
                  <div className="text-[11px] text-slate-500">{std.email}</div>
                </td>
                <td className="p-4">
                  <span className="font-semibold text-cyan-300">{std.role}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${std.readinessPercentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-emerald-400 font-bold">{std.readinessPercentage}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-rose-400 bg-rose-950/40 border border-rose-900 px-2 py-0.5 rounded font-mono">
                    {std.weakSkill}
                  </span>
                </td>
                <td className="p-4 font-mono text-slate-200">{std.labsCompleted} Labs</td>
                <td className="p-4">
                  <button
                    onClick={() => handleAssignTask(std.name)}
                    className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded transition"
                  >
                    Assign Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstructorDashboardPage;
