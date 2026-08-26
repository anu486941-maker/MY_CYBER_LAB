import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Globe, 
  Database, 
  ShieldAlert, 
  Terminal, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Code, 
  AlertTriangle,
  Lock,
  Layers,
  Search
} from 'lucide-react';

export const WebSecurityLabPage: React.FC = () => {
  const { addXp } = useApp();
  const [activeTab, setActiveTab] = useState<'sqli' | 'xss' | 'idor'>('sqli');

  // SQLi State
  const [sqliInput, setSqliInput] = useState<string>("admin' OR '1'='1");
  const [sqliResults, setSqliResults] = useState<any[]>([]);
  const [sqliExecutedQuery, setSqliExecutedQuery] = useState<string>('');
  const [sqliExploited, setSqliExploited] = useState<boolean>(false);

  // XSS State
  const [xssInput, setXssInput] = useState<string>("<script>alert('XSS_POC_2026')</script>");
  const [xssSanitized, setXssSanitized] = useState<boolean>(false);
  const [xssExecuted, setXssExecuted] = useState<boolean>(false);

  // IDOR State
  const [idorUserId, setIdorUserId] = useState<number>(42);
  const [idorUserData, setIdorUserData] = useState<any | null>(null);

  // Run SQL Injection Simulation
  const handleExecuteSqli = () => {
    const rawQuery = `SELECT id, username, email, role, api_key FROM users WHERE username = '${sqliInput}' AND is_active = 1`;
    setSqliExecutedQuery(rawQuery);

    if (sqliInput.includes("' OR '1'='1") || sqliInput.includes("' or '1'='1") || sqliInput.includes("' OR 1=1")) {
      const dump = [
        { id: 1, username: 'admin', email: 'admin@mycyberlab.internal', role: 'SUPER_ADMIN', api_key: 'FLAG{SQLI_AUTH_BYPASS_UNION_EXTRACTED_9918}' },
        { id: 2, username: 'dev_sarah', email: 'sarah@mycyberlab.internal', role: 'DEVELOPER', api_key: 'sk_live_8912781297' },
        { id: 3, username: 'auditor_bob', email: 'bob@mycyberlab.internal', role: 'AUDITOR', api_key: 'sk_live_1102938120' }
      ];
      setSqliResults(dump);
      setSqliExploited(true);
      addXp(150);
    } else if (sqliInput.toLowerCase() === 'admin') {
      setSqliResults([
        { id: 1, username: 'admin', email: 'admin@mycyberlab.internal', role: 'SUPER_ADMIN', api_key: '******** [Hidden: Password Required]' }
      ]);
      setSqliExploited(false);
    } else {
      setSqliResults([]);
      setSqliExploited(false);
    }
  };

  // Run XSS Simulation
  const handleExecuteXss = () => {
    setXssExecuted(true);
    if (xssInput.includes('<script>') || xssInput.includes('onerror=') || xssInput.includes('<img')) {
      addXp(125);
    }
  };

  // Run IDOR Simulation
  const handleFetchIdor = () => {
    if (idorUserId === 1) {
      setIdorUserData({
        id: 1,
        fullName: 'Chief Executive Officer (CEO)',
        email: 'ceo@kobayashi.corp',
        ssn: 'XXX-XX-8821',
        bankAccount: 'US-8821-4910-2291',
        salary: '$480,000 / yr',
        flag: 'FLAG{IDOR_PARAMETER_POLLUTION_UNAUTHORIZED_ACCESS_2026}'
      });
      addXp(150);
    } else if (idorUserId === 42) {
      setIdorUserData({
        id: 42,
        fullName: 'Alex Mercer (You)',
        email: 'alex.mercer@mycyberlab.internal',
        role: 'Junior Security Trainee',
        salary: '$65,000 / yr'
      });
    } else {
      setIdorUserData({
        id: idorUserId,
        fullName: `Employee User #${idorUserId}`,
        email: `user${idorUserId}@kobayashi.corp`,
        role: 'Staff Member',
        salary: '$75,000 / yr'
      });
    }
  };

  return (
    <div id="web-security-lab-page" className="space-y-8 pb-20 font-mono">
      
      {/* Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              OWASP TOP 10 PLAYGROUND
            </span>
            <span className="text-xs text-slate-500">• WEB VULNERABILITY TARGETS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Web Application Security Lab
          </h1>
          <p className="text-xs text-slate-400">
            Exploit and remediate common web vulnerabilities: SQL Injection, Reflected XSS, and IDOR in real time.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'sqli', label: '1. SQL Injection (SQLi)', icon: Database },
          { id: 'xss', label: '2. Cross-Site Scripting (XSS)', icon: Code },
          { id: 'idor', label: '3. Insecure Direct Object Reference (IDOR)', icon: Globe }
        ].map((tab) => {
          const IconC = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <IconC className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SQL INJECTION */}
      {activeTab === 'sqli' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">SQL Injection Playground & Auth Bypass</h3>
              <p className="text-xs text-slate-400">Inject SQL payloads to bypass authentication and dump the users table.</p>
            </div>
            <span className="text-xs text-amber-400">Target Endpoint: /login.php</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">User Input (Username field):</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={sqliInput}
                  onChange={(e) => setSqliInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-emerald-400 font-bold"
                />
                <button
                  onClick={handleExecuteSqli}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer shrink-0"
                >
                  TEST INJECTION
                </button>
              </div>
            </div>

            {/* Quick payloads */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Payload Presets:</span>
              <button onClick={() => setSqliInput("admin' OR '1'='1")} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400">Classic Auth Bypass (' OR '1'='1)</button>
              <button onClick={() => setSqliInput("' UNION SELECT 1, table_name, column_name, 4, 5 FROM information_schema.columns--")} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400">UNION Schema Extraction</button>
              <button onClick={() => setSqliInput("admin")} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400">Normal User (admin)</button>
            </div>

            {/* Dynamic SQL Query Representation */}
            {sqliExecutedQuery && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500">BACKEND CONCATENATED SQL QUERY:</div>
                <code className="text-xs text-amber-300 break-all">{sqliExecutedQuery}</code>
              </div>
            )}

            {/* SQL Results Table */}
            <div className="space-y-1.5">
              <div className="text-xs text-slate-400 font-bold">DATABASE QUERY RESULT ROWS:</div>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5">ID</th>
                      <th className="p-2.5">Username</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Role</th>
                      <th className="p-2.5">API Key / Secret Flag</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-300 divide-y divide-slate-800/60 font-mono text-[11px]">
                    {sqliResults.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-500">
                          No database records returned. Try an injection payload.
                        </td>
                      </tr>
                    ) : (
                      sqliResults.map((r, i) => (
                        <tr key={i} className="hover:bg-amber-950/20">
                          <td className="p-2.5">{r.id}</td>
                          <td className="p-2.5 font-bold text-amber-400">{r.username}</td>
                          <td className="p-2.5">{r.email}</td>
                          <td className="p-2.5">{r.role}</td>
                          <td className="p-2.5 text-emerald-400">{r.api_key}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {sqliExploited && (
              <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>AUTHENTICATION BYPASSED! FULL USER DATABASE EXTRACTED (+150 XP)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: XSS */}
      {activeTab === 'xss' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">Cross-Site Scripting (XSS) Playground</h3>
              <p className="text-xs text-slate-400">Test reflected script injection vs browser HTML entity encoding.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Search Input / Query Parameter:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={xssInput}
                  onChange={(e) => setXssInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-cyan-300 font-bold"
                />
                <button
                  onClick={handleExecuteXss}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold cursor-pointer shrink-0"
                >
                  RENDER PREVIEW
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={xssSanitized}
                  onChange={(e) => setXssSanitized(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950"
                />
                Enable HTML Entity Sanitization (htmlspecialchars / DOMPurify)
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="text-xs text-slate-400 font-bold">RAW DOM OUTPUT (UNESCAPED):</div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-28 text-slate-300">
                  {xssSanitized ? (
                    <div className="text-slate-400">
                      Search results for: <code>{xssInput.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-slate-400">Search results for:</div>
                      {xssInput.includes('<script>') ? (
                        <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs animate-bounce">
                          🚨 JAVASCRIPT EXECUTION TRIGGERED: <code>alert('XSS_POC_2026')</code>
                        </div>
                      ) : (
                        <div className="text-slate-200">{xssInput}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs text-slate-400 font-bold">SECURITY REMEDIATION GUIDANCE:</div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 min-h-28 text-slate-300 text-xs space-y-1.5">
                  <p className="text-cyan-400 font-bold">1. Context-Aware Output Encoding</p>
                  <p className="text-slate-400">Escape all untrusted data before reflecting into HTML bodies, attributes, or script blocks.</p>
                  <p className="text-purple-400 font-bold">2. Content Security Policy (CSP)</p>
                  <p className="text-slate-400">Deploy <code>Content-Security-Policy: default-src 'self'; script-src 'self'</code> to block inline scripts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IDOR */}
      {activeTab === 'idor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-100">Insecure Direct Object Reference (IDOR)</h3>
              <p className="text-xs text-slate-400">Tamper with object IDs in API endpoints to access unauthorized executive records.</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">GET /api/v1/employees/profile?user_id=</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={idorUserId}
                  onChange={(e) => setIdorUserId(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-cyan-300 font-bold"
                />
                <button
                  onClick={handleFetchIdor}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer shrink-0"
                >
                  REQUEST PROFILE DATA
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">Quick ID Tampering:</span>
              <button onClick={() => setIdorUserId(42)} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-400">Your ID (42)</button>
              <button onClick={() => setIdorUserId(1)} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-400">CEO ID (1) [Exploit Target]</button>
              <button onClick={() => setIdorUserId(7)} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-purple-400">Staff ID (7)</button>
            </div>

            {idorUserData && (
              <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-2">
                <div className="text-xs text-purple-400 font-bold">API JSON RESPONSE PAYLOAD:</div>
                <pre className="text-xs font-mono text-slate-200 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(idorUserData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
