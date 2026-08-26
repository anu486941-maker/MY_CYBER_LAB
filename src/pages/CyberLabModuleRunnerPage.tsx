import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  CYBER_LAB_MODULES, 
  getCyberLabModuleById 
} from '../data/cyberLabModulesData';
import { 
  CyberLabTask, 
  TaskValidationStatus, 
  SimulatedPacket 
} from '../types/cyberLabModuleTypes';
import { useApp } from '../context/AppContext';
import { 
  Terminal as TerminalIcon, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  BookOpen, 
  ListChecks, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  Layers, 
  Activity, 
  Globe, 
  FileText, 
  Radio, 
  AlertTriangle, 
  Send, 
  ExternalLink,
  ChevronRight,
  Flame,
  Zap,
  Play,
  Copy,
  Info
} from 'lucide-react';
import { SafeLabGatewayBanner } from '../components/labs/SafeLabGatewayBanner';
import { WhereAmIModal } from '../components/common/WhereAmIModal';
import { AmanInstructionBanner } from '../components/common/AmanInstructionBanner';
import { generateAmanInstruction } from '../utils/amanInstructionEngine';
import { calculateLearnerPosition, calculateNextMove } from '../utils/learningPositionEngine';
import { speechEngine } from '../utils/speechEngine';
import { 
  isToolSupportedInLab, 
  explainToolExecution, 
  getContextualToolGuide 
} from '../utils/amanToolInstructor';

export const CyberLabModuleRunnerPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { 
    learningState,
    addXp, 
    awardAchievement, 
    user, 
    profile, 
    amanGuidedMode
  } = useApp();

  const { position, nextMove } = learningState;

  // Load Module
  const currentModule = getCyberLabModuleById(moduleId || 'module-01-intro-cyber') || CYBER_LAB_MODULES[0];

  // Active Tabs
  const [activeLeftTab, setActiveLeftTab] = useState<'tasks' | 'theory' | 'quiz'>('tasks');
  const [activeRightTab, setActiveRightTab] = useState<'terminal' | 'packets' | 'logs' | 'web' | 'aman'>('terminal');

  // Task Execution States
  const [activeTaskIndex, setActiveTaskIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskValidationStatus>>({});
  const [taskFeedback, setTaskFeedback] = useState<Record<string, string>>({});
  const [revealedHintLevels, setRevealedHintLevels] = useState<Record<string, number>>({});
  const [unlockedSolutions, setUnlockedSolutions] = useState<Record<string, boolean>>({});

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Terminal State
  const [terminalHistory, setTerminalHistory] = useState<Array<{ text: string; type: 'cmd' | 'output' | 'system' | 'error' }>>([]);
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [currentDir, setCurrentDir] = useState<string>('/home/operator');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Selected Packet for Inspector
  const [selectedPacket, setSelectedPacket] = useState<SimulatedPacket | null>(
    currentModule.sandboxEnvironment.simulatedNetworkPackets?.[0] || null
  );

  // AMAN Socratic Coach State
  const [isWhereAmIOpen, setIsWhereAmIOpen] = useState<boolean>(false);
  const [amanMessages, setAmanMessages] = useState<Array<{ role: 'aman' | 'user'; text: string; timestamp: string }>>([
    {
      role: 'aman',
      text: `Namaste ${profile?.name || user?.displayName || 'Operator'}! Main AMAN hoon, aapka Socratic Cybersecurity Mentor. Module "${currentModule.title}" me welcome! Kisi bhi task ya concept me confusion ho toh bejhijhak poochiye. Main hint dunga par direct answer nahi bataunga taaki aap seekh sakein!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [amanInputText, setAmanInputText] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

  // Module Completion State
  const [isModuleCompleted, setIsModuleCompleted] = useState<boolean>(false);

  // Initialize Terminal on load
  useEffect(() => {
    const initialLogs: Array<{ text: string; type: 'cmd' | 'output' | 'system' | 'error' }> = [
      { text: `[MY CYBER LAB] Connected to authorized sandbox: ${currentModule.sandboxEnvironment.targetName} (${currentModule.sandboxEnvironment.targetIp})`, type: 'system' },
      { text: `OS: ${currentModule.sandboxEnvironment.targetOs} | Tier: ${currentModule.sandboxEnvironment.isolationTier}`, type: 'system' },
      { text: `Type "help" for a list of available diagnostic commands.`, type: 'system' }
    ];
    if (currentModule.sandboxEnvironment.initialTerminalLogs) {
      currentModule.sandboxEnvironment.initialTerminalLogs.forEach(log => {
        initialLogs.push({ text: log, type: 'output' });
      });
    }
    setTerminalHistory(initialLogs);
    setActiveTaskIndex(0);
    setUserAnswers({});
    setTaskStatuses({});
    setRevealedHintLevels({});
    setUnlockedSolutions({});
    setQuizSubmitted(false);
    setIsModuleCompleted(false);
  }, [currentModule]);

  // Scroll Terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const activeTask = currentModule.tasks[activeTaskIndex] || currentModule.tasks[0];
  const totalTasks = currentModule.tasks.length;
  const completedTasksCount = Object.values(taskStatuses).filter(s => s === 'PASS').length;
  const progressPercentage = Math.round((completedTasksCount / totalTasks) * 100);

  // Task Validation Logic
  const handleValidateTask = (task: CyberLabTask) => {
    const answer = (userAnswers[task.id] || '').trim();
    if (!answer && task.questionType !== 'multiple_choice') {
      setTaskStatuses(prev => ({ ...prev, [task.id]: 'FAILED' }));
      setTaskFeedback(prev => ({ ...prev, [task.id]: 'Please enter a response before submitting.' }));
      return;
    }

    let status: TaskValidationStatus = 'FAILED';
    let feedback = '';

    if (task.questionType === 'multiple_choice') {
      const selectedIndex = parseInt(userAnswers[task.id] ?? '-1', 10);
      if (selectedIndex === task.correctOptionIndex) {
        status = 'PASS';
        feedback = 'Correct! Outstanding conceptual understanding.';
      } else {
        status = 'FAILED';
        feedback = 'Incorrect choice. Review the theory section or check the first hint.';
      }
    } else {
      const cleanAnswer = answer.toLowerCase();
      const isExactMatch = (task.expectedAnswers || []).some(
        exp => exp.toLowerCase() === cleanAnswer || cleanAnswer.includes(exp.toLowerCase())
      );
      const hasKeywords = (task.requiredKeywords || []).every(kw => cleanAnswer.includes(kw.toLowerCase()));

      if (isExactMatch || (task.requiredKeywords && task.requiredKeywords.length > 0 && hasKeywords)) {
        status = 'PASS';
        feedback = 'Verified! Target state matches expected security telemetry.';
      } else {
        // Check partial matches
        const partialMatch = (task.expectedAnswers || []).some(exp => {
          const expWords = exp.toLowerCase().split(' ');
          return expWords.some(w => w.length > 3 && cleanAnswer.includes(w));
        });

        if (partialMatch) {
          status = 'PARTIAL';
          feedback = 'Close! Check your syntax, spacing, or capitalization carefully.';
        } else {
          status = 'FAILED';
          feedback = 'Output does not match. Review the terminal output or examine Hint 1.';
        }
      }
    }

    setTaskStatuses(prev => ({ ...prev, [task.id]: status }));
    setTaskFeedback(prev => ({ ...prev, [task.id]: feedback }));

    if (status === 'PASS') {
      addXp(task.xpReward);
      awardAchievement('lab_task_master');

      // Check if all tasks passed
      const nextCompleted = completedTasksCount + 1;
      if (nextCompleted >= totalTasks) {
        setIsModuleCompleted(true);
        addXp(currentModule.xpReward);
        awardAchievement('module_champion');
      }
    }
  };

  // 3-Tier Hint Progression
  const handleRevealNextHint = (taskId: string) => {
    setRevealedHintLevels(prev => {
      const current = prev[taskId] || 0;
      return { ...prev, [taskId]: Math.min(current + 1, 3) };
    });
  };

  // Terminal Execution Engine
  const executeTerminalCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    const newHistory = [...terminalHistory, { text: `operator@${currentModule.sandboxEnvironment.targetName}:${currentDir}$ ${cmd}`, type: 'cmd' as const }];
    const parts = cmd.split(' ');
    const main = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    const fs = currentModule.sandboxEnvironment.simulatedFileSystem;

    // Check if the learner is asking for a guide or help on a tool
    const isGuideRequest = 
      cmd.endsWith('?') || 
      cmd.includes(' --help') || 
      cmd.toLowerCase().startsWith('how do i use') || 
      cmd.toLowerCase().startsWith('how to use');

    let resolvedTool = main;
    if (isGuideRequest) {
      if (cmd.endsWith('?')) {
        resolvedTool = cmd.slice(0, -1).trim().toLowerCase().split(' ')[0];
      } else if (cmd.includes(' --help')) {
        resolvedTool = cmd.replace(' --help', '').trim().toLowerCase().split(' ')[0];
      } else if (cmd.toLowerCase().startsWith('how do i use')) {
        resolvedTool = cmd.toLowerCase().replace('how do i use', '').trim().split(' ')[0];
      } else if (cmd.toLowerCase().startsWith('how to use')) {
        resolvedTool = cmd.toLowerCase().replace('how to use', '').trim().split(' ')[0];
      }
    }

    if (isGuideRequest) {
      const guide = getContextualToolGuide(resolvedTool, currentModule);
      const guideMarkdown = `### 📘 ${guide.title}
**Purpose:** ${guide.purpose}

**Syntax:** \`${guide.syntax}\`

**Key Options:**
${guide.options.map(o => `* \`${o.opt}\`: ${o.desc}`).join('\n')}

**Safe Examples:**
${guide.examples.map(e => `* \`${e.cmd}\` - ${e.desc}`).join('\n')}

**Expected Output Structure:**
\`\`\`text
${guide.expectedOutput}
\`\`\`

**Lab Relevance:**
${guide.relevance}`;

      const newAmanMsg = {
        role: 'aman' as const,
        text: `Operator, here is the reference guide for "${resolvedTool}":\n\n` + guideMarkdown,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setAmanMessages(prev => [...prev, newAmanMsg]);
      setActiveRightTab('aman');

      if (ttsEnabled) {
        const speakIntro = profile?.language === 'Hinglish'
          ? `Maine aapke liye ${resolvedTool} ka reference manual open kar diya hai. Ise dhyan se padhein!`
          : `I have opened the reference manual for ${resolvedTool}. Take a look at the parameters and examples.`;
        speechEngine.speak(speakIntro);
      }

      setTerminalHistory([...newHistory, { text: `[AMAN INSTRUCTOR] Contextual guide for "${resolvedTool}" opened in the AMAN coach panel.`, type: 'system' }]);
      setTerminalInput('');
      return;
    }

    // List of security/system tools subject to environment-support verification
    const securityToolsList = ['pwd', 'ls', 'nmap', 'ip', 'ss', 'ping', 'curl', 'dig', 'nslookup', 'grep', 'find', 'chmod', 'whoami', 'id', 'netstat'];
    
    if (securityToolsList.includes(main)) {
      const isSupported = isToolSupportedInLab(main, currentModule, currentModule.tasks[activeTaskIndex]);
      
      if (!isSupported) {
        // Log bash-style restricted error in terminal history
        newHistory.push({ text: `bash: ${main}: command not found or disabled in this restricted baseline lab profile.`, type: 'error' });
        setTerminalHistory(newHistory);
        setTerminalInput('');

        // Generate AMAN's locked tool explanation
        const isHinglish = profile?.language === 'Hinglish';
        const explanation = explainToolExecution(main, false, false, currentModule, currentModule.tasks[activeTaskIndex], isHinglish);

        const newAmanMsg = {
          role: 'aman' as const,
          text: explanation.markdownText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setAmanMessages(prev => [...prev, newAmanMsg]);
        setActiveRightTab('aman');

        if (ttsEnabled) {
          speechEngine.speak(explanation.spokenText);
        }
        return;
      }
    }

    // Execute supported commands
    switch (main) {
      case 'help':
        newHistory.push({
          text: `Available diagnostic commands:
• pwd, ls, cd, cat, grep, head, tail, find
• whoami, id, ps aux, uname -a
• ip addr, ip route, netstat -tuln, ss -tuln
• nmap -sV <target>, curl -I <url>, curl -s <url>
• ping -c 3 <ip>, dig <domain>, nslookup <domain>
• chmod +x <file>, sha256sum <file>
• ufw status, iptables -L -n -v
• clear, help`,
          type: 'output'
        });
        break;

      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;

      case 'pwd':
        newHistory.push({ text: currentDir, type: 'output' });
        break;

      case 'whoami':
        newHistory.push({ text: 'operator', type: 'output' });
        break;

      case 'id':
        newHistory.push({ text: 'uid=1000(operator) gid=1000(operator) groups=1000(operator),27(sudo),100(users)', type: 'output' });
        break;

      case 'uname':
        newHistory.push({ text: `Linux ${currentModule.sandboxEnvironment.targetName} 5.15.0-89-generic #99-Ubuntu SMP x86_64 GNU/Linux`, type: 'output' });
        break;

      case 'ls': {
        const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
        const targetPath = args.replace(/-[a-zA-Z]+/g, '').trim() || currentDir;

        // Collect matching keys in simulatedFileSystem
        const matchingFiles = Object.keys(fs).filter(path => {
          if (targetPath === currentDir || targetPath === '.') {
            const prefix = currentDir === '/' ? '/' : currentDir + '/';
            return path.startsWith(prefix) && !path.slice(prefix.length).includes('/');
          }
          return path.startsWith(targetPath);
        });

        if (matchingFiles.length === 0) {
          // Default listing for current dir
          if (currentDir === '/home/operator') {
            if (showAll) {
              newHistory.push({ text: 'total 32\ndrwxr-xr-x 4 operator operator 4096 Aug 23 00:00 .\ndrwxr-xr-x 3 root     root     4096 Aug 23 00:00 ..\n-rw-r--r-- 1 operator operator  220 Aug 23 00:00 .bashrc\n-rw-r--r-- 1 operator operator  807 Aug 23 00:00 .profile\n-rw-r--r-- 1 operator operator   38 Aug 23 00:00 .hidden_flag.txt\n-rw-r--r-- 1 operator operator  142 Aug 23 00:00 briefing.txt\n-rw-r--r-- 1 operator operator   84 Aug 23 00:00 notes.txt\n-rw-r--r-- 1 operator operator  104 Aug 23 00:00 document.txt', type: 'output' });
            } else {
              newHistory.push({ text: 'briefing.txt  notes.txt  document.txt  nmap_scans/', type: 'output' });
            }
          } else {
            newHistory.push({ text: 'total 4\ndrwxr-xr-x 2 operator operator 4096 Aug 23 00:00 .', type: 'output' });
          }
        } else {
          const names = matchingFiles.map(f => f.split('/').pop() || f);
          newHistory.push({ text: names.join('  '), type: 'output' });
        }
        break;
      }

      case 'cd': {
        const dest = args.trim() || '/home/operator';
        if (dest === '~' || dest === '/home/operator') {
          setCurrentDir('/home/operator');
        } else if (dest === '..') {
          const partsDir = currentDir.split('/').filter(Boolean);
          partsDir.pop();
          setCurrentDir('/' + partsDir.join('/'));
        } else if (dest.startsWith('/')) {
          setCurrentDir(dest);
        } else {
          setCurrentDir(currentDir === '/' ? `/${dest}` : `${currentDir}/${dest}`);
        }
        break;
      }

      case 'cat': {
        const filePath = args.trim();
        let fullPath = filePath;
        if (!filePath.startsWith('/')) {
          fullPath = currentDir === '/' ? `/${filePath}` : `${currentDir}/${filePath}`;
        }

        if (fs[fullPath]) {
          newHistory.push({ text: fs[fullPath], type: 'output' });
        } else if (fs[filePath]) {
          newHistory.push({ text: fs[filePath], type: 'output' });
        } else {
          newHistory.push({ text: `cat: ${filePath}: No such file or directory`, type: 'error' });
        }
        break;
      }

      case 'grep': {
        newHistory.push({
          text: `Grep search executed on sandbox streams. Output matches highlighted.`,
          type: 'output'
        });
        // Check if searching in a known simulated file
        for (const [path, content] of Object.entries(fs)) {
          if (args.includes(path) || args.includes(path.split('/').pop() || '')) {
            newHistory.push({ text: content, type: 'output' });
            break;
          }
        }
        break;
      }

      case 'nmap': {
        newHistory.push({ text: `Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-23 00:00 UTC`, type: 'output' });
        newHistory.push({ text: `Nmap scan report for ${currentModule.sandboxEnvironment.targetIp} (${currentModule.sandboxEnvironment.targetName})`, type: 'output' });
        newHistory.push({ text: `Host is up (0.00034s latency).\nNot shown: 996 closed tcp ports (reset)\nPORT     STATE SERVICE VERSION`, type: 'output' });
        currentModule.sandboxEnvironment.simulatedServices.forEach(s => {
          newHistory.push({ text: `${s.port}/tcp   ${s.state.padEnd(5)} ${s.service.padEnd(8)} ${s.banner}`, type: 'output' });
        });
        newHistory.push({ text: `\nService detection performed. 1 IP address (1 host up) scanned in 1.42 seconds`, type: 'output' });
        break;
      }

      case 'curl': {
        if (args.includes('-I') || args.includes('-i')) {
          newHistory.push({
            text: `HTTP/1.1 200 OK\nServer: nginx/1.18.0 (Ubuntu)\nDate: Sun, 23 Aug 2026 00:00:00 GMT\nContent-Type: text/html; charset=UTF-8\nConnection: keep-alive\nX-Frame-Options: DENY\nX-Content-Type-Options: nosniff\nContent-Security-Policy: default-src 'self'`,
            type: 'output'
          });
        } else if (args.includes('/api/v1/status')) {
          newHistory.push({
            text: `{"status": "online", "active_users": 14, "lab_mode": "ACTIVE", "integrity_check": "VALID"}`,
            type: 'output'
          });
        } else {
          newHistory.push({
            text: `<html>\n<head><title>Academy Authorized Sandbox</title></head>\n<body>\n<h1>MY CYBER LAB Target Node: ${currentModule.sandboxEnvironment.targetName}</h1>\n<p>Educational sandbox operating normally.</p>\n</body>\n</html>`,
            type: 'output'
          });
        }
        break;
      }

      case 'sha256sum': {
        newHistory.push({ text: `a69f73cc10e42d8f99e3c01b2a95c11438902d334581f1489e248231048b64e5  ${args || 'document.txt'}`, type: 'output' });
        break;
      }

      case 'ip': {
        if (args.includes('addr') || args.includes('a')) {
          newHistory.push({
            text: `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP\n    inet ${currentModule.sandboxEnvironment.targetIp}/24 brd 10.10.10.255 scope global eth0`,
            type: 'output'
          });
        } else if (args.includes('route') || args.includes('r')) {
          newHistory.push({ text: `default via 10.10.10.1 dev eth0 proto dhcp src ${currentModule.sandboxEnvironment.targetIp} metric 100`, type: 'output' });
        } else {
          newHistory.push({ text: `Usage: ip [addr | route]`, type: 'output' });
        }
        break;
      }

      case 'netstat':
      case 'ss': {
        newHistory.push({
          text: `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN`,
          type: 'output'
        });
        break;
      }

      case 'ufw': {
        newHistory.push({
          text: `Status: active\nLogging: on (low)\nDefault: deny (incoming), allow (outgoing), disabled (routed)\n\nTo                         Action      From\n--                         ------      ----\n22/tcp                     ALLOW       Anywhere (SSH Management)\n443/tcp                    ALLOW       Anywhere (HTTPS Secure Web)\n22/tcp (v6)                ALLOW       Anywhere (v6)`,
          type: 'output'
        });
        break;
      }

      case 'ping': {
        newHistory.push({
          text: `PING ${args.split(' ').pop() || '10.10.10.5'} (${args.split(' ').pop() || '10.10.10.5'}) 56(84) bytes of data.\n64 bytes from ${args.split(' ').pop() || '10.10.10.5'}: icmp_seq=1 ttl=64 time=0.342 ms\n64 bytes from ${args.split(' ').pop() || '10.10.10.5'}: icmp_seq=2 ttl=64 time=0.315 ms\n64 bytes from ${args.split(' ').pop() || '10.10.10.5'}: icmp_seq=3 ttl=64 time=0.320 ms\n--- ${args.split(' ').pop() || '10.10.10.5'} ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2002ms\nrtt min/avg/max/mdev = 0.315/0.325/0.342/0.012 ms`,
          type: 'output'
        });
        break;
      }

      case 'dig': {
        const queryDom = args.trim() || 'target.mycyberlab.local';
        newHistory.push({
          text: `; <<>> DiG 9.18.1-1ubuntu1.3-Ubuntu <<>> ${queryDom}\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 48911\n;; flags: qr aa rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1\n\n;; QUESTION SECTION:\n;${queryDom}. IN A\n\n;; ANSWER SECTION:\n${queryDom}. 3600 IN A ${currentModule.sandboxEnvironment.targetIp}\n\n;; Query time: 1 msec\n;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)\n;; WHEN: Sun Aug 23 00:00:00 UTC 2026\n;; MSG SIZE  rcvd: 71`,
          type: 'output'
        });
        break;
      }

      case 'nslookup': {
        const queryDom = args.trim() || 'target.mycyberlab.local';
        newHistory.push({
          text: `Server:\t\t127.0.0.53\nAddress:\t127.0.0.53#53\n\nName:\t${queryDom}\nAddress: ${currentModule.sandboxEnvironment.targetIp}`,
          type: 'output'
        });
        break;
      }

      case 'find': {
        newHistory.push({
          text: `./briefing.txt\n./notes.txt\n./document.txt\n./nmap_scans\n./nmap_scans/baseline_ping.xml`,
          type: 'output'
        });
        break;
      }

      case 'chmod': {
        newHistory.push({
          text: `[+] Permissions updated: mode change successful. Target properties updated in simulated workspace bounds.`,
          type: 'output'
        });
        break;
      }

      default:
        newHistory.push({ text: `bash: ${main}: command not found. Type "help" for available diagnostic utilities.`, type: 'error' });
        break;
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');

    // If a tool was executed successfully, let AMAN analyze it proactively
    if (securityToolsList.includes(main)) {
      const isExpert = profile?.experience === 'already_studying' || (typeof profile?.cyberLevel === 'number' && profile.cyberLevel > 3);
      const isHinglish = profile?.language === 'Hinglish';
      const explanation = explainToolExecution(main, isExpert, true, currentModule, currentModule.tasks[activeTaskIndex], isHinglish);

      const newAmanMsg = {
        role: 'aman' as const,
        text: explanation.markdownText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setAmanMessages(prev => [...prev, newAmanMsg]);
      setActiveRightTab('aman');

      if (ttsEnabled) {
        speechEngine.speak(explanation.spokenText);
      }
    }
  };

  // AMAN Socratic Dialogue Handler
  const handleSendAmanQuestion = (queryText?: string) => {
    const q = queryText || amanInputText;
    if (!q.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMsgs = [...amanMessages, userMsg];
    setAmanMessages(newMsgs);
    setAmanInputText('');

    // Generate Socratic Response
    setTimeout(() => {
      let responseText = '';
      const qLower = q.toLowerCase();

      if (qLower.includes('where am i') || qLower.includes('current position')) {
        responseText = `Aap currently **${currentModule.title}** me hain! Task ${activeTask.taskNumber} of ${totalTasks} par work kar rahe hain (${progressPercentage}% complete). Is task me apko ${activeTask.skillTested} practice karni hai.`;
      } else if (qLower.includes('hint') || qLower.includes('help') || qLower.includes('stuck')) {
        responseText = `Dekhiye, Task ${activeTask.taskNumber} ke liye pehle yeh samjhiye: *${activeTask.hint1_concept}*. Sandbox terminal me command run karke dekhiye aur output ko dhyan se padhiye!`;
      } else if (qLower.includes('answer') || qLower.includes('solution') || qLower.includes('batao')) {
        responseText = `Main direct answer nahi de sakta kyunki aap tabhi seekhenge jab khud analyze karenge! Par main aapko direct hint de sakta hoon: *${activeTask.hint2_direction}*.`;
      } else if (qLower.includes('why') || qLower.includes('kyun') || qLower.includes('explain')) {
        responseText = `Bahut achha sawaal! ${activeTask.title} isliye important hai kyunki real-world cybersecurity me: *${activeTask.finalExplanation}*.`;
      } else {
        responseText = `Main samajh gaya aapka point. Task ${activeTask.taskNumber} ke context me: '${activeTask.title}'. Aap right-side terminal me command try karein ya Inspector tab me logs check karein. Kya aap chahte hain ki main specific guidance doon?`;
      }

      const amanReply = {
        role: 'aman' as const,
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setAmanMessages([...newMsgs, amanReply]);

      // Voice Audio synthesis if enabled
      if (ttsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(responseText.replace(/[*_`#]/g, ''));
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }, 400);
  };

  // Handle Quiz Submission
  const handleQuizSubmit = () => {
    let score = 0;
    currentModule.assessmentQuiz.questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score === currentModule.assessmentQuiz.questions.length) {
      addXp(150);
      awardAchievement('quiz_perfection');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Top Persistent Module Telemetry Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Left: Module Code, Title & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link 
              to="/modules" 
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-xs font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Labs</span>
            </Link>
            
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {currentModule.code}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                  {currentModule.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400">
                  {currentModule.difficulty}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                {currentModule.title}
              </h1>
            </div>
          </div>

          {/* Right: Progress Tracker & Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Progress Telemetry */}
            <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-3.5 py-1.5 rounded-xl">
              <div className="text-right">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Lab Progress</div>
                <div className="text-xs font-bold text-cyan-400 font-mono">
                  {completedTasksCount}/{totalTasks} Tasks ({progressPercentage}%)
                </div>
              </div>
              <div className="w-20 sm:w-28 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* WHERE AM I? Trigger */}
            <button
              onClick={() => setIsWhereAmIOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              title="Where Am I? Telemetry"
            >
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">WHERE AM I?</span>
            </button>

            {/* ASK AMAN Voice Button */}
            <button
              onClick={() => {
                setActiveRightTab('aman');
                handleSendAmanQuestion(`Main Task ${activeTask.taskNumber} par hoon. Mujhe is task ke bare me guide kijiye!`);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-900/30 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>ASK AMAN</span>
            </button>
          </div>
        </div>
      </header>

      {/* AMAN PROACTIVE INSTRUCTION BANNER */}
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-5 pt-3">
        <AmanInstructionBanner 
          customInstruction={generateAmanInstruction(
            taskStatuses[activeTask?.id || ''] === 'PASS' ? 'lab_task_complete' : 'module_start',
            position,
            nextMove,
            profile,
            {
              moduleTitle: currentModule.title,
              taskTitle: activeTask?.title || `Task ${activeTaskIndex + 1}`,
              taskIndex: activeTaskIndex,
              totalTasks: totalTasks,
              attempts: (revealedHintLevels[activeTask?.id || ''] || 0) + 1
            }
          )}
          onActionClick={() => {
            if (activeTaskIndex < totalTasks - 1) {
              setActiveTaskIndex(prev => prev + 1);
            } else {
              navigate('/roadmap');
            }
          }}
        />
      </div>

      {/* Main Split-Screen Workbench */}
      <main className="max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: EDUCATIONAL TASKS, THEORY & ASSESSMENT (5 Cols) */}
        {/* ========================================================== */}
        <section className="lg:col-span-6 space-y-4">
          
          {/* Left Navigation Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveLeftTab('tasks')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeLeftTab === 'tasks'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span>Lab Tasks ({completedTasksCount}/{totalTasks})</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('theory')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeLeftTab === 'theory'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Theory & Concepts</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('quiz')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeLeftTab === 'quiz'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Final Quiz</span>
            </button>
          </div>

          {/* TAB 1: INTERACTIVE TASKS WORKFLOW */}
          {activeLeftTab === 'tasks' && (
            <div className="space-y-4">
              
              {/* Task Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {currentModule.tasks.map((task, idx) => {
                  const status = taskStatuses[task.id] || 'UNATTEMPTED';
                  const isCurrent = idx === activeTaskIndex;
                  return (
                    <button
                      key={task.id}
                      onClick={() => setActiveTaskIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition-all border ${
                        isCurrent
                          ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-900/40 scale-105'
                          : status === 'PASS'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {status === 'PASS' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>#{task.taskNumber}</span>
                      )}
                      <span>Task {task.taskNumber}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Task Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
                
                {/* Task Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                        TASK #{activeTask.taskNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400">
                        {activeTask.type.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        +{activeTask.xpReward} XP
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {activeTask.title}
                    </h2>
                  </div>

                  {/* Task Status Badge */}
                  <div>
                    {taskStatuses[activeTask.id] === 'PASS' ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        COMPLETED
                      </span>
                    ) : taskStatuses[activeTask.id] === 'PARTIAL' ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1 border border-amber-500/40">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        PARTIAL
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-medium">
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                </div>

                {/* Task Scenario & Instructions */}
                <div className="space-y-3">
                  <div className="text-sm text-slate-300 leading-relaxed">
                    {activeTask.description}
                  </div>

                  <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                    <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>MISSION INSTRUCTIONS</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {activeTask.instructions}
                    </p>
                    {activeTask.educationalCommandSuggestion && (
                      <div className="pt-2 flex items-center justify-between bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
                        <code className="text-xs text-emerald-400 font-mono">
                          $ {activeTask.educationalCommandSuggestion}
                        </code>
                        <button
                          onClick={() => {
                            executeTerminalCommand(activeTask.educationalCommandSuggestion || '');
                            setActiveRightTab('terminal');
                          }}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-all"
                        >
                          <Play className="w-3 h-3" />
                          <span>Run in Sandbox</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input / Response Section */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    YOUR VERIFICATION RESPONSE
                  </label>

                  {/* Multiple Choice Render */}
                  {activeTask.questionType === 'multiple_choice' ? (
                    <div className="space-y-2">
                      {activeTask.multipleChoiceOptions?.map((opt, optIdx) => {
                        const isSelected = userAnswers[activeTask.id] === optIdx.toString();
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setUserAnswers(prev => ({ ...prev, [activeTask.id]: optIdx.toString() }))}
                            className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/50'
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                              isSelected ? 'border-cyan-400 bg-cyan-500 text-black' : 'border-slate-600'
                            }`}>
                              {String.fromCharCode(65 + optIdx)}
                            </div>
                            <span className="flex-1">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    /* Text / Flag / Command Input */
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userAnswers[activeTask.id] || ''}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [activeTask.id]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && handleValidateTask(activeTask)}
                        placeholder={activeTask.placeholder || 'Enter observed value, flag, or command...'}
                        className="flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-600 outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Submission and Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleValidateTask(activeTask)}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-cyan-950/50 active:scale-95"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit Answer</span>
                      </button>

                      {/* Ask AMAN on this Task */}
                      <button
                        onClick={() => {
                          setActiveRightTab('aman');
                          handleSendAmanQuestion(`Task ${activeTask.taskNumber}: "${activeTask.title}" me main stuck hoon. Hint level ${(revealedHintLevels[activeTask.id] || 0)} unlock kiya hai. Socratic tip dijiye.`);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Ask AMAN Coach</span>
                      </button>
                    </div>

                    {/* Next Task Button if Completed */}
                    {taskStatuses[activeTask.id] === 'PASS' && activeTaskIndex < totalTasks - 1 && (
                      <button
                        onClick={() => setActiveTaskIndex(activeTaskIndex + 1)}
                        className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/50 animate-pulse"
                      >
                        <span>Next Task</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Validation Feedback Message */}
                  {taskFeedback[activeTask.id] && (
                    <div className={`p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-2.5 ${
                      taskStatuses[activeTask.id] === 'PASS'
                        ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
                        : taskStatuses[activeTask.id] === 'PARTIAL'
                        ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                        : 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                    }`}>
                      {taskStatuses[activeTask.id] === 'PASS' ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-400" />
                      )}
                      <span>{taskFeedback[activeTask.id]}</span>
                    </div>
                  )}
                </div>

                {/* 3-Tier Progressive Hint System */}
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                      <span>3-TIER HINT SYSTEM</span>
                    </div>
                    <button
                      onClick={() => handleRevealNextHint(activeTask.id)}
                      disabled={(revealedHintLevels[activeTask.id] || 0) >= 3}
                      className="text-xs text-amber-400 hover:text-amber-300 disabled:text-slate-600 font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Unlock Next Hint ({(revealedHintLevels[activeTask.id] || 0)}/3)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Hint Cards */}
                  <div className="space-y-2">
                    {(revealedHintLevels[activeTask.id] || 0) >= 1 && (
                      <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                        <span className="font-bold text-amber-400">Hint 1 (Concept): </span>
                        {activeTask.hint1_concept}
                      </div>
                    )}
                    {(revealedHintLevels[activeTask.id] || 0) >= 2 && (
                      <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200">
                        <span className="font-bold text-amber-400">Hint 2 (Direction): </span>
                        {activeTask.hint2_direction}
                      </div>
                    )}
                    {(revealedHintLevels[activeTask.id] || 0) >= 3 && (
                      <div className="p-3 bg-amber-950/40 border border-amber-500/60 rounded-xl text-xs text-amber-100 font-mono">
                        <span className="font-bold text-amber-300">Hint 3 (Specific): </span>
                        {activeTask.hint3_specific}
                      </div>
                    )}
                  </div>

                  {/* Unlock Full Educational Solution Explanation */}
                  {taskStatuses[activeTask.id] === 'PASS' && (
                    <div className="p-3.5 bg-cyan-950/30 border border-cyan-600/40 rounded-xl space-y-1.5">
                      <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>EDUCATIONAL TAKEAWAY</span>
                      </div>
                      <p className="text-xs text-cyan-100 leading-relaxed">
                        {activeTask.finalExplanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMPREHENSIVE THEORY & DIAGRAMS */}
          {activeLeftTab === 'theory' && (
            <div className="space-y-4">
              {currentModule.theorySections.map((sec) => (
                <div key={sec.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {sec.title}
                    </h3>
                    {sec.subtitle && (
                      <p className="text-xs text-cyan-400 font-mono mt-0.5">
                        {sec.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-2">
                    {sec.content}
                  </div>

                  {sec.codeSnippet && (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-cyan-300 space-y-1.5">
                      <div className="text-[11px] text-slate-400 font-sans font-bold border-b border-slate-800/80 pb-1">
                        {sec.codeSnippet.title}
                      </div>
                      <pre className="overflow-x-auto py-1">
                        {sec.codeSnippet.code}
                      </pre>
                    </div>
                  )}

                  {sec.keyTakeaways && sec.keyTakeaways.length > 0 && (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Key Engineering Takeaways</span>
                      </div>
                      <ul className="space-y-1.5 pl-4 text-xs text-slate-400 list-disc">
                        {sec.keyTakeaways.map((k, kIdx) => (
                          <li key={kIdx}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MODULE ASSESSMENT QUIZ */}
          {activeLeftTab === 'quiz' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-5 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {currentModule.assessmentQuiz.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Validate your mastery with this graded conceptual evaluation (+150 XP bonus for 100% score).
                </p>
              </div>

              <div className="space-y-5">
                {currentModule.assessmentQuiz.questions.map((q, qIdx) => (
                  <div key={q.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {qIdx + 1}. {q.prompt}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[q.id] === optIdx;
                        const isCorrect = optIdx === q.correctIndex;
                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all flex items-center gap-2.5 ${
                              quizSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                                  : isSelected
                                  ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                                  : 'bg-slate-900 border-slate-800 text-slate-500'
                                : isSelected
                                ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="font-mono text-slate-400">[{String.fromCharCode(65 + optIdx)}]</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="text-xs text-slate-400 pt-1">
                        <span className="font-bold text-slate-300">Explanation: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-950/50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit & Grade Quiz</span>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono text-slate-400">Assessment Result</div>
                    <div className="text-lg font-bold text-cyan-400 font-mono">
                      Score: {quizScore} / {currentModule.assessmentQuiz.questions.length} Correct
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setQuizAnswers({});
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: AUTHORIZED CYBER RANGE SANDBOX WORKBENCH (7 Cols) */}
        {/* ========================================================== */}
        <section className="lg:col-span-6 space-y-4">
          
          {/* Safe Gateway Isolation Status Banner */}
          <SafeLabGatewayBanner
            labName={currentModule.title}
            targetHost={currentModule.sandboxEnvironment.targetName}
            targetIp={currentModule.sandboxEnvironment.targetIp}
            allocatedTimeMinutes={currentModule.estimatedMinutes}
            onResetLab={() => {
              executeTerminalCommand('clear');
              setTerminalHistory([
                { text: `[RESET] Sandbox environment reloaded: ${currentModule.sandboxEnvironment.targetName}`, type: 'system' }
              ]);
            }}
          />

          {/* Workbench Tool Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveRightTab('terminal')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeRightTab === 'terminal'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Shell Console</span>
            </button>

            {currentModule.sandboxEnvironment.simulatedNetworkPackets && (
              <button
                onClick={() => setActiveRightTab('packets')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeRightTab === 'packets'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Packet Inspector</span>
              </button>
            )}

            <button
              onClick={() => setActiveRightTab('logs')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeRightTab === 'logs'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Security Logs</span>
            </button>

            {currentModule.sandboxEnvironment.simulatedWebEndpoints && (
              <button
                onClick={() => setActiveRightTab('web')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  activeRightTab === 'web'
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Web HTTP Target</span>
              </button>
            )}

            <button
              onClick={() => setActiveRightTab('aman')}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeRightTab === 'aman'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                  : 'text-cyan-400 hover:bg-cyan-950/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AMAN Voice Coach</span>
            </button>
          </div>

          {/* WORKBENCH VIEW 1: INTERACTIVE LINUX SHELL TERMINAL */}
          {activeRightTab === 'terminal' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
              
              {/* Terminal Window Topbar */}
              <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-mono text-slate-400 ml-2">
                    operator@{currentModule.sandboxEnvironment.targetName}:{currentDir}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => executeTerminalCommand('clear')}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-all text-xs"
                    title="Clear Terminal"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Terminal Log Stream */}
              <div className="p-4 font-mono text-xs sm:text-[13px] flex-1 overflow-y-auto space-y-1.5 scrollbar-thin">
                {terminalHistory.map((item, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {item.type === 'cmd' && (
                      <div className="text-cyan-300 font-semibold">{item.text}</div>
                    )}
                    {item.type === 'output' && (
                      <div className="text-slate-300 whitespace-pre-wrap">{item.text}</div>
                    )}
                    {item.type === 'system' && (
                      <div className="text-indigo-400">{item.text}</div>
                    )}
                    {item.type === 'error' && (
                      <div className="text-rose-400">{item.text}</div>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Command Input Prompt */}
              <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs pl-2 font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && executeTerminalCommand(terminalInput)}
                  placeholder="Type bash command (e.g. ls -la, cat /etc/passwd, nmap -sV 10.10.10.5)..."
                  className="flex-1 bg-transparent text-xs font-mono text-white outline-none placeholder-slate-600"
                  autoFocus
                />
                <button
                  onClick={() => executeTerminalCommand(terminalInput)}
                  className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* WORKBENCH VIEW 2: WIRESHARK PACKET INSPECTOR */}
          {activeRightTab === 'packets' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[500px] flex flex-col">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">WIRESHARK PACKET CAPTURE STREAM</span>
                <span className="text-slate-400">Interface: eth0 (Promiscuous Mode)</span>
              </div>

              {/* Packet List Table */}
              <div className="flex-1 overflow-y-auto border-b border-slate-800">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-slate-900/80 sticky top-0 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2">No.</th>
                      <th className="p-2">Time</th>
                      <th className="p-2">Source</th>
                      <th className="p-2">Destination</th>
                      <th className="p-2">Protocol</th>
                      <th className="p-2">Length</th>
                      <th className="p-2">Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentModule.sandboxEnvironment.simulatedNetworkPackets || []).map((pkt) => {
                      const isSelected = selectedPacket?.id === pkt.id;
                      return (
                        <tr
                          key={pkt.id}
                          onClick={() => setSelectedPacket(pkt)}
                          className={`cursor-pointer border-b border-slate-900 transition-colors ${
                            isSelected
                              ? 'bg-cyan-950 text-cyan-200 font-semibold'
                              : 'hover:bg-slate-900/60 text-slate-300'
                          }`}
                        >
                          <td className="p-2">{pkt.no}</td>
                          <td className="p-2">{pkt.time}</td>
                          <td className="p-2">{pkt.source}</td>
                          <td className="p-2">{pkt.destination}</td>
                          <td className="p-2 font-bold text-emerald-400">{pkt.protocol}</td>
                          <td className="p-2">{pkt.length}</td>
                          <td className="p-2 truncate max-w-[200px]">{pkt.info}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Packet Breakdown Inspector Pane */}
              {selectedPacket && (
                <div className="p-3 bg-slate-900/90 font-mono text-xs text-slate-300 space-y-1 overflow-y-auto max-h-40">
                  <div className="text-[11px] text-cyan-400 font-bold border-b border-slate-800 pb-1">
                    Frame {selectedPacket.no}: {selectedPacket.length} bytes captured ({selectedPacket.protocol})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Transmission: Src IP: {selectedPacket.source} ➔ Dst IP: {selectedPacket.destination}
                  </div>
                  <div className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 mt-1">
                    {selectedPacket.details}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* WORKBENCH VIEW 3: LIVE SECURITY LOGS FORENSICS */}
          {activeRightTab === 'logs' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[500px] flex flex-col">
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">SYSTEM & SECURITY AUDIT LOGS</span>
                <span className="text-slate-400">Format: Standard Syslog RFC 5424</span>
              </div>

              <div className="p-4 font-mono text-xs text-slate-300 flex-1 overflow-y-auto space-y-2 scrollbar-thin">
                {Object.entries(currentModule.sandboxEnvironment.simulatedFileSystem)
                  .filter(([path]) => path.includes('/var/log/'))
                  .map(([path, content]) => (
                    <div key={path} className="space-y-1">
                      <div className="text-[11px] font-bold text-amber-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                        📄 {path}
                      </div>
                      <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 overflow-x-auto text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {content}
                      </pre>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* WORKBENCH VIEW 4: WEB HTTP TARGET */}
          {activeRightTab === 'web' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[500px] flex flex-col">
              <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-2 text-xs font-mono">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300">Target Web App: http://{currentModule.sandboxEnvironment.targetIp}:80</span>
              </div>

              <div className="p-4 space-y-4 overflow-y-auto flex-1 font-mono text-xs">
                {currentModule.sandboxEnvironment.simulatedWebEndpoints?.map((ep, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-emerald-400 font-bold">GET {ep.path}</div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ep.status === 200 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        HTTP {ep.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
                      <div className="text-slate-500 font-bold border-b border-slate-800 pb-0.5">Response Headers:</div>
                      {Object.entries(ep.headers).map(([k, v]) => (
                        <div key={k}><span className="text-cyan-400">{k}:</span> {v}</div>
                      ))}
                    </div>

                    <div className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded border border-slate-800">
                      <div className="text-slate-500 font-bold border-b border-slate-800 pb-0.5">Response Body:</div>
                      <pre className="mt-1 overflow-x-auto text-emerald-300">{ep.body}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKBENCH VIEW 5: AMAN VOICE SOCRATIC COACH WORKBENCH */}
          {activeRightTab === 'aman' && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[500px] flex flex-col">
              
              {/* Header */}
              <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-slate-950">
                    A
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>AMAN AI Socratic Instructor</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-[10px] text-cyan-400">English + Hinglish Socratic Learning Mentor</div>
                  </div>
                </div>

                {/* Voice Audio Toggle */}
                <button
                  onClick={() => setTtsEnabled(!ttsEnabled)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                    ttsEnabled
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                  title={ttsEnabled ? 'Mute Voice' : 'Enable Voice'}
                >
                  {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* AMAN Message Log */}
              <div className="p-4 flex-1 overflow-y-auto space-y-3 scrollbar-thin text-xs sm:text-sm">
                {amanMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl space-y-1 ${
                        msg.role === 'user'
                          ? 'bg-cyan-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between gap-4">
                        <span>{msg.role === 'user' ? 'Operator' : 'AMAN Instructor'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Socratic Question Buttons */}
              <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                <button
                  onClick={() => handleSendAmanQuestion('WHERE AM I in this module? Give me full telemetry.')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-all"
                >
                  📍 Where Am I?
                </button>
                <button
                  onClick={() => handleSendAmanQuestion(`Task ${activeTask.taskNumber} me syntax check kaise karoon?`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-all"
                >
                  💡 Task Syntax Tip
                </button>
                <button
                  onClick={() => handleSendAmanQuestion('Is concept ka real-world cyber defense me kya use hai?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-all"
                >
                  🛡️ Real World Use
                </button>
              </div>

              {/* AMAN Text Input Prompt */}
              <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={amanInputText}
                  onChange={(e) => setAmanInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAmanQuestion()}
                  placeholder="Ask AMAN in English or Hinglish (e.g. Is task me 'grep' kaise use karein?)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleSendAmanQuestion()}
                  className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Module Completion Modal / Banner */}
      {isModuleCompleted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-cyan-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                LAB MODULE COMPLETE
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {currentModule.title}
              </h2>
              <p className="text-sm text-slate-300">
                Outstanding craftsmanship! You successfully completed all hands-on tasks and earned <strong className="text-cyan-400">+{currentModule.xpReward} XP</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Skills Leveled Up:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentModule.skillsEarned.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 text-xs font-medium border border-slate-700">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/modules"
                className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
              >
                Browse All Modules
              </Link>
              <button
                onClick={() => {
                  const currentIndex = CYBER_LAB_MODULES.findIndex(m => m.id === currentModule.id);
                  const nextModule = CYBER_LAB_MODULES[currentIndex + 1] || CYBER_LAB_MODULES[0];
                  navigate(`/modules/${nextModule.id}`);
                  setIsModuleCompleted(false);
                }}
                className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Next Lab</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global WHERE AM I? Modal */}
      <WhereAmIModal
        isOpen={isWhereAmIOpen}
        onClose={() => setIsWhereAmIOpen(false)}
      />
    </div>
  );
};
