import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Copy, 
  CheckCircle2, 
  Terminal, 
  Network, 
  ShieldAlert, 
  Radio, 
  Cpu, 
  Lock, 
  Printer,
  Sparkles,
  Download
} from 'lucide-react';

interface CheatSheetSection {
  id: string;
  category: string;
  icon: any;
  items: {
    commandOrTerm: string;
    description: string;
    example: string;
    flagExplanation?: string;
  }[];
}

const CHEAT_SHEETS_DATA: CheatSheetSection[] = [
  {
    id: 'linux',
    category: 'Linux Essential Security & Administration',
    icon: Terminal,
    items: [
      {
        commandOrTerm: 'ss -tuln',
        description: 'Display all listening TCP & UDP sockets in numeric format without DNS lookup overhead.',
        example: 'ss -tuln -p',
        flagExplanation: '-t (TCP), -u (UDP), -l (Listening), -n (Numeric IP/Port), -p (Process name/PID)'
      },
      {
        commandOrTerm: 'find / -perm -4000 -type f 2>/dev/null',
        description: 'Enumerate all binaries across the filesystem with the SUID bit set.',
        example: 'find / -perm -u=s -type f 2>/dev/null',
        flagExplanation: '-perm -4000 (SUID permission match), 2>/dev/null (Suppress stderr permission denied errors)'
      },
      {
        commandOrTerm: 'journalctl -u ssh.service -n 50 --no-pager',
        description: 'Inspect the last 50 systemd journal logs for the OpenSSH authentication daemon.',
        example: 'journalctl -u ssh --since "1 hour ago"',
        flagExplanation: '-u (Unit name), -n (Number of lines), --no-pager (Stream output directly)'
      },
      {
        commandOrTerm: 'chmod 600 /path/to/private_key',
        description: 'Set restrictive read/write permissions exclusively for the file owner (e.g. id_rsa SSH keys).',
        example: 'chmod 600 ~/.ssh/id_rsa',
        flagExplanation: '6 (User: Read+Write), 0 (Group: None), 0 (Others: None)'
      }
    ]
  },
  {
    id: 'nmap',
    category: 'Nmap Network Scanning & Surface Mapping',
    icon: Radio,
    items: [
      {
        commandOrTerm: 'nmap -sS -p- -T4 <target>',
        description: 'Perform a fast SYN stealth scan across all 65,535 TCP ports.',
        example: 'nmap -sS -p 1-65535 -T4 10.10.14.50',
        flagExplanation: '-sS (TCP SYN stealth), -p- (All 65535 ports), -T4 (Aggressive speed timing template)'
      },
      {
        commandOrTerm: 'nmap -sC -sV -p 80,443,8080 <target>',
        description: 'Execute default NSE detection scripts and grab service/version banners on specified ports.',
        example: 'nmap -sC -sV -p 22,80,443 192.168.1.1',
        flagExplanation: '-sC (Default safe scripts), -sV (Probe open ports for version info)'
      },
      {
        commandOrTerm: 'nmap --script "vuln" -p 445 <target>',
        description: 'Run targeted vulnerability assessment scripts against SMB / service ports.',
        example: 'nmap --script smb-vuln-ms17-010 -p 445 10.10.10.40',
        flagExplanation: '--script (NSE category or specific script name)'
      }
    ]
  },
  {
    id: 'owasp',
    category: 'OWASP Top 10 Web Vulnerability Defenses',
    icon: ShieldAlert,
    items: [
      {
        commandOrTerm: 'A01: Broken Access Control',
        description: 'Failure to enforce server-side authorization checks on resources, enabling Insecure Direct Object References (IDOR).',
        example: 'GET /api/user/105 -> Attacker requests /api/user/106',
        flagExplanation: 'Defense: Validate user authorization against database record ownership on every server request.'
      },
      {
        commandOrTerm: 'A03: Injection (SQLi / Command Injection)',
        description: 'Hostile data passed to interpreter without parameterized query separation.',
        example: 'admin\' OR \'1\'=\'1\' --',
        flagExplanation: 'Defense: Use prepared statements (Parameterized Queries) and Object-Relational Mapping (ORM).'
      },
      {
        commandOrTerm: 'A07: Identification and Authentication Failures',
        description: 'Permitting brute-force attacks, default credentials, or weak session tokens.',
        example: 'Hydra password spray against /login endpoint',
        flagExplanation: 'Defense: Enforce MFA, progressive rate limiting, and bcrypt/Argon2 password hashing.'
      }
    ]
  },
  {
    id: 'wireshark',
    category: 'Wireshark / TShark Packet Filters',
    icon: Network,
    items: [
      {
        commandOrTerm: 'tcp.flags.syn == 1 && tcp.flags.ack == 0',
        description: 'Display filter to isolate initial SYN packets initiating TCP handshakes (detect scans/floods).',
        example: 'wireshark filter: tcp.flags.syn == 1 and tcp.flags.ack == 0',
        flagExplanation: 'Filters for handshake step 1 only.'
      },
      {
        commandOrTerm: 'http.request.method == "POST"',
        description: 'Isolate all HTTP POST requests transmitting forms, credentials, or API telemetry.',
        example: 'http.request.method == "POST" && ip.addr == 192.168.1.50',
        flagExplanation: 'Filters for client HTTP submission requests.'
      },
      {
        commandOrTerm: 'dns.flags.response == 1 && dns.flags.rcode != 0',
        description: 'Capture failed DNS lookups (NXDOMAIN / ServFail) to identify botnet DGA domains.',
        example: 'dns.flags.rcode == 3 (NXDOMAIN)',
        flagExplanation: 'rcode 3 indicates non-existent domain name.'
      }
    ]
  }
];

export const CheatSheetsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredSections = CHEAT_SHEETS_DATA.map((section) => {
    const matchingItems = section.items.filter(
      (item) =>
        item.commandOrTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.example.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: matchingItems };
  }).filter((section) => section.items.length > 0);

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold">
            <FileText className="w-3.5 h-3.5" /> ACADEMY REFERENCE GUIDE
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            Cybersecurity Operational Cheat Sheets
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            High-density quick references for Linux triage, Nmap syntax, OWASP Top 10 vulnerabilities, and Wireshark filters.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" /> PRINT GUIDE
        </button>
      </div>

      {/* Search Filter Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search commands, flags, syntax (e.g. ss, nmap, SUID, Wireshark, IDOR)..."
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-cyan-200 focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
        />
      </div>

      {/* Cheat Sheet Sections */}
      <div className="space-y-8">
        {filteredSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-mono font-bold text-white">
                  {sec.category}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 font-mono text-xs">
                {sec.items.map((item, idx) => {
                  const itemKey = `${sec.id}-${idx}`;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="font-bold text-cyan-300 text-sm">
                          {item.commandOrTerm}
                        </div>
                        <button
                          onClick={() => handleCopy(item.example, itemKey)}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-[11px] text-slate-300 border border-slate-800 flex items-center gap-1 self-start cursor-pointer"
                        >
                          {copiedKey === itemKey ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              <span>COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>COPY SYNTAX</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-slate-300 font-sans text-xs">
                        {item.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300 text-[11px] font-mono overflow-x-auto">
                        $ {item.example}
                      </div>

                      {item.flagExplanation && (
                        <div className="text-[11px] text-slate-400 font-sans italic">
                          <strong className="text-slate-300 font-mono not-italic">Breakdown:</strong> {item.flagExplanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
