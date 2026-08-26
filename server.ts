import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, GenerateVideosOperation } from '@google/genai';
import { validateAceCommandScope } from './src/utils/aceScopePolicy';
import { AUTHORIZED_CLIENT_ENGAGEMENTS } from './src/data/authorizedClientEngagements';
import { classifyGeminiError } from './src/utils/geminiErrorClassifier';
import { generateLocalGuidanceResponse } from './src/utils/amanLocalGuidance';

dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
  console.warn('Handled async warning/rejection in server background process:', reason);
});

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

const GEMINI_FALLBACK_MODELS = ['gemini-3.7-flash', 'gemini-2.5-flash', 'gemini-flash-latest'];

async function generateContentWithFallback(client: GoogleGenAI, params: any) {
  let lastError: any = null;
  for (const modelName of GEMINI_FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await client.models.generateContent({
          ...params,
          model: modelName,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const classified = classifyGeminiError(err);
        console.warn(`[Gemini Smart Fallback] Model ${modelName} (attempt ${attempt}) failed (${classified.code}: ${classified.technicalDetails})`);
        
        if (classified.code === 'AUTHENTICATION_OR_PERMISSION_ERROR' || classified.code === 'INVALID_REQUEST') {
          break;
        }

        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
  }
  throw lastError;
}

const app = express();

async function startServer() {

  const PORT = 3000;

  app.use(express.json());

  app.use(cors());

  // Global rate limiter
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(globalLimiter);

  // Stricter rate limiter for AI / terminal execution routes
  const strictLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120, // 120 requests per minute
    message: 'Too many high-cost requests, please slow down.',
  });
  app.use('/api/aman', strictLimiter);
  app.use('/api/terminal', strictLimiter);
  app.use('/api/investigate', strictLimiter);


  // Security Hardening Headers Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok'
    });
  });

  // AUTHORITATIVE SERVER-SIDE FLAG VALIDATION
  const AUTHORITATIVE_FLAGS: Record<string, string> = {
    'ctf-01': 'MCL{welcome_to_cyber_lab_1337}',
    'ctf-02': 'MCL{linux_hidden_files_uncovered}',
    'ctf-03': 'MCL{base64_is_not_encryption_just_encoding}',
    'ctf-04': 'MCL{rot13_cipher_is_a_classic}',
    'ctf-05': 'MCL{cleartext_http_leaks_secrets}',
    'ctf-06': 'MCL{sql_injection_bypassed_auth_2026}',
    'ctf-07': 'MCL{suid_root_execution_privesc}',
    'ctf-08': 'MCL{kerberoasted_service_ticket_cracked}',
    'range-recon': 'FLAG{NIGHTFALL_PERIMETER_RECON_CLEAR}',
    'range-foothold': 'FLAG{DMZ_INITIAL_FOOTHOLD_ACQUIRED}',
    'range-privesc': 'FLAG{DMZ_ROOT_PRIVILEGE_UNLOCKED}',
    'range-pivot': 'FLAG{PIVOT_TUNNEL_ESTABLISHED_VLAN20}',
    'range-db-creds': 'FLAG{DATABASE_CREDENTIALS_RECOVERED}',
    'range-kerberoast': 'FLAG{KERBEROAST_CRACKED_SUCCESS}',
    'range-admin': 'FLAG{ENTERPRISE_DOMAIN_ADMIN_REACHED}',
    'range-containment': 'FLAG{ENTERPRISE_CONTAINMENT_VERIFIED}',
    'web-sqli': 'FLAG{SQLI_AUTH_BYPASS_UNION_EXTRACTED_9918}',
    'web-idor': 'FLAG{IDOR_PARAMETER_POLLUTION_UNAUTHORIZED_ACCESS_2026}',
    'net-wire': 'FLAG{WIRESHARK_STREAM_UNMASKED_8812}',
    'net-dns': 'FLAG{DIG_DNS_RECORDS_VERIFIED_7712}',
    'net-curl': 'FLAG{CURL_HEADER_INSPECTION_OK_1044}'
  };

  app.post('/api/labs/validate-flag', (req, res) => {
    try {
      const { labId, flag } = req.body;
      if (!labId || !flag) {
        return res.status(400).json({ success: false, message: 'Lab ID and Flag are required.' });
      }

      const expected = AUTHORITATIVE_FLAGS[labId] || AUTHORITATIVE_FLAGS[labId.toLowerCase()];
      if (!expected) {
        return res.status(404).json({ success: false, message: 'Lab flag validator not found for this identifier.' });
      }

      const submitted = flag.trim();
      const isCorrect = submitted === expected;

      return res.json({
        success: isCorrect,
        message: isCorrect 
          ? 'SUCCESS: Authoritative server-side validation passed! Access granted.' 
          : 'FAIL: Server-side check failed. Invalid flag pattern or mismatch.'
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // SECURE BACKEND TERMINAL EXECUTION INSIDE CONFINED WORKSPACE
  app.post('/api/terminal/execute', (req, res) => {
    try {
      const { command, workingDirectory, engagementId } = req.body;

      if (typeof command !== 'string') {
        return res.status(400).json({ error: 'Command string is required.' });
      }

      const cmd = command.trim();
      let nextDir = workingDirectory || '/home/student';

      if (!cmd) {
        return res.json({ output: '', workingDirectory: nextDir, provider: 'Development/controlled sandbox' });
      }

      // Server-Side ACE Scope Validation Engine
      // Load authoritative engagement from server data if engagementId provided or active
      const targetEngagementId = engagementId || 'ace-northstar-01';
      const engagement = AUTHORIZED_CLIENT_ENGAGEMENTS.find(e => e.id === targetEngagementId) || null;

      // Validate command against authoritative server-side engagement scope policy
      const scopeCheck = validateAceCommandScope(cmd, engagement);
      if (!scopeCheck.allowed) {
        return res.status(403).json({
          error: 'ACTION DENIED BY SERVER SCOPE POLICY',
          output: `[!] SERVER SCOPE ENFORCEMENT ENGINE [DENIED]\n${scopeCheck.reason}\n\nAll server actions are audited. Target subnet: ${engagement?.scope?.authorizedSubnet || 'None'}`,
          isError: true,
          category: scopeCheck.category,
          workingDirectory: nextDir,
          provider: 'Development/controlled sandbox'
        });
      }

      if (process.env.REAL_RANGE_ENABLED !== 'true') {
        return res.status(403).json({ 
          error: 'The isolated cyber range infrastructure is currently disconnected. Please use the simulated terminal.',
          output: 'ERROR: Cyber Range Disconnected. Please use the Simulated Training Terminal.',
          isError: true,
          workingDirectory: req.body.workingDirectory || '/home/student',
          provider: 'Development/controlled sandbox'
        });
      }

      // 1. Establish the sandbox directory structure
      const sandboxRoot = '/tmp/mcl_sandbox';
      const homeStudent = path.join(sandboxRoot, 'home/student');
      const labsDir = path.join(sandboxRoot, 'labs');
      const tmpDir = path.join(sandboxRoot, 'tmp');

      // Create paths
      fs.mkdirSync(homeStudent, { recursive: true });
      fs.mkdirSync(labsDir, { recursive: true });
      fs.mkdirSync(tmpDir, { recursive: true });

      // Seed baseline files if they do not exist
      const notesPath = path.join(homeStudent, 'notes.txt');
      if (!fs.existsSync(notesPath)) {
        fs.writeFileSync(notesPath, `=== MY CYBER LAB STUDENT NOTES ===\n1. Security starts with understanding normal baseline telemetry.\n2. Always verify host identity with "whoami" and "id".\n3. Port audits begin with "ss -tuln" and "ip addr".\n4. Never execute unknown scripts outside the safe training lab.`);
      }

      const secretFlagPath = path.join(labsDir, 'vault/.secret_flag');
      fs.mkdirSync(path.dirname(secretFlagPath), { recursive: true });
      if (!fs.existsSync(secretFlagPath)) {
        fs.writeFileSync(secretFlagPath, `FLAG{LINUX_TERMINAL_MASTERY_APEX_8891}`);
      }

      const auditScriptPath = path.join(labsDir, 'network_audit.sh');
      if (!fs.existsSync(auditScriptPath)) {
        fs.writeFileSync(auditScriptPath, '#!/bin/bash\necho "[*] Auditing range 10.10.10.0/24..."\necho "[+] Found active training target at 10.10.10.5"');
        fs.chmodSync(auditScriptPath, '755');
      }

      // Map virtual dir to physical path
      let physicalCwd = homeStudent;
      if (nextDir === '/') {
        physicalCwd = sandboxRoot;
      } else if (nextDir.startsWith('/home/student')) {
        physicalCwd = homeStudent;
      } else if (nextDir.startsWith('/labs')) {
        physicalCwd = labsDir;
      } else if (nextDir.startsWith('/tmp')) {
        physicalCwd = tmpDir;
      }

      // Intercept standard directory navigation (cd command)
      const parts = cmd.split(/\s+/);
      const baseCmd = parts[0].toLowerCase();
      const arg = parts[1];

      if (baseCmd === 'cd') {
        const target = arg || '/home/student';
        if (target === '..') {
          if (nextDir === '/labs' || nextDir === '/tmp' || nextDir === '/home/student') {
            nextDir = '/';
          } else {
            nextDir = '/home/student';
          }
        } else if (target === '/') {
          nextDir = '/';
        } else if (target === '/labs' || target === 'labs') {
          nextDir = '/labs';
        } else if (target === '/tmp' || target === 'tmp') {
          nextDir = '/tmp';
        } else if (target === '/home/student' || target === 'home/student') {
          nextDir = '/home/student';
        } else {
          // Check if directory exists physically in sandbox
          const testPath = path.resolve(physicalCwd, target);
          if (fs.existsSync(testPath) && fs.statSync(testPath).isDirectory()) {
            const rel = path.relative(sandboxRoot, testPath);
            nextDir = '/' + rel;
          } else {
            return res.json({
              output: `cd: ${target}: No such file or directory`,
              isError: true,
              workingDirectory: nextDir,
              provider: 'Development/controlled sandbox'
            });
          }
        }
        return res.json({
          output: '',
          isError: false,
          workingDirectory: nextDir,
          provider: 'Development/controlled sandbox'
        });
      }

      // Emulate student environment attributes safely
      if (baseCmd === 'whoami') {
        return res.json({
          output: 'student\n',
          isError: false,
          workingDirectory: nextDir,
          provider: 'Development/controlled sandbox'
        });
      }

      if (baseCmd === 'id') {
        return res.json({
          output: 'uid=1001(student) gid=1001(student) groups=1001(student)\n',
          isError: false,
          workingDirectory: nextDir,
          provider: 'Development/controlled sandbox'
        });
      }

      if (baseCmd === 'uname') {
        const flag = parts[1] || '';
        return res.json({
          output: flag.includes('a') ? 'Linux mycyberlab-node 5.15.0-generic #1 SMP x86_64 GNU/Linux\n' : 'Linux\n',
          isError: false,
          workingDirectory: nextDir,
          provider: 'Development/controlled sandbox'
        });
      }

      // Configure a secure unprivileged sub-environment with scrubbed variables
      const env = {
        PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        HOME: '/home/student',
        USER: 'student',
        SHELL: '/bin/bash',
        TERM: 'xterm-256color',
      };

      // Block attempts to dump server secrets, breakout shell, or perform path traversal
      const lowerCmd = cmd.toLowerCase();
      const forbiddenTokens = [
        '../',
        '..\\',
        '/etc',
        '/var',
        '/proc',
        '/sys',
        '/root',
        '/app',
        '/dist',
        'process.env',
        ':(){ :|:& };:',
        'mkfs',
        'chmod 777',
        'chown',
        '/dev/tcp',
        '/dev/udp',
        'nc -e',
        'nc.traditional -e',
        'eval(',
        'import.meta'
      ];

      const hasForbidden = forbiddenTokens.some(token => lowerCmd.includes(token));
      const hasEnvAttempt = lowerCmd.includes('env') && (lowerCmd.includes('api') || lowerCmd.includes('key') || lowerCmd.includes('secret') || lowerCmd.includes('firebase') || lowerCmd.includes('gemini'));

      if (hasForbidden || hasEnvAttempt) {
        return res.json({
          output: 'Permission Denied: System security policy prevents access to host system hierarchies, kernel subsystems, and protected runtime credentials.',
          isError: true,
          workingDirectory: nextDir,
          provider: 'Development/controlled sandbox'
        });
      }

      // Run safely under the allocated physical path
      exec(cmd, { cwd: physicalCwd, timeout: 3000, maxBuffer: 1024 * 500, env }, (error: any, stdout: string, stderr: string) => {
        let output = stdout + stderr;
        let isError = !!error;

        // Scrub physical root and sensitive filesystem paths from output
        if (output) {
          output = output.replace(new RegExp(sandboxRoot, 'g'), '');
          output = output.replace(/\/workspace/g, '');
        }

        if (error && error.killed) {
          output = `Process terminated: Execution exceeded the isolated environment timeout of 3.0 seconds.`;
          isError = true;
        } else if (error && error.code === 127) {
          output = `bash: ${baseCmd}: command not found`;
          isError = true;
        }

        return res.json({
          output: output || '',
          isError,
          workingDirectory: nextDir,
          provider: 'Development/controlled sandbox'
        });
      });

    } catch (err: any) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Authoritative server-side flag validation endpoint
  app.post('/api/labs/validate-flag', (req, res) => {
    try {
      const { labId, flag } = req.body || {};
      if (!labId || !flag) {
        return res.status(400).json({ success: false, message: 'Missing challenge identifier or flag submission.' });
      }

      const submitted = flag.trim();
      const canonicalFlags: Record<string, string> = {
        'ctf-01': 'MCL{welcome_to_cyber_lab_1337}',
        'ctf-02': 'MCL{linux_hidden_files_uncovered}',
        'ctf-03': 'MCL{base64_is_not_encryption_just_encoding}',
        'ctf-04': 'MCL{rot13_cipher_is_a_classic}',
        'ctf-05': 'MCL{cleartext_http_leaks_secrets}',
        'ctf-06': 'MCL{sql_injection_bypassed_auth_2026}',
        'ctf-07': 'MCL{suid_root_execution_privesc}',
        'ctf-08': 'MCL{bandit_level_0_complete_391a}'
      };

      const expected = canonicalFlags[labId];
      if (!expected) {
        return res.status(404).json({ success: false, message: 'Challenge reference not registered on server authority.' });
      }

      if (submitted === expected) {
        return res.json({
          success: true,
          message: `ACCESS GRANTED! Server-authoritative check succeeded. Flag accepted. +50-250 Points & XP credited.`
        });
      }

      return res.json({
        success: false,
        message: 'ACCESS DENIED! Invalid flag hash string. Try again or check command clues.'
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // AMAN Transcription
  app.post('/api/aman/transcribe', async (req, res) => {
    try {
      const { audioData, mimeType } = req.body;
      if (!audioData) return res.status(400).json({ error: 'Audio data is required' });

      const client = getGeminiClient();
      if (!client) return res.status(503).json({ error: 'AI unavailable' });

      const response = await generateContentWithFallback(client, {
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType || 'audio/webm', data: audioData } },
            { text: 'Transcribe this audio accurately. If it is Hindi/Hinglish, write it in Roman script. If it is English, write it in English. Return ONLY the transcription.' }
          ]
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('AMAN Transcription Error:', error);
      res.json({ text: '[Voice audio transcribed locally]' });
    }
  });

  // AMAN Chat (Streaming) with Autonomous Pedagogy & Socratic/Debate Capabilities
  app.post('/api/aman/chat', async (req, res) => {
    const { message, history, contextData, mode = 'TEACH', executionMode = 'FAST', useWebResearch } = req.body || {};
    const userLang = contextData?.language || 'Auto';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const client = getGeminiClient();
    
    if (!client) {
      console.warn('[AMAN Chat] No Gemini client initialized. Serving Local Guidance Mode directly.');
      const userQueryStr = typeof message === 'string' ? message : 'Hello';
      const localResp = generateLocalGuidanceResponse(userQueryStr, contextData, userLang, 'NO_API_KEY');
      res.write(`data: ${JSON.stringify({ text: localResp.fullText, isLocalGuidance: true, amanStatus: 'LOCAL_GUIDANCE' })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, isLocalGuidance: true, amanStatus: 'LOCAL_GUIDANCE' })}\n\n`);
      return res.end();
    }

    try {
      const activeMode = mode || contextData?.activeMode || 'TEACH';

      let modeGuideline = '';
      switch (activeMode) {
        case 'SOCRATIC':
          modeGuideline = `TEACHING STYLE: SOCRATIC COACH.
- Never give direct answers right away.
- Ask 1-2 sharp, guiding questions that lead the learner to discover the answer themselves.
- Provide progressive hints if the learner is stuck.
- Focus on developing analytical intuition rather than rote memorization.`;
          break;
        case 'DEBATE':
          modeGuideline = `TEACHING STYLE: DEBATE / CHALLENGE MODE.
- Respectfully challenge the learner's assumptions, over-simplifications, or common cybersecurity misconceptions.
- Maintain a polite, collegial, rigorous tone — never insulting, always educational.`;
          break;
        case 'DEEP_DIVE':
          modeGuideline = `TEACHING STYLE: DEEP DIVE ARCHITECT.
- Provide exhaustive, low-level technical depth (packet headers, TCP state machines, kernel permissions, memory layout, RFC references, defensive telemetry).`;
          break;
        case 'LAB_MENTOR':
          modeGuideline = `TEACHING STYLE: LAB MENTOR.
- Guide the learner through their current hands-on lab task and command line operations.`;
          break;
        case 'INTERVIEW':
          modeGuideline = `TEACHING STYLE: TECHNICAL HIRING MANAGER.
- Conduct a realistic cybersecurity job interview asking one question at a time.`;
          break;
        default:
          modeGuideline = `TEACHING STYLE: SENIOR CYBERSECURITY INSTRUCTOR.
- Clear, structured, encouraging, technically precise.
- Summarize with actionable next steps.`;
      }

      const systemInstruction = `You are AMAN, the central intelligence and autonomous Senior Cybersecurity Instructor of MY CYBER LAB.
You are the learner's personal mentor, tutor, and career strategist.

PRIMARY OBJECTIVES:
1. ALWAYS KNOW WHERE THE LEARNER IS: You have direct access to their learning telemetry.
2. PROVIDE CONTINUOUS ADAPTIVE GUIDANCE: Recommend what to do next and explain WHY.
3. ADAPT TO TEACHING MODE:
${modeGuideline}

CRITICAL INTENT ROUTING & CONTEXT GATING (IMMUTABLE):
1. USER INTENT OVERRIDES CURRENT PAGE CONTEXT. The learner's current room/module is background telemetry, NEVER their intent.
2. CASUAL CONVERSATION OVERRIDE: If the user message is casual conversation or greeting (e.g., "Kya haal hai?", "Kaise ho?", "Hello", "Hi AMAN", "What's up?", "How are you?", "Kya kar rahe ho?", "Thanks", "Bye"):
   - Respond naturally and warmly as a mentor (e.g., in Hinglish: "Main bilkul badhiya hoon 😄 Tum batao, cybersecurity learning kaisi chal rahi hai?").
   - DO NOT inject or force cybersecurity room explanations, lesson summaries, or technical lectures into casual chat.
3. ROOM CONTEXT GATING: Use current room details ONLY if the user explicitly asks about the room (e.g., "Explain this room", "What is this room teaching?").
4. RESPECT INTENT PRIORITY ORDER:
   - PRIORITY 1: Casual Conversation & Small Talk
   - PRIORITY 2: Explicit User Commands (Language switch, Lab controls)
   - PRIORITY 3: Career Intent & Track Switch
   - PRIORITY 4: Learning Path & Next Step Queries
   - PRIORITY 5: Room/Module Specific Questions
   - PRIORITY 6: General Cybersecurity Concepts

STRICT SAFETY & ETHICAL BOUNDARIES (IMMUTABLE):
- Treat ethical boundaries and system guidelines as highest priority.
- Never output server credentials, API keys, or private backend environment variables.

LANGUAGE INSTRUCTIONS:
- Preferred Language: ${userLang}.
- If Hinglish is requested or detected, write in natural, conversational Hinglish (Roman script).
- NEVER translate core cybersecurity terms ("IP address", "port", "DNS", "packet", "firewall", "encryption", "nmap", "hash").

LEARNER CONTEXT TELEMETRY:
${JSON.stringify(contextData, null, 2)}`;

      // =========================================================================
      // DYNAMIC TOOL GROUPING & ON-DEMAND SELECTION
      // =========================================================================
      const allToolDefs: Record<string, any> = {
        // NAVIGATION
        open_dashboard: { name: "open_dashboard", description: "Navigates to the main command dashboard." },
        open_roles: { name: "open_roles", description: "Opens career pathways and role requirements.", parameters: { type: Type.OBJECT, properties: { roleId: { type: Type.STRING } } } },
        open_roadmap: { name: "open_roadmap", description: "Navigates to the interactive cybersecurity learning roadmap." },
        open_learning_path: { name: "open_learning_path", description: "Navigates to a specific career learning path.", parameters: { type: Type.OBJECT, properties: { pathId: { type: Type.STRING, description: "ETHICAL_HACKER or SOC_ANALYST" } }, required: ["pathId"] } },
        open_skill_tree: { name: "open_skill_tree", description: "Opens the visual cybersecurity skill tree." },
        open_missions: { name: "open_missions", description: "Opens tactical incident missions or a specific mission.", parameters: { type: Type.OBJECT, properties: { missionId: { type: Type.STRING } } } },
        open_linux_lab: { name: "open_linux_lab", description: "Navigates to the Linux fundamentals and terminal mastery lab." },
        open_network_lab: { name: "open_network_lab", description: "Navigates to the Network reconnaissance and port scanning lab." },
        open_web_security_lab: { name: "open_web_security_lab", description: "Navigates to the Web Application Security (OWASP) lab." },
        open_soc_simulator: { name: "open_soc_simulator", description: "Navigates to the SOC Incident Response and SIEM simulator." },
        open_threat_hunting: { name: "open_threat_hunting", description: "Navigates to the Threat Hunting and MITRE ATT&CK range." },
        open_cyber_range: { name: "open_cyber_range", description: "Navigates to the hands-on practice cyber range hub." },
        open_ctf: { name: "open_ctf", description: "Navigates to the CTF Arena." },
        open_ace: { name: "open_ace", description: "Navigates to the Authorized Client Engagement and evidence locker." },
        open_evidence_locker: { name: "open_evidence_locker", description: "Navigates to the ACE Forensic Evidence Locker.", parameters: { type: Type.OBJECT, properties: { filterTag: { type: Type.STRING } } } },
        open_study_plan: { name: "open_study_plan", description: "Navigates to the AI Personalized Study Plan." },
        open_portfolio: { name: "open_portfolio", description: "Navigates to the user portfolio and verified skills." },
        open_certificate: { name: "open_certificate", description: "Navigates to the cryptographic certificate issuance and verification page." },
        open_module: { name: "open_module", description: "Navigates to a specific training module or lab.", parameters: { type: Type.OBJECT, properties: { moduleId: { type: Type.STRING, description: "Module keyword (e.g. linux-lab, network-lab, web-security, soc-simulator)" } }, required: ["moduleId"] } },
        open_page: { name: "open_page", description: "Navigates to a specific page.", parameters: { type: Type.OBJECT, properties: { page: { type: Type.STRING } }, required: ["page"] } },

        // LEARNING
        get_current_learning_position: { name: "get_current_learning_position", description: "Gets the learner's current course, module, lesson, and next required skill." },
        get_progress: { name: "get_progress", description: "Gets the user's XP, cyber level, completed labs, and weakness areas." },
        get_skill_gaps: { name: "get_skill_gaps", description: "Analyzes the user's skill gaps and recommended remediation." },
        get_completed_modules: { name: "get_completed_modules", description: "Lists modules completed by the user." },
        get_available_modules: { name: "get_available_modules", description: "Lists all available modules." },
        get_skill_tree: { name: "get_skill_tree", description: "Fetches user skill mastery levels across Linux, Networking, Web Security, SOC, etc." },
        recommend_next_module: { name: "recommend_next_module", description: "Recommends the best next cybersecurity module." },
        generate_quiz: { name: "generate_quiz", description: "Generates active-recall scenario quiz questions.", parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, count: { type: Type.NUMBER } }, required: ["topic"] } },
        explain_topic: { name: "explain_topic", description: "Explains any cybersecurity or technical concept.", parameters: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, depth: { type: Type.STRING } }, required: ["topic"] } },
        give_hint: { name: "give_hint", description: "Provides a Socratic hint for the current challenge." },
        review_mistakes: { name: "review_mistakes", description: "Analyzes recent mistakes and provides actionable corrections." },

        // MISSIONS
        get_current_mission: { name: "get_current_mission", description: "Gets current active mission objective and scope." },
        start_mission: { name: "start_mission", description: "Starts a tactical incident mission.", parameters: { type: Type.OBJECT, properties: { missionId: { type: Type.STRING } }, required: ["missionId"] } },

        // LAB
        execute_simulated_command: { name: "execute_simulated_command", description: "Runs a command in the safe simulated training sandbox.", parameters: { type: Type.OBJECT, properties: { command: { type: Type.STRING }, workingDirectory: { type: Type.STRING } }, required: ["command"] } },
        inspect_virtual_filesystem: { name: "inspect_virtual_filesystem", description: "Inspects virtual sandbox directory.", parameters: { type: Type.OBJECT, properties: { path: { type: Type.STRING } }, required: ["path"] } },

        // EVIDENCE
        list_evidence: { name: "list_evidence", description: "Fetches captured forensic evidence items from the locker." },
        create_evidence: { name: "create_evidence", description: "Saves a new finding to the Evidence Locker.", parameters: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, type: { type: Type.STRING } }, required: ["title", "description"] } },
        delete_evidence: { name: "delete_evidence", description: "Deletes a piece of evidence (Requires user confirmation).", parameters: { type: Type.OBJECT, properties: { evidenceId: { type: Type.STRING } }, required: ["evidenceId"] } },

        // CAREER
        get_current_career: { name: "get_current_career", description: "Gets the active career track and readiness score." },
        get_career_progress: { name: "get_career_progress", description: "Calculates career readiness score and target skills." },
        get_role_requirements: { name: "get_role_requirements", description: "Gets requirements and average salary for a cybersecurity role.", parameters: { type: Type.OBJECT, properties: { roleId: { type: Type.STRING } }, required: ["roleId"] } },
        generate_interview_questions: { name: "generate_interview_questions", description: "Generates realistic technical interview questions for a career role.", parameters: { type: Type.OBJECT, properties: { role: { type: Type.STRING } }, required: ["role"] } },

        // ACCOUNT
        get_profile: { name: "get_profile", description: "Gets current user profile." },
        get_learning_statistics: { name: "get_learning_statistics", description: "Retrieves learning analytics and streak records." },

        // STUDY
        create_study_plan: { name: "create_study_plan", description: "Generates a personalized daily study plan.", parameters: { type: Type.OBJECT, properties: { minutesPerDay: { type: Type.NUMBER }, focusTopic: { type: Type.STRING } } } }
      };

      const queryStr = typeof message === 'string' ? message.toLowerCase() : '';
      
      // Determine relevant tool subsets based on user query
      const selectedToolNames = new Set<string>();

      // 1. Navigation intents
      if (/open|navigate|go to|take me to|switch to|launch|view|show lab|show module/.test(queryStr)) {
        ['open_dashboard', 'open_roles', 'open_roadmap', 'open_learning_path', 'open_skill_tree', 'open_missions', 'open_linux_lab', 'open_network_lab', 'open_web_security_lab', 'open_soc_simulator', 'open_threat_hunting', 'open_cyber_range', 'open_ctf', 'open_ace', 'open_evidence_locker', 'open_study_plan', 'open_portfolio', 'open_certificate', 'open_module', 'open_page'].forEach(t => selectedToolNames.add(t));
      }

      // 2. Learning / Progress / Weakness intents
      if (/progress|xp|level|stats|weakness|gap|weak skill|recommend|next module|quiz|hint|mistake/.test(queryStr)) {
        ['get_current_learning_position', 'get_progress', 'get_skill_gaps', 'get_completed_modules', 'get_available_modules', 'get_skill_tree', 'recommend_next_module', 'generate_quiz', 'explain_topic', 'give_hint', 'review_mistakes'].forEach(t => selectedToolNames.add(t));
      }

      // 3. Missions
      if (/mission|incident|briefing|objective/.test(queryStr)) {
        ['open_missions', 'get_current_mission', 'start_mission'].forEach(t => selectedToolNames.add(t));
      }

      // 4. Lab commands
      if (/run|execute|command|terminal|sandbox|ls|grep|cat|inspect/.test(queryStr)) {
        ['execute_simulated_command', 'inspect_virtual_filesystem', 'open_linux_lab', 'open_network_lab', 'open_web_security_lab', 'open_soc_simulator', 'open_threat_hunting'].forEach(t => selectedToolNames.add(t));
      }

      // 5. Evidence
      if (/evidence|locker|finding|artifact|delete evidence/.test(queryStr)) {
        ['open_evidence_locker', 'list_evidence', 'create_evidence', 'delete_evidence'].forEach(t => selectedToolNames.add(t));
      }

      // 6. Career
      if (/career|role|salary|interview|readiness|job/.test(queryStr)) {
        ['open_roles', 'get_current_career', 'get_career_progress', 'get_role_requirements', 'generate_interview_questions'].forEach(t => selectedToolNames.add(t));
      }

      // 7. Study plan
      if (/study plan|daily goal|schedule|study routine/.test(queryStr)) {
        ['open_study_plan', 'create_study_plan', 'get_progress', 'recommend_next_module'].forEach(t => selectedToolNames.add(t));
      }

      // If deep reasoning mode or mission coach mode, include comprehensive tool suite
      if (executionMode === 'DEEP' || activeMode === 'MISSION_COACH') {
        Object.keys(allToolDefs).forEach(t => selectedToolNames.add(t));
      }

      // If no tools match (e.g. pure concept question: "Explain TCP", "Teach me subnetting", "What is SQLi", etc.), send undefined tools for zero overhead & instant streaming
      const baseTools = selectedToolNames.size > 0
        ? [{ functionDeclarations: Array.from(selectedToolNames).map(name => allToolDefs[name]).filter(Boolean) }]
        : [];
      if (useWebResearch) {
        baseTools.push({ googleSearch: {} } as any);
      }
      const activeToolsConfig = baseTools.length > 0 ? baseTools : undefined;

      const formattedHistory = (history || []).map((msg: any) => {
        const role = (msg.role === 'aman' || msg.role === 'model') ? 'model' : 'user';
        const parts = msg.parts || [{ text: msg.text || '' }];
        return {
          role,
          parts: parts.length > 0 ? parts : [{ text: '' }]
        };
      });

      let chatMessageContent: any = message;
      if (typeof message === 'object' && message.parts) {
        chatMessageContent = message.parts;
      } else if (typeof message === 'object' && Array.isArray(message)) {
        chatMessageContent = message;
      } else if (typeof message === 'string') {
        chatMessageContent = message.trim() || 'Hello';
      } else {
        chatMessageContent = String(message || 'Hello');
      }

      let stream: any = null;
      let lastError: any = null;
      let selectedModel = '';

      const modelCandidates = executionMode === 'DEEP' 
        ? [process.env.GEMINI_DEEP_MODEL || 'gemini-3.7-flash', ...GEMINI_FALLBACK_MODELS]
        : [process.env.GEMINI_FAST_MODEL || 'gemini-3.7-flash', ...GEMINI_FALLBACK_MODELS];
      const uniqueModelCandidates = Array.from(new Set(modelCandidates));

      for (const modelName of uniqueModelCandidates) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            const chat = client.chats.create({
              model: modelName,
              config: { 
                systemInstruction,
                tools: activeToolsConfig
              },
              history: formattedHistory,
            });

            stream = await chat.sendMessageStream({ message: chatMessageContent });
            selectedModel = modelName;
            break;
          } catch (err: any) {
            lastError = err;
            const classified = classifyGeminiError(err);
            console.warn(`[AMAN Chat] ${modelName} attempt ${attempt} failed (${classified.code}: ${classified.technicalDetails})`);
            
            if (classified.code === 'AUTHENTICATION_OR_PERMISSION_ERROR' || classified.code === 'INVALID_REQUEST') {
              break;
            }

            if (attempt < 2) {
              await new Promise(resolve => setTimeout(resolve, 300));
            }
          }
        }
        if (stream) break;
      }

      let chunksStreamedCount = 0;

      if (stream) {
        try {
          for await (const chunk of stream) {
            if (chunk.text) {
              chunksStreamedCount++;
              res.write(`data: ${JSON.stringify({ text: chunk.text, modelUsed: selectedModel, amanStatus: 'CONNECTED' })}\n\n`);
            }
            if (chunk.functionCalls && chunk.functionCalls.length > 0) {
              res.write(`data: ${JSON.stringify({ functionCalls: chunk.functionCalls })}\n\n`);
            }
          }
          res.write(`data: ${JSON.stringify({ done: true, amanStatus: 'CONNECTED' })}\n\n`);
          return res.end();
        } catch (streamError: any) {
          console.error(`[AMAN Chat] Error streaming response from ${selectedModel}:`, streamError);
          lastError = streamError;
        }
      }

      // Stream failed or model unavailable -> Local Guidance Fallback
      const classifiedError = classifyGeminiError(lastError);
      console.warn(`[AMAN Chat Local Guidance Triggered] Error Category: ${classifiedError.code}. Chunks previously streamed: ${chunksStreamedCount}`);

      const userQueryStr = typeof message === 'string' ? message : (Array.isArray(message) ? message.map(p => p.text || '').join(' ') : 'Hello');
      const localResp = generateLocalGuidanceResponse(userQueryStr, contextData, userLang, classifiedError.code);

      if (chunksStreamedCount > 0) {
        const continuationText = `\n\n*(Continuing in Local Guidance Mode)*\n\n` + localResp.summary;
        res.write(`data: ${JSON.stringify({ text: continuationText, isLocalGuidance: true, amanStatus: 'LOCAL_GUIDANCE' })}\n\n`);
      } else {
        res.write(`data: ${JSON.stringify({ text: localResp.fullText, isLocalGuidance: true, amanStatus: 'LOCAL_GUIDANCE' })}\n\n`);
      }

      res.write(`data: ${JSON.stringify({ done: true, isLocalGuidance: true, amanStatus: 'LOCAL_GUIDANCE' })}\n\n`);
      res.end();
    } catch (globalErr: any) {
      console.error('[AMAN Chat Global Error]:', globalErr);
      const classified = classifyGeminiError(globalErr);
      const userQueryStr = typeof message === 'string' ? message : 'Hello';
      const localResp = generateLocalGuidanceResponse(userQueryStr, contextData, userLang, classified.code);
      res.write(`data: ${JSON.stringify({ text: localResp.fullText, isLocalGuidance: true, amanStatus: 'LOCAL_GUIDANCE' })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, isLocalGuidance: true, amanStatus: 'LOCAL_GUIDANCE' })}\n\n`);
      res.end();
    }
  });

  // AMAN Adaptive Diagnostic Assessment Endpoint
  app.post('/api/aman/diagnostic', async (req, res) => {
    try {
      const { careerPath, currentLevel, answers, language } = req.body;
      const client = getGeminiClient();
      const userLang = language || 'English';

      if (!client) {
        return res.json({
          offline: true,
          assessedLevel: 'Intermediate-Ready',
          score: 80,
          strengths: ['Networking Fundamentals', 'Basic Linux Commands'],
          weaknesses: ['Subnet Masking (CIDR)', 'Port & Protocol Mapping'],
          recommendedStartingNode: 'Networking Fundamentals → Subnetting Practice',
          customRoadmapFocus: 'Deepen TCP/IP packet analysis before advancing to incident triage.',
          summaryHinglish: 'Aapka basic networking clear hai, lekin CIDR calculation mein practice ki zarurat hai.'
        });
      }

      const systemInstruction = `You are AMAN, Lead Cybersecurity Diagnostic Assessor for "My Cyber Lab".
Target Language: ${userLang}.
Analyze the learner's diagnostic performance and career goal (${careerPath || 'SOC Analyst'}).
Return a structured JSON assessment with tailored strengths, identified skill gaps, calibrated starting point, and reasoning.`;

      const response = await generateContentWithFallback(client, {
        contents: `Evaluate diagnostic answers: ${JSON.stringify(answers || [])} for career track: ${careerPath || 'General Cybersecurity'}.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              assessedLevel: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedStartingNode: { type: Type.STRING },
              customRoadmapFocus: { type: Type.STRING },
              summaryHinglish: { type: Type.STRING }
            },
            required: ['score', 'assessedLevel', 'strengths', 'weaknesses', 'recommendedStartingNode', 'customRoadmapFocus']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty response from AI');
      return res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('AMAN Diagnostic Error:', error);
      return res.json({
        offline: true,
        assessedLevel: 'Intermediate-Ready',
        score: 80,
        strengths: ['Networking Fundamentals', 'Basic Linux Commands'],
        weaknesses: ['Subnet Masking (CIDR)', 'Port & Protocol Mapping'],
        recommendedStartingNode: 'Networking Fundamentals → Subnetting Practice',
        customRoadmapFocus: 'Deepen TCP/IP packet analysis before advancing to incident triage.',
        summaryHinglish: 'Aapka basic networking clear hai, lekin CIDR calculation mein practice ki zarurat hai.'
      });
    }
  });

  // AMAN Path Transition & Capstone Debrief Endpoint
  app.post('/api/aman/debrief', async (req, res) => {
    const { completedPath, nextPath, learnerTelemetry, language } = req.body || {};
    try {
      const client = getGeminiClient();
      const userLang = language || 'English';

      if (!client) {
        return res.json({
          offline: true,
          title: `Path Completion Debrief: ${completedPath || 'Networking Fundamentals'}`,
          executiveSummary: `Congratulations! You have mastered the core foundations of ${completedPath}. You are now ready to transition to ${nextPath || 'Web Security'}.`,
          topCompetencies: ['Packet Analysis', 'Port Scanning', 'Basic Triage'],
          areasForOngoingPractice: ['SIEM Query Optimization'],
          transitionWhy: `The packet and protocol knowledge you mastered in ${completedPath} directly enables you to inspect HTTP request/response payloads in ${nextPath}.`,
          firstRecommendedLab: 'HTTP Request Explorer Lab'
        });
      }

      const systemInstruction = `You are AMAN, Senior Cybersecurity Instructor for "My Cyber Lab".
Target Language: ${userLang}.
Generate a comprehensive, encouraging, and rigorous Path Completion Debrief or Capstone Evaluation.
Explain what was accomplished, remaining areas for refinement, and why the next career path connects seamlessly.`;

      const response = await generateContentWithFallback(client, {
        contents: `Debrief completed path: "${completedPath}" transitioning to: "${nextPath}". Telemetry: ${JSON.stringify(learnerTelemetry || {})}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              executiveSummary: { type: Type.STRING },
              topCompetencies: { type: Type.ARRAY, items: { type: Type.STRING } },
              areasForOngoingPractice: { type: Type.ARRAY, items: { type: Type.STRING } },
              transitionWhy: { type: Type.STRING },
              firstRecommendedLab: { type: Type.STRING }
            },
            required: ['title', 'executiveSummary', 'topCompetencies', 'areasForOngoingPractice', 'transitionWhy', 'firstRecommendedLab']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty debrief response');
      return res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('AMAN Debrief Error:', error);
      return res.json({
        offline: true,
        title: `Path Completion Debrief: ${completedPath || 'Networking Fundamentals'}`,
        executiveSummary: `Congratulations! You have mastered the core foundations of ${completedPath}. You are now ready to transition to ${nextPath || 'Web Security'}.`,
        topCompetencies: ['Packet Analysis', 'Port Scanning', 'Basic Triage'],
        areasForOngoingPractice: ['SIEM Query Optimization'],
        transitionWhy: `The packet and protocol knowledge you mastered in ${completedPath} directly enables you to inspect HTTP request/response payloads in ${nextPath}.`,
        firstRecommendedLab: 'HTTP Request Explorer Lab'
      });
    }
  });

  // AMAN Video Generation
  app.post('/api/aman/video/start', async (req, res) => {
    const { prompt } = req.body;
    try {
      const client = getGeminiClient();
      if (!client) return res.status(503).json({ error: 'AI unavailable' });

      const operation = await client.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          aspectRatio: '16:9'
        }
      });
      res.json({ operationName: operation.name });
    } catch (error: any) {
      try {
         const client = getGeminiClient();
         if (!client) return res.status(503).json({ error: 'AI unavailable' });
         const operation = await client.models.generateVideos({
           model: 'veo-3.1-lite-generate-preview',
           prompt: prompt,
           config: { numberOfVideos: 1, aspectRatio: '16:9' }
         });
         res.json({ operationName: operation.name });
      } catch(err2: any) {
         res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  app.post('/api/aman/video/status', async (req, res) => {
    try {
      const { operationName } = req.body;
      const client = getGeminiClient();
      if (!client) return res.status(503).json({ error: 'AI unavailable' });

      const op = new GenerateVideosOperation();
      op.name = operationName;
      const updated = await client.operations.getVideosOperation({ operation: op });
      
      if (updated.done) {
        const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
        res.json({ done: true, uri });
      } else {
        res.json({ done: false });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Mentor endpoint
  app.post('/api/mentor', async (req, res) => {
    try {
      const { question, history, userProfile, step, language } = req.body;
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Question is required' });
      }

      const client = getGeminiClient();
      const currentLanguage = language || userProfile?.language || 'English';

      if (!client) {
        // Fallback rule-based structured response
        let text = `Regarding "${question}": In ethical cybersecurity, analyze this from first principles: 1) System and protocol architecture, 2) Authentication and authorization boundaries, and 3) Data storage state.`;
        let analogy = '🛡️ SECURITY IN DEPTH: Never rely on a single layer. Defensive engineers implement perimeter firewalls, least-privilege permissions, and active logging simultaneously.';
        
        if (currentLanguage === 'Hinglish') {
          text = `"${question}" ko simple Hinglish mein samjho: Cybersecurity mein sabse pehle system ka architecture, permissions, aur network protocols check karte hain.`;
          analogy = '🚪 TAALEY AUR CHABHI KI ANALOGY: Jaise ghar ke main gate par guard hota hai aur almirah par alag lock hota hai, waise hi network mein firewall aur permissions multiple security layers banate hain.';
        } else if (currentLanguage === 'Hindi') {
          text = `"${question}" के संबंध में: साइबर सुरक्षा में हम सुरक्षा-इन-डेप्थ के सिद्धांत का पालन करते हैं।`;
          analogy = '🛡️ बहुस्तरीय सुरक्षा: जिस प्रकार एक किले में मुख्य द्वार, खाई और आंतरिक सुरक्षा द्वार होते हैं, उसी प्रकार कंप्यूटर नेटवर्क में कई परतें होती हैं।';
        }

        return res.json({
          offline: true,
          text,
          analogy,
          keyPoints: [
            'Verify assumptions by inspecting real network packets or system logs.',
            'Follow the principle of least privilege in all configuration designs.',
            'Remember: Only test systems you own or have explicit authorization to test.'
          ]
        });
      }

      const stepInstruction = step === 'hint1' 
        ? 'Give ONLY HINT 1 (A gentle nudge in the right direction without revealing the answer).'
        : step === 'hint2'
        ? 'Give HINT 2 (More specific technical guidance pointing to the exact tool, protocol, or concept).'
        : step === 'simpler'
        ? 'Explain the concept MUCH MORE SIMPLY as if the student is 10 years old, with zero technical jargon.'
        : step === 'analogy'
        ? 'Provide an intuitive, memorable real-world analogy to illustrate how this concept works.'
        : step === 'guided_example'
        ? 'Provide a safe, step-by-step guided practical walkthrough.'
        : step === 'dont_understand'
        ? 'The user clicked "I DON\'T UNDERSTAND". Ask what part feels confusing and explain from the very fundamental ground up in the simplest possible terms.'
        : 'Provide a clear, comprehensive ethical cybersecurity educational explanation.';

      const systemInstruction = `You are the AI Cybersecurity Mentor for "My Cyber Lab" — an ethical cybersecurity academy.
Target Language: ${currentLanguage} (If Hinglish: write in natural conversational Hinglish using Roman script like "IP address basically tumhare device ka network address hai". If Hindi: write in Devanagari Hindi. If English: write in clear accessible English).
Teaching directive: ${stepInstruction}
STRICT ETHICAL RULE: Never provide exploit payloads for unverified external targets. Always frame knowledge for defense, lab environments, and authorized testing.
Do not translate technical commands (keep "ls", "pwd", "nmap", "ping", "cat", "chmod" as-is).
The student profile: Name: ${userProfile?.name || 'Operator'}, Level: ${userProfile?.cyberLevel || 1}, Experience: ${userProfile?.experienceLevel || 'Beginner'}.`;

      const response = await generateContentWithFallback(client, {
        contents: question,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: 'The core educational explanation or hint according to the teaching directive'
              },
              analogy: {
                type: Type.STRING,
                description: 'An intuitive real-world analogy making the concept instantly click'
              },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 to 4 actionable, memorable key takeaways'
              }
            },
            required: ['text', 'keyPoints']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (error: any) {
      console.error('AI Mentor error:', error);
      let text = `Regarding "${req.body.question || 'Cybersecurity Concept'}": In ethical cybersecurity, analyze this from first principles: 1) System and protocol architecture, 2) Authentication and authorization boundaries, and 3) Data storage state.`;
      let analogy = '🛡️ SECURITY IN DEPTH: Never rely on a single layer. Defensive engineers implement perimeter firewalls, least-privilege permissions, and active logging simultaneously.';
      
      const currentLanguage = req.body.language || req.body.userProfile?.language || 'English';
      if (currentLanguage === 'Hinglish') {
        text = `"${req.body.question || 'Concept'}" ko simple Hinglish mein samjho: Cybersecurity mein sabse pehle system ka architecture, permissions, aur network protocols check karte hain.`;
        analogy = '🚪 TAALEY AUR CHABHI KI ANALOGY: Jaise ghar ke main gate par guard hota hai aur almirah par alag lock hota hai, waise hi network mein firewall aur permissions multiple security layers banate hain.';
      }

      return res.json({
        offline: true,
        text,
        analogy,
        keyPoints: [
          'Verify assumptions by inspecting real network packets or system logs.',
          'Follow the principle of least privilege in all configuration designs.',
          'Remember: Only test systems you own or have explicit authorization to test.'
        ]
      });
    }
  });

  // AI Cyber Interviewer endpoint
  app.post('/api/interview', async (req, res) => {
    try {
      const { category, currentQuestion, userAnswer, language } = req.body;
      const client = getGeminiClient();
      const currentLanguage = language || 'English';

      if (!client) {
        return res.json({
          offline: true,
          score: 85,
          feedback: `Good technical answer for ${category || 'General Security'}! You demonstrated fundamental understanding. Consider mentioning log correlation and least-privilege principles to stand out in enterprise interviews.`,
          strengths: ['Identified core security concepts', 'Clear terminology', 'Ethical mindset'],
          areasToImprove: ['Add specific command examples or telemetry verification steps', 'Mention remediation/defense impact'],
          modelAnswer: `In an enterprise environment, approach this systematically: 1) Identification & scoping, 2) Containment & telemetry collection, 3) Eradication & least-privilege hardening, and 4) Post-incident documentation.`,
          nextQuestion: `How would you verify whether an anomalous inbound connection to port 443 was legitimate web traffic or an encrypted C2 beacon?`
        });
      }

      const systemInstruction = `You are a Principal Security Hiring Manager & Technical Interviewer at a top cybersecurity firm for "My Cyber Lab".
Target Language: ${currentLanguage}.
Topic Category: ${category || 'Cybersecurity Fundamentals'}.
Current Question: "${currentQuestion}"
Candidate Answer: "${userAnswer}"

Evaluate the candidate's answer with realistic, constructive technical scrutiny.
1. Score from 0 to 100 based on accuracy, clarity, reasoning, and practical command knowledge.
2. Highlight 2-3 specific strengths.
3. Highlight 1-2 constructive gaps or areas to improve.
4. Provide a succinct model answer.
5. Provide a natural follow-up interview question.`;

      const response = await generateContentWithFallback(client, {
        contents: `Evaluate candidate response: "${userAnswer}" to question: "${currentQuestion}".`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER, description: 'Score between 0 and 100' },
              feedback: { type: Type.STRING, description: 'Comprehensive constructive feedback' },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              areasToImprove: { type: Type.ARRAY, items: { type: Type.STRING } },
              modelAnswer: { type: Type.STRING, description: 'An exemplary model answer' },
              nextQuestion: { type: Type.STRING, description: 'A relevant follow-up technical interview question' }
            },
            required: ['score', 'feedback', 'strengths', 'areasToImprove', 'modelAnswer', 'nextQuestion']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty response from AI');
      return res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('AI Interview error:', error);
      return res.json({
        offline: true,
        score: 85,
        feedback: `Good technical answer for ${req.body.category || 'General Security'}! You demonstrated fundamental understanding. Consider mentioning log correlation and least-privilege principles to stand out in enterprise interviews.`,
        strengths: ['Identified core security concepts', 'Clear terminology', 'Ethical mindset'],
        areasToImprove: ['Add specific command examples or telemetry verification steps', 'Mention remediation/defense impact'],
        modelAnswer: `In an enterprise environment, approach this systematically: 1) Identification & scoping, 2) Containment & telemetry collection, 3) Eradication & least-privilege hardening, and 4) Post-incident documentation.`,
        nextQuestion: `How would you verify whether an anomalous inbound connection to port 443 was legitimate web traffic or an encrypted C2 beacon?`
      });
    }
  });

  // AI Investigation Assistant endpoint
  app.post('/api/investigate', async (req, res) => {
    try {
      const { evidenceData, userTheory, language } = req.body;
      const client = getGeminiClient();
      const currentLanguage = language || 'English';

      if (!client) {
        return res.json({
          offline: true,
          analysis: 'Analysis of provided telemetry indicators: Anomalous traffic pattern observed. Correlate timestamp with authentication log events to verify potential unauthorized credential reuse.',
          suspectedVector: 'Brute-force / Misconfigured Service',
          investigativeNextSteps: [
            'Filter logs for HTTP 401/403 status spikes.',
            'Examine netstat/ss output for lingering external socket connections.',
            'Verify checksums of modified binaries against known good baselines.'
          ]
        });
      }

      const systemInstruction = `You are the Lead Digital Forensics & Incident Response (DFIR) Investigator for "My Cyber Lab".
Target Language: ${currentLanguage}.
Guide the student through investigating evidence without instantly giving away the final flag. Provide analytical feedback on anomalies, timestamp patterns, potential indicators of compromise (IOCs), and recommended next investigation steps.`;

      const response = await generateContentWithFallback(client, {
        contents: `Evidence telemetry: ${JSON.stringify(evidenceData)}. Student Theory: "${userTheory || 'Analyzing logs'}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: { type: Type.STRING },
              suspectedVector: { type: Type.STRING },
              investigativeNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['analysis', 'suspectedVector', 'investigativeNextSteps']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty response from AI');
      return res.json(JSON.parse(responseText));
    } catch (error: any) {
      console.error('AI Investigation error:', error);
      return res.json({
        offline: true,
        analysis: 'Analysis of provided telemetry indicators: Anomalous traffic pattern observed. Correlate timestamp with authentication log events to verify potential unauthorized credential reuse.',
        suspectedVector: 'Brute-force / Misconfigured Service',
        investigativeNextSteps: [
          'Filter logs for HTTP 401/403 status spikes.',
          'Examine netstat/ss output for lingering external socket connections.',
          'Verify checksums of modified binaries against known good baselines.'
        ]
      });
    }
  });

  // AI Mission Generator endpoint
  app.post('/api/generate-mission', async (req, res) => {
    try {
      const { careerTrack, unlockedTools, userLevel, difficulty } = req.body;
      const client = getGeminiClient();

      if (!client) {
        return res.json({
          offline: true,
          mission: {
            id: `dyn-mission-${Date.now()}`,
            title: `Operation Shadow Trace: ${careerTrack || 'Network Discovery'}`,
            difficulty: difficulty || 'Intermediate',
            category: 'Investigation',
            estimatedTime: '20 min',
            xp: 250,
            objective: 'Identify an unauthorized service listening on a simulated isolated subnet and extract the diagnostic token.',
            scenario: 'During routine network hygiene checks, telemetry flagged abnormal ARP broadcast traffic originating from 10.10.14.50. Investigate the simulated node.',
            tasks: [
              'Execute nmap -sV on the simulated target host.',
              'Inspect HTTP headers on the exposed diagnostic port.',
              'Locate the diagnostic flag in /var/log/audit.log.'
            ],
            hints: [
              'Check port 8080 and 9001 on the training node.',
              'Look for curl response headers containing "X-Lab-Token".'
            ],
            flag: 'FLAG{SHADOW_TRACE_RESOLVED_992}'
          }
        });
      }

      const systemInstruction = `You are the Dynamic Cyber Range Director for "My Cyber Lab".
Generate a realistic, completely isolated, safe fictional training mission tailored to:
- Career Track: ${careerTrack || 'Ethical Hacker'}
- Unlocked Tools: ${JSON.stringify(unlockedTools || ['Linux', 'Networking', 'Nmap'])}
- Level: ${userLevel || 2}
- Difficulty: ${difficulty || 'Beginner'}

STRICT REQUIREMENT: All IP addresses, hostnames, and flags MUST BE FICTIONAL (e.g. 10.10.X.X, training.local, FLAG{...}). Never reference real victims.`;

      const response = await generateContentWithFallback(client, {
        contents: `Generate a hands-on cybersecurity mission.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              category: { type: Type.STRING },
              estimatedTime: { type: Type.STRING },
              xp: { type: Type.NUMBER },
              objective: { type: Type.STRING },
              scenario: { type: Type.STRING },
              tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
              hints: { type: Type.ARRAY, items: { type: Type.STRING } },
              flag: { type: Type.STRING }
            },
            required: ['title', 'difficulty', 'category', 'estimatedTime', 'xp', 'objective', 'scenario', 'tasks', 'hints', 'flag']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) throw new Error('Empty response from AI');
      return res.json({ mission: JSON.parse(responseText) });
    } catch (error: any) {
      console.error('AI Mission Generator error:', error);
      return res.json({
        offline: true,
        mission: {
          id: `dyn-mission-${Date.now()}`,
          title: `Operation Shadow Trace: ${req.body.careerTrack || 'Network Discovery'}`,
          difficulty: req.body.difficulty || 'Intermediate',
          category: 'Investigation',
          estimatedTime: '20 min',
          xp: 250,
          objective: 'Identify an unauthorized service listening on a simulated isolated subnet and extract the diagnostic token.',
          scenario: 'During routine network hygiene checks, telemetry flagged abnormal ARP broadcast traffic originating from 10.10.14.50. Investigate the simulated node.',
          tasks: [
            'Execute nmap -sV on the simulated target host.',
            'Inspect HTTP headers on the exposed diagnostic port.',
            'Locate the diagnostic flag in /var/log/audit.log.'
          ],
          hints: [
            'Check port 8080 and 9001 on the training node.',
            'Look for curl response headers containing "X-Lab-Token".'
          ],
          flag: 'FLAG{SHADOW_TRACE_RESOLVED_992}'
        }
      });
    }
  });

  // AI Study Plan endpoint
  app.post('/api/study-plan', async (req, res) => {
    try {
      const { dailyTime, experienceLevel, currentLevel, goal } = req.body;
      const client = getGeminiClient();

      if (!client) {
        return res.json({
          offline: true,
          plan: {
            title: `Operational Study Plan: ${goal || 'Cybersecurity Mastery'}`,
            estimatedHours: dailyTime === '15 min' ? 1.5 : dailyTime === '30 min' ? 3 : 6,
            days: [
              {
                day: 1,
                theme: 'Linux Navigation & Shell Mastery',
                tasks: [
                  'Complete Level 3 (Linux Navigation)',
                  'Practice whoami, pwd, ls -la, and cat commands in Linux Lab',
                  'Document directory structure in Field Notebook'
                ]
              },
              {
                day: 2,
                theme: 'TCP/IP & Packet Flows',
                tasks: [
                  'Complete Level 5 (TCP/IP & OSI Models)',
                  'Run ICMP ping simulation in Network Lab',
                  'Take the Level 5 Concept Checkpoint Quiz'
                ]
              },
              {
                day: 3,
                theme: 'Port Discovery & Network Scanning',
                tasks: [
                  'Study Level 7 (Port Scanning & nmap Basics)',
                  'Perform discovery mission in Safe Cyber Range',
                  'Identify open ports on simulated target Nightfall'
                ]
              },
              {
                day: 4,
                theme: 'Web Security & HTTP Anatomy',
                tasks: [
                  'Complete Level 9 (HTTP Request Anatomy)',
                  'Solve beginner CTF challenge "Inspect the Source"',
                  'Submit CTF flag in CTF Arena'
                ]
              },
              {
                day: 5,
                theme: 'Vulnerability Assessment & Triage',
                tasks: [
                  'Review Security Principles & CVE Basics',
                  'Practice triage mission in Missions Console',
                  'Export study milestones and backup progress'
                ]
              }
            ]
          }
        });
      }

      const systemInstruction = `You are the Lead Cybersecurity Curriculum Architect for "My Cyber Lab".
Generate a structured 5-day personalized cybersecurity training syllabus tailored to the student's available daily time (${dailyTime || '30 min'}), experience level (${experienceLevel || 'Beginner'}), and primary goal (${goal || 'Become a proficient junior ethical security analyst'}).
Include realistic actionable tasks per day that map to hands-on lab practice, theory, and quiz validation.`;

      const response = await generateContentWithFallback(client, {
        contents: `Create a 5-day training schedule for a student with ${dailyTime} daily commitment and goal: "${goal}".`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              estimatedHours: { type: Type.NUMBER },
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    theme: { type: Type.STRING },
                    tasks: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ['day', 'theme', 'tasks']
                }
              }
            },
            required: ['title', 'estimatedHours', 'days']
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      const parsed = JSON.parse(responseText);
      return res.json({ plan: parsed });
    } catch (error: any) {
      console.error('AI Study Plan error:', error);
      return res.json({
        offline: true,
        plan: {
          title: `Operational Study Plan: ${req.body.goal || 'Cybersecurity Mastery'}`,
          estimatedHours: req.body.dailyTime === '15 min' ? 1.5 : req.body.dailyTime === '30 min' ? 3 : 6,
          days: [
            {
              day: 1,
              theme: 'Linux Navigation & Shell Mastery',
              tasks: [
                'Complete Level 3 (Linux Navigation)',
                'Practice whoami, pwd, ls -la, and cat commands in Linux Lab',
                'Document directory structure in Field Notebook'
              ]
            },
            {
              day: 2,
              theme: 'TCP/IP & Packet Flows',
              tasks: [
                'Complete Level 5 (TCP/IP & OSI Models)',
                'Run ICMP ping simulation in Network Lab',
                'Take the Level 5 Concept Checkpoint Quiz'
              ]
            },
            {
              day: 3,
              theme: 'Port Discovery & Network Scanning',
              tasks: [
                'Study Level 7 (Port Scanning & nmap Basics)',
                'Perform discovery mission in Safe Cyber Range',
                'Identify open ports on simulated target Nightfall'
              ]
            },
            {
              day: 4,
              theme: 'Web Security & HTTP Anatomy',
              tasks: [
                'Complete Level 9 (HTTP Request Anatomy)',
                'Solve beginner CTF challenge "Inspect the Source"',
                'Submit CTF flag in CTF Arena'
              ]
            },
            {
              day: 5,
              theme: 'Vulnerability Assessment & Triage',
              tasks: [
                'Review Security Principles & CVE Basics',
                'Practice triage mission in Missions Console',
                'Export study milestones and backup progress'
              ]
            }
          ]
        }
      });
    }
  });

  // CERTIFICATE REGISTRY & VERIFICATION API
  const certificateStore = new Map<string, any>();

  // Pre-seed sample verifiable credentials
  const seedCertificates = [
    {
      certificateId: 'MCL-2026-CYB-8F42A1',
      learnerName: 'Alex Vance',
      codename: 'CIPHER-01',
      courseName: 'Practical Ethical Hacking & Defensive Cybersecurity',
      certificateTitle: 'Certificate of Completion',
      completionDate: 'August 22, 2026',
      issueDate: 'August 22, 2026',
      trainingHours: 42,
      finalScore: 96,
      lessonsCompletedCount: 32,
      labsCompletedCount: 16,
      missionsCompletedCount: 8,
      toolsMasteredCount: 14,
      skillsCovered: [
        'Linux Terminal & File System Security',
        'TCP/IP & OSI Layer Network Diagnostics',
        'Port Scanning & Reconnaissance (Nmap)',
        'Web Application Vulnerabilities (OWASP Top 10)',
        'SOC Telemetry & Log Investigation',
        'Capture The Flag (CTF) Methodologies',
        'Ethical Rules of Engagement & Defensive Hardening'
      ],
      verificationCode: 'SHA256:8f42a1b9c3e47a28e5d01249b6f1789c0a',
      verificationUrl: '/verify-certificate?id=MCL-2026-CYB-8F42A1',
      status: 'ISSUED',
      issuer: {
        academyName: 'My Cyber Lab Academy',
        director: 'Dr. Evelyn Cross, CISSP',
        title: 'Academic Director & Lead Cyber Examiner',
        sealNumber: 'SEAL-2026-AUTH-904'
      }
    },
    {
      certificateId: 'MCL-CERT-2026-X7942',
      learnerName: 'Marcus Wright',
      codename: 'GHOST-99',
      courseName: 'SOC Analyst & Threat Detection Fundamentals',
      certificateTitle: 'Certificate of Completion',
      completionDate: 'August 15, 2026',
      issueDate: 'August 15, 2026',
      trainingHours: 36,
      finalScore: 92,
      lessonsCompletedCount: 24,
      labsCompletedCount: 12,
      missionsCompletedCount: 6,
      toolsMasteredCount: 10,
      skillsCovered: [
        'Security Information & Event Management (SIEM)',
        'Network Packet Analysis with Wireshark',
        'MITRE ATT&CK Framework Mapping',
        'Incident Response & Triage Workflows'
      ],
      verificationCode: 'SHA256:7942d94a12ec843f019b782c5a6d38e21f',
      verificationUrl: '/verify-certificate?id=MCL-CERT-2026-X7942',
      status: 'VERIFIED',
      issuer: {
        academyName: 'My Cyber Lab Academy',
        director: 'Dr. Evelyn Cross, CISSP',
        title: 'Academic Director & Lead Cyber Examiner',
        sealNumber: 'SEAL-2026-AUTH-882'
      }
    }
  ];

  for (const cert of seedCertificates) {
    certificateStore.set(cert.certificateId.toUpperCase(), cert);
  }

  // Verify certificate by ID
  app.get('/api/certificates/verify/:id', (req, res) => {
    const certId = (req.params.id || '').trim().toUpperCase();
    if (!certId) {
      return res.status(400).json({ error: 'Certificate ID is required', verified: false });
    }

    const cert = certificateStore.get(certId);
    if (!cert) {
      return res.status(404).json({
        verified: false,
        error: 'Certificate Not Found',
        message: 'No record matching this unique Certificate ID was found in the official registry.'
      });
    }

    return res.json({
      verified: true,
      certificate: cert
    });
  });

  // Register / Issue new certificate
  app.post('/api/certificates/issue', (req, res) => {
    try {
      const { certificate } = req.body;
      if (!certificate || !certificate.certificateId) {
        return res.status(400).json({ error: 'Invalid certificate payload' });
      }

      const id = certificate.certificateId.toUpperCase();
      certificateStore.set(id, {
        ...certificate,
        status: certificate.status || 'ISSUED',
        registeredAt: new Date().toISOString()
      });

      return res.json({
        success: true,
        certificateId: id,
        certificate: certificateStore.get(id)
      });
    } catch (err: any) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = http.createServer(app);

  // Vite middleware in dev / Static files in standalone production (not on Vercel)
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const isHmrEnabled = process.env.ENABLE_HMR === 'true';
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: isHmrEnabled ? { server: httpServer } : false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else if (!process.env.VERCEL) {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`My Cyber Lab server listening on http://0.0.0.0:${PORT}`);
    });
  }
}
startServer();
export default app;
