export interface CommandAnatomyPart {
  token: string;
  type: 'COMMAND' | 'OPTION' | 'ARGUMENT' | 'TARGET';
  explanation: string;
}

export type CommandErrorType =
  | 'COMMAND_FIRST_ERROR'
  | 'MISSING_REQUIRED_ARGUMENT'
  | 'INVALID_TARGET_FORMAT'
  | 'UNSUPPORTED_OPTION'
  | 'UNKNOWN_COMMAND'
  | 'TYPO_DETECTED'
  | 'MALFORMED_SYNTAX';

export interface CommandSyntaxAnalysis {
  isValid: boolean;
  rawCommand: string;
  parsedCommand?: string;
  parsedOptions?: string[];
  parsedArguments?: string[];
  target?: string;
  errorType?: CommandErrorType;
  errorMessage?: string;
  problemExplanation?: string;
  correctStructure?: string;
  exampleCommand?: string;
  typoSuggestion?: string;
  similarCommands?: string[];
  relatedConcepts?: string[];
  anatomy?: CommandAnatomyPart[];
  beginnerExplanation?: string;
  intermediateExplanation?: string;
  advancedExplanation?: string;
}

export interface CommandKnowledgeItem {
  command: string;
  category: 'LINUX' | 'NETWORKING' | 'RECONNAISSANCE' | 'ENUMERATION' | 'WEB' | 'FILES' | 'PROCESS MANAGEMENT' | 'LOG ANALYSIS' | 'TEXT PROCESSING' | 'EVIDENCE';
  description: string;
  syntax: string;
  requiresTarget: boolean;
  supportedOptions: string[];
  commonErrors: string[];
  relatedConcepts: string[];
}

export const SUPPORTED_COMMAND_DATABASE: Record<string, CommandKnowledgeItem> = {
  nmap: {
    command: 'nmap',
    category: 'RECONNAISSANCE',
    description: 'Network discovery and service enumeration tool used within authorized environments.',
    syntax: 'nmap [options] <target>',
    requiresTarget: true,
    supportedOptions: ['-sV', '-sC', '-sS', '-sU', '-p', '-A', '-O', '-v', '-n', '-Pn', '-T4', '-p-', '--top-ports', '-oN'],
    commonErrors: [
      'Placing IP address before command (e.g. 10.50.0.15 nmap)',
      'Missing target IP address',
      'Using unsupported or dangerous raw socket options without privileges'
    ],
    relatedConcepts: ['Networking', 'Ports & Services', 'Reconnaissance', 'Enumeration', 'Service Versioning']
  },
  ping: {
    command: 'ping',
    category: 'NETWORKING',
    description: 'Sends ICMP ECHO_REQUEST packets to network hosts to verify connectivity.',
    syntax: 'ping [options] <target>',
    requiresTarget: true,
    supportedOptions: ['-c', '-i', '-W', '-s', '-4', '-6'],
    commonErrors: [
      'Target IP before command name',
      'Missing count option -c leading to infinite probes in non-interactive mode'
    ],
    relatedConcepts: ['Networking', 'ICMP Protocol', 'Host Discovery', 'Network Latency']
  },
  curl: {
    command: 'curl',
    category: 'WEB',
    description: 'Transfers data to or from a network server using supported web protocols.',
    syntax: 'curl [options] <url/target>',
    requiresTarget: true,
    supportedOptions: ['-I', '-i', '-v', '-X', '-d', '-H', '-u', '-k', '-s', '-L', '--data'],
    commonErrors: [
      'URL before curl command',
      'Missing protocol prefix (http:// or https://)'
    ],
    relatedConcepts: ['Web Security', 'HTTP Headers', 'REST APIs', 'Web Enumeration']
  },
  cat: {
    command: 'cat',
    category: 'FILES',
    description: 'Concatenates and displays content of files in standard output.',
    syntax: 'cat [options] <filepath>',
    requiresTarget: true,
    supportedOptions: ['-n', '-b', '-A', '-v'],
    commonErrors: [
      'File path placed before cat command',
      'Missing file path argument'
    ],
    relatedConcepts: ['Linux File System', 'File Inspection', 'Log Analysis']
  },
  ls: {
    command: 'ls',
    category: 'LINUX',
    description: 'Lists file and directory information in current or target path.',
    syntax: 'ls [options] [path]',
    requiresTarget: false,
    supportedOptions: ['-l', '-a', '-la', '-al', '-lh', '-R', '-t', '-1'],
    commonErrors: ['Using invalid option flags'],
    relatedConcepts: ['Linux Navigation', 'File Permissions', 'Directory Structure']
  },
  cd: {
    command: 'cd',
    category: 'LINUX',
    description: 'Changes the current working directory.',
    syntax: 'cd [directory]',
    requiresTarget: false,
    supportedOptions: [],
    commonErrors: ['Specifying non-existent target directory'],
    relatedConcepts: ['Directory Navigation', 'Path Mechanics']
  },
  pwd: {
    command: 'pwd',
    category: 'LINUX',
    description: 'Prints current working directory path.',
    syntax: 'pwd',
    requiresTarget: false,
    supportedOptions: [],
    commonErrors: ['Passing unnecessary arguments'],
    relatedConcepts: ['Current Workspace', 'Absolute Paths']
  },
  whoami: {
    command: 'whoami',
    category: 'LINUX',
    description: 'Displays current effective user name.',
    syntax: 'whoami',
    requiresTarget: false,
    supportedOptions: [],
    commonErrors: [],
    relatedConcepts: ['Identity', 'User Accounts', 'Privileges']
  },
  id: {
    command: 'id',
    category: 'LINUX',
    description: 'Prints user and group IDs.',
    syntax: 'id [user]',
    requiresTarget: false,
    supportedOptions: ['-u', '-g', '-G', '-n'],
    commonErrors: [],
    relatedConcepts: ['Linux Groups', 'UID/GID', 'Privilege Boundaries']
  },
  uname: {
    command: 'uname',
    category: 'LINUX',
    description: 'Prints system and kernel information.',
    syntax: 'uname [options]',
    requiresTarget: false,
    supportedOptions: ['-a', '-r', '-m', '-s', '-v'],
    commonErrors: [],
    relatedConcepts: ['Kernel Version', 'Architecture', 'System Fingerprinting']
  },
  ip: {
    command: 'ip',
    category: 'NETWORKING',
    description: 'Inspects and manages routing, network devices, interfaces, and tunnels.',
    syntax: 'ip [options] <object> <command>',
    requiresTarget: false,
    supportedOptions: ['a', 'addr', 'route', 'link', 'neigh', '-4', '-c'],
    commonErrors: ['Missing subcommand like addr or route'],
    relatedConcepts: ['Networking', 'IP Interfaces', 'Routing Tables', 'Subnetting']
  },
  ss: {
    command: 'ss',
    category: 'NETWORKING',
    description: 'Utility to dump socket statistics and active listening ports.',
    syntax: 'ss [options]',
    requiresTarget: false,
    supportedOptions: ['-t', '-u', '-l', '-p', '-n', '-tuln', '-tulpn', '-s', '-tan', 'state'],
    commonErrors: ['Malformed socket flags'],
    relatedConcepts: ['Networking', 'Active Sockets', 'Listening Ports', 'Network Connections']
  },
  ps: {
    command: 'ps',
    category: 'PROCESS MANAGEMENT',
    description: 'Snapshots current running processes.',
    syntax: 'ps [options]',
    requiresTarget: false,
    supportedOptions: ['aux', '-ef', 'ef', '-aux', '-u', '--sort'],
    commonErrors: [],
    relatedConcepts: ['Process Management', 'PID Tracking', 'System Monitoring']
  },
  grep: {
    command: 'grep',
    category: 'TEXT PROCESSING',
    description: 'Searches plain text for lines matching a pattern.',
    syntax: 'grep [options] <pattern> [filepath]',
    requiresTarget: true,
    supportedOptions: ['-i', '-v', '-n', '-r', '-c', '-E', '-C'],
    commonErrors: ['Missing pattern argument', 'File path placed before pattern'],
    relatedConcepts: ['Text Searching', 'Log Parsing', 'Regex Patterns']
  },
  find: {
    command: 'find',
    category: 'FILES',
    description: 'Searches directory trees for files matching criteria.',
    syntax: 'find <path> [expression]',
    requiresTarget: false,
    supportedOptions: ['-name', '-type', '-perm', '-user', '-size', '-exec', '-ls'],
    commonErrors: ['Missing path parameter'],
    relatedConcepts: ['Directory Traversal', 'Permission Auditing', 'SUID Search']
  },
  dig: {
    command: 'dig',
    category: 'NETWORKING',
    description: 'DNS lookup utility for querying nameservers.',
    syntax: 'dig [@server] <domain> [type]',
    requiresTarget: true,
    supportedOptions: ['+short', '+trace', 'ANY', 'A', 'MX', 'TXT', 'NS', 'SOA', 'CNAME'],
    commonErrors: ['Target domain missing', 'Domain placed before dig'],
    relatedConcepts: ['DNS Resolution', 'Domain Enumeration', 'Nameserver Audit']
  },
  nslookup: {
    command: 'nslookup',
    category: 'NETWORKING',
    description: 'Queries internet name servers interactively or non-interactively.',
    syntax: 'nslookup <domain/ip> [server]',
    requiresTarget: true,
    supportedOptions: [],
    commonErrors: ['Target missing'],
    relatedConcepts: ['DNS Lookup', 'Host Name Resolution']
  }
};

/**
 * Calculates Levenshtein edit distance between two strings.
 */
function getLevenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Validates syntax order, options, and target arguments for commands typed in the Cyber Terminal.
 */
export function analyzeCommandSyntax(rawInput: string): CommandSyntaxAnalysis {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return {
      isValid: false,
      rawCommand: '',
      errorType: 'MALFORMED_SYNTAX',
      errorMessage: 'Empty input.'
    };
  }

  const tokens = trimmed.split(/\s+/);
  const firstToken = tokens[0];

  // 1. Detect COMMAND_FIRST_ERROR (e.g. "10.50.0.15 nmap" or "/var/log/auth.log cat")
  const knownTools = Object.keys(SUPPORTED_COMMAND_DATABASE);
  const foundToolIndex = tokens.findIndex((t, idx) => idx > 0 && knownTools.includes(t.toLowerCase()));

  if (foundToolIndex > 0) {
    const toolToken = tokens[foundToolIndex].toLowerCase();
    const leadingToken = tokens[0];
    const knowledge = SUPPORTED_COMMAND_DATABASE[toolToken];

    return {
      isValid: false,
      rawCommand: trimmed,
      parsedCommand: toolToken,
      errorType: 'COMMAND_FIRST_ERROR',
      errorMessage: `Command error: '${toolToken}' must come before target arguments.`,
      problemExplanation: `You placed the target/argument '${leadingToken}' before the tool '${toolToken}'. The terminal expects the executable tool first.`,
      correctStructure: knowledge ? knowledge.syntax : `${toolToken} <target>`,
      exampleCommand: `${toolToken} ${leadingToken}`,
      relatedConcepts: knowledge?.relatedConcepts || ['POSIX Grammar', 'Command Structure'],
      beginnerExplanation: `'${toolToken}' is the program you are asking the terminal to run. The target argument '${leadingToken}' comes AFTER the program name.`,
      intermediateExplanation: `Command parsing failed because token '${leadingToken}' is an argument, not a valid executable. The parser expects the executable token first.`,
      advancedExplanation: `Token sequence violation: POSIX command grammar requires executable token [argv[0]] first. Token '${leadingToken}' does not resolve to an executable.`
    };
  }

  // 2. Check if first token is a known command or standard shell command
  const cmdLower = firstToken.toLowerCase();
  const knowledge = SUPPORTED_COMMAND_DATABASE[cmdLower];

  if (!knowledge) {
    // Check if it's a standard shell builtin or system command
    const standardShellCmds = ['echo', 'touch', 'mkdir', 'rm', 'cp', 'mv', 'chmod', 'chown', 'tail', 'head', 'history', 'clear', 'help', 'exit', 'reset'];
    if (!standardShellCmds.includes(cmdLower)) {
      
      // Perform Typo Detection via Levenshtein distance
      let closestTool: string | null = null;
      let minDistance = 99;

      for (const tool of knownTools) {
        const dist = getLevenshteinDistance(cmdLower, tool);
        if (dist < minDistance && dist <= 3) {
          minDistance = dist;
          closestTool = tool;
        }
      }

      if (closestTool) {
        const suggestedFix = [closestTool, ...tokens.slice(1)].join(' ');
        const suggestedKnowledge = SUPPORTED_COMMAND_DATABASE[closestTool];

        return {
          isValid: false,
          rawCommand: trimmed,
          parsedCommand: cmdLower,
          errorType: 'TYPO_DETECTED',
          errorMessage: `Unknown command '${firstToken}'. Did you mean '${closestTool}'?`,
          problemExplanation: `'${firstToken}' is not recognized. It looks like a typo for '${closestTool}'.`,
          correctStructure: suggestedKnowledge ? suggestedKnowledge.syntax : `${closestTool} [options] <target>`,
          exampleCommand: suggestedFix,
          typoSuggestion: closestTool,
          similarCommands: [closestTool, ...knownTools.filter(t => t !== closestTool).slice(0, 2)],
          relatedConcepts: suggestedKnowledge?.relatedConcepts || ['Command Syntax'],
          beginnerExplanation: `Did you mean '${closestTool}'? Command names in Linux must be typed precisely.`,
          intermediateExplanation: `Tokenizer failed to resolve binary '${firstToken}'. Distance check matched '${closestTool}' (distance: ${minDistance}).`,
          advancedExplanation: `Symbol lookup error: '${firstToken}' undefined. Nearest dictionary candidate: '${closestTool}'.`
        };
      }

      return {
        isValid: false,
        rawCommand: trimmed,
        parsedCommand: cmdLower,
        errorType: 'UNKNOWN_COMMAND',
        errorMessage: `Unknown command: '${firstToken}'.`,
        problemExplanation: `'${firstToken}' is not recognized as a supported training command or executable tool in this lab.`,
        correctStructure: 'Type "help" to view supported training commands.',
        exampleCommand: 'ls -la',
        similarCommands: knownTools.slice(0, 3),
        relatedConcepts: ['Terminal Commands', 'Linux Shell'],
        beginnerExplanation: `The terminal doesn't recognize '${firstToken}'. In Linux, programs have specific names like 'ls', 'cat', 'ip', or 'nmap'.`,
        intermediateExplanation: `Executable '${firstToken}' was not found in PATH or the authorized command allowlist.`,
        advancedExplanation: `Command invocation failed: Binary '${firstToken}' does not exist in safe environment execution table.`
      };
    }

    // Standard shell command syntax passes basic check
    return {
      isValid: true,
      rawCommand: trimmed,
      parsedCommand: cmdLower,
      relatedConcepts: ['Linux Builtins', 'Standard Shell'],
      anatomy: [
        { token: cmdLower, type: 'COMMAND', explanation: 'Shell executable' },
        ...tokens.slice(1).map(t => ({ token: t, type: 'ARGUMENT' as const, explanation: 'Command argument' }))
      ]
    };
  }

  // 3. Process known command args & options
  const options: string[] = [];
  const args: string[] = [];
  let target: string | undefined = undefined;

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.startsWith('-')) {
      options.push(token);
    } else {
      args.push(token);
    }
  }

  if (args.length > 0) {
    target = args[args.length - 1];
  }

  // A. Check for duplicate options or arguments
  const seenOptions = new Set<string>();
  for (const opt of options) {
    if (seenOptions.has(opt)) {
      return {
        isValid: false,
        rawCommand: trimmed,
        parsedCommand: cmdLower,
        errorType: 'MALFORMED_SYNTAX',
        errorMessage: `Duplicate option error: Option '${opt}' is specified multiple times.`,
        problemExplanation: `The option flag '${opt}' was specified more than once in your command. Redundant options are grammatically incorrect.`,
        correctStructure: knowledge.syntax,
        exampleCommand: `${cmdLower} ${opt} ${target || '10.50.0.15'}`,
        beginnerExplanation: `WHAT IS WRONG: You typed '${opt}' twice.\nWHY IT IS WRONG: Commands do not require repeating the same option flags.\nEXPECTED SYNTAX: ${knowledge.syntax}\nCORRECT EXAMPLE: ${cmdLower} ${opt} ${target || '10.50.0.15'}`,
        intermediateExplanation: `Syntax analysis failed: Duplicate command flag '${opt}' detected in argv list.`,
        advancedExplanation: `Grammar validation error: Duplicate command option token '${opt}' violates canonical POSIX invocation pattern.`
      };
    }
    seenOptions.add(opt);
  }

  const seenArgs = new Set<string>();
  for (const arg of args) {
    if (seenArgs.has(arg) && arg !== '..' && arg !== '/' && arg !== '.') {
      return {
        isValid: false,
        rawCommand: trimmed,
        parsedCommand: cmdLower,
        errorType: 'MALFORMED_SYNTAX',
        errorMessage: `Duplicate argument error: Argument '${arg}' is specified multiple times.`,
        problemExplanation: `The positional argument '${arg}' was specified multiple times. A target should only be provided once.`,
        correctStructure: knowledge.syntax,
        exampleCommand: `${cmdLower} ${options.join(' ')} ${arg}`,
        beginnerExplanation: `WHAT IS WRONG: You repeated the argument '${arg}'.\nWHY IT IS WRONG: This command only expects you to supply a single target value.\nEXPECTED SYNTAX: ${knowledge.syntax}\nCORRECT EXAMPLE: ${cmdLower} ${arg}`,
        intermediateExplanation: `Syntax analysis failed: Duplicate positional argument '${arg}' detected.`,
        advancedExplanation: `Token constraint violation: Redundant positional argument '${arg}' in argument vector.`
      };
    }
    seenArgs.add(arg);
  }

  // B. Check for unsupported options
  for (const opt of options) {
    let isOptionSupported = false;
    for (const supported of knowledge.supportedOptions) {
      if (opt === supported || opt.startsWith(supported)) {
        isOptionSupported = true;
        break;
      }
    }
    if (!isOptionSupported && knowledge.supportedOptions.length > 0) {
      return {
        isValid: false,
        rawCommand: trimmed,
        parsedCommand: cmdLower,
        errorType: 'UNSUPPORTED_OPTION',
        errorMessage: `Option error: '${opt}' is not a supported option for '${cmdLower}'.`,
        problemExplanation: `The option flag '${opt}' is unrecognized or not supported by '${cmdLower}' in this cyber lab environment.`,
        correctStructure: knowledge.syntax,
        exampleCommand: `${cmdLower} ${knowledge.supportedOptions[0] || ''} ${target || '10.50.0.15'}`,
        beginnerExplanation: `WHAT IS WRONG: The option flag '${opt}' is invalid for '${cmdLower}'.\nWHY IT IS WRONG: '${cmdLower}' only supports specific options like: ${knowledge.supportedOptions.join(', ')}.\nEXPECTED SYNTAX: ${knowledge.syntax}\nCORRECT EXAMPLE: ${cmdLower} ${knowledge.supportedOptions[0] || ''} ${target || '10.50.0.15'}`,
        intermediateExplanation: `Unsupported command option flag '${opt}' parsed for executable '${cmdLower}'. Allowed option set is {${knowledge.supportedOptions.join(', ')}}.`,
        advancedExplanation: `Argument parse error: Unrecognized option '${opt}' in argv. Signature constraint violated. Allowed flags: [${knowledge.supportedOptions.join(', ')}].`
      };
    }
  }

  // C. Check for extra arguments
  if ((cmdLower === 'whoami' || cmdLower === 'pwd') && args.length > 0) {
    const extraToken = args[0];
    return {
      isValid: false,
      rawCommand: trimmed,
      parsedCommand: cmdLower,
      errorType: 'MALFORMED_SYNTAX',
      errorMessage: `Extra argument error: Unknown trailing argument '${extraToken}' for '${cmdLower}'.`,
      problemExplanation: `The command '${cmdLower}' expects zero arguments, but you provided '${extraToken}'.`,
      correctStructure: knowledge.syntax,
      exampleCommand: cmdLower,
      beginnerExplanation: `WHAT IS WRONG: You added '${extraToken}' after '${cmdLower}'.\nWHY IT IS WRONG: '${cmdLower}' is a standalone command and does not take any arguments.\nEXPECTED SYNTAX: ${knowledge.syntax}\nCORRECT EXAMPLE: ${cmdLower}`,
      intermediateExplanation: `Grammar constraint violation: Positional argument count exceeded for standalone binary '${cmdLower}'.`,
      advancedExplanation: `Syntax analysis failed: Command signature expects zero arguments. Extraneous tokens: [${args.map(x => `'${x}'`).join(', ')}].`
    };
  }

  if (knowledge.requiresTarget && args.length > 1) {
    const extraTokens = args.slice(1).join(' ');
    const firstArg = args[0];
    return {
      isValid: false,
      rawCommand: trimmed,
      parsedCommand: cmdLower,
      errorType: 'MALFORMED_SYNTAX',
      errorMessage: `Extra argument error: Unrecognized argument(s) '${extraTokens}' for '${cmdLower}'.`,
      problemExplanation: `The command '${cmdLower}' expects exactly one target argument, but you provided multiple: '${firstArg}' and '${extraTokens}'.`,
      correctStructure: knowledge.syntax,
      exampleCommand: `${cmdLower} ${options.join(' ')} ${firstArg}`,
      beginnerExplanation: `WHAT IS WRONG: You passed extra arguments '${extraTokens}' to the command.\nWHY IT IS WRONG: '${cmdLower}' only accepts one target or file path. Additional arguments are invalid.\nEXPECTED SYNTAX: ${knowledge.syntax}\nCORRECT EXAMPLE: ${cmdLower} ${firstArg}`,
      intermediateExplanation: `Grammar constraint violation: Positional argument count exceeded. Found ${args.length} positional arguments, expected exactly 1.`,
      advancedExplanation: `Syntax analysis failed: Command signature expects single target. Extraneous tokens parsed: [${args.slice(1).map(x => `'${x}'`).join(', ')}].`
    };
  }

  if (cmdLower === 'cd' && args.length > 1) {
    const extraTokens = args.slice(1).join(' ');
    return {
      isValid: false,
      rawCommand: trimmed,
      parsedCommand: cmdLower,
      errorType: 'MALFORMED_SYNTAX',
      errorMessage: `Extra argument error: Too many arguments for 'cd'.`,
      problemExplanation: `The 'cd' command accepts only one directory path, but you provided multiple arguments: '${args.join(' ')}'.`,
      correctStructure: 'cd [directory]',
      exampleCommand: `cd ${args[0]}`,
      beginnerExplanation: `WHAT IS WRONG: You added extra parameters after the directory name.\nWHY IT IS WRONG: You can only change into one directory at a time.\nEXPECTED SYNTAX: cd [directory]\nCORRECT EXAMPLE: cd ${args[0]}`,
      intermediateExplanation: `Directory navigation failed: Expected single path token, parsed: [${args.map(x => `'${x}'`).join(', ')}].`,
      advancedExplanation: `CD syscall helper error: Path vector length > 1 is unsupported.`
    };
  }

  // 4. Check MISSING_REQUIRED_ARGUMENT
  if (knowledge.requiresTarget && args.length === 0) {
    return {
      isValid: false,
      rawCommand: trimmed,
      parsedCommand: cmdLower,
      parsedOptions: options,
      errorType: 'MISSING_REQUIRED_ARGUMENT',
      errorMessage: `Command incomplete: '${cmdLower}' requires a target argument.`,
      problemExplanation: `'${cmdLower}' requires a target (IP address, hostname, URL, or file path) to perform this operation.`,
      correctStructure: knowledge.syntax,
      exampleCommand: `${cmdLower} ${cmdLower === 'nmap' ? '10.50.0.15' : cmdLower === 'curl' ? 'http://10.10.10.5' : '10.10.10.1'}`,
      relatedConcepts: knowledge.relatedConcepts,
      beginnerExplanation: `You entered '${cmdLower}' by itself. Nmap and networking tools need to know WHICH host or file to operate on.`,
      intermediateExplanation: `Missing required positional argument <target> for executable '${cmdLower}'.`,
      advancedExplanation: `Parameter error: Expected mandatory positional argument <target> in command grammar.`
    };
  }

  // 5. Check INVALID_TARGET_FORMAT for network tools
  if (target && ['nmap', 'ping'].includes(cmdLower)) {
    if (target.includes('.') && !target.startsWith('http')) {
      const parts = target.split('/')[0].split('.');
      if (parts.length === 4) {
        const nums = parts.map(n => parseInt(n, 10));
        if (nums.some(n => isNaN(n) || n < 0 || n > 255)) {
          return {
            isValid: false,
            rawCommand: trimmed,
            parsedCommand: cmdLower,
            parsedOptions: options,
            target,
            errorType: 'INVALID_TARGET_FORMAT',
            errorMessage: `Invalid target IP format: '${target}'.`,
            problemExplanation: `'${target}' is not a valid IPv4 address. IPv4 octets must be between 0 and 255.`,
            correctStructure: knowledge.syntax,
            exampleCommand: `${cmdLower} 10.50.0.15`,
            relatedConcepts: knowledge.relatedConcepts,
            beginnerExplanation: `An IP address consists of 4 numbers from 0 to 255 separated by dots (e.g. 10.50.0.15).`,
            intermediateExplanation: `Target string '${target}' failed IPv4 network address validation.`,
            advancedExplanation: `Malformed target argument: Socket address parser rejected octet out-of-range.`
          };
        }
      }
    }
  }

  // Build Anatomy Parts
  const anatomy: CommandAnatomyPart[] = [
    { token: cmdLower, type: 'COMMAND', explanation: `Program executable: ${knowledge.description}` }
  ];

  options.forEach(opt => {
    anatomy.push({ token: opt, type: 'OPTION', explanation: `Option flag: modifies behavior` });
  });

  args.forEach((arg, idx) => {
    const isTgt = idx === args.length - 1 && knowledge.requiresTarget;
    anatomy.push({
      token: arg,
      type: isTgt ? 'TARGET' : 'ARGUMENT',
      explanation: isTgt ? `Target destination/resource` : `Positional argument`
    });
  });

  return {
    isValid: true,
    rawCommand: trimmed,
    parsedCommand: cmdLower,
    parsedOptions: options,
    parsedArguments: args,
    target,
    anatomy,
    relatedConcepts: knowledge.relatedConcepts,
    beginnerExplanation: `${cmdLower} will execute on target ${target || 'local environment'}.`,
    intermediateExplanation: `Valid syntax recognized. Tool: ${cmdLower}, Options: ${options.join(', ') || 'none'}, Target: ${target || 'N/A'}.`,
    advancedExplanation: `Grammar validation passed for executable '${cmdLower}'. Ready for ACE server-side scope verification.`
  };
}

/**
 * Command Bookmarks & Notes Utilities
 */
export interface CommandBookmark {
  id: string;
  command: string;
  title: string;
  note: string;
  timestamp: number;
}

export function saveCommandBookmark(command: string, title: string, note: string): CommandBookmark[] {
  const existingStr = localStorage.getItem('mycyberlab_command_bookmarks');
  let bookmarks: CommandBookmark[] = [];
  try {
    if (existingStr) bookmarks = JSON.parse(existingStr);
  } catch (e) {
    bookmarks = [];
  }
  
  const newBm: CommandBookmark = {
    id: `bm-${Date.now()}`,
    command,
    title,
    note,
    timestamp: Date.now()
  };

  bookmarks = [newBm, ...bookmarks];
  localStorage.setItem('mycyberlab_command_bookmarks', JSON.stringify(bookmarks));
  return bookmarks;
}

export function getSavedCommandBookmarks(): CommandBookmark[] {
  const existingStr = localStorage.getItem('mycyberlab_command_bookmarks');
  try {
    return existingStr ? JSON.parse(existingStr) : [];
  } catch (e) {
    return [];
  }
}

export function deleteCommandBookmark(id: string): CommandBookmark[] {
  let bookmarks = getSavedCommandBookmarks();
  bookmarks = bookmarks.filter(b => b.id !== id);
  localStorage.setItem('mycyberlab_command_bookmarks', JSON.stringify(bookmarks));
  return bookmarks;
}
