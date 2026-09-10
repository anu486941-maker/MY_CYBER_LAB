/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/attackbox/AttackBoxShell.ts
 * Purpose: Virtual Bash Execution Engine with VFS, Penetration Testing Tool Emulators, and Scope Safety Guards
 */

import { MachineRegistry } from '../machines/MachineRegistry';
import { LabScopeEnforcer } from '../safety/LabScopeEnforcer';
import { RulesOfEngagement, CyberMachine } from '../types';

export interface TerminalOutputLine {
  text: string;
  type: 'output' | 'input' | 'error' | 'warning' | 'success' | 'system' | 'banner';
  timestamp?: string;
}

export interface VirtualFileSystem {
  [path: string]: {
    type: 'file' | 'directory';
    content?: string;
    permissions?: string;
    owner?: string;
  };
}

export class AttackBoxShell {
  private cwd: string = '/root';
  private env: Record<string, string> = {
    USER: 'root',
    HOSTNAME: 'attackbox',
    IP: '10.10.14.5',
    HOME: '/root',
    PWD: '/root',
    PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
    SHELL: '/bin/bash',
    TERM: 'xterm-256color'
  };

  private history: string[] = [];
  private historyIndex: number = -1;

  private vfs: VirtualFileSystem = {
    '/root': { type: 'directory', permissions: 'drwx------', owner: 'root:root' },
    '/root/notes.txt': {
      type: 'file',
      content: 'Target Engagement Checklist:\n1. Nmap scan authorized subnet\n2. Directory fuzzing with gobuster\n3. Evidence capture & reporting',
      permissions: '-rw-------',
      owner: 'root:root'
    },
    '/home/kali': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'kali:kali' },
    '/home/kali/loot': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'kali:kali' },
    '/tmp': { type: 'directory', permissions: 'drwxrwxrwt', owner: 'root:root' },
    '/opt': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'root:root' },
    '/usr/bin': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'root:root' },
    '/usr/share/wordlists': { type: 'directory', permissions: 'drwxr-xr-x', owner: 'root:root' },
    '/usr/share/wordlists/rockyou.txt': {
      type: 'file',
      content: '123456\npassword\n12345678\nadmin123\nAdmin123!\ndevpass_2026!\nSummer2024!\nOperator@2026\nqwerty\nletmein',
      permissions: '-rw-r--r--',
      owner: 'root:root'
    },
    '/usr/share/wordlists/common.txt': {
      type: 'file',
      content: 'admin\nbackup\napi\nlogin\nindex.html\nconfig\nsecret\ndb_config.php.bak\ndev\nportal',
      permissions: '-rw-r--r--',
      owner: 'root:root'
    },
    '/etc/hosts': {
      type: 'file',
      content: '127.0.0.1 localhost\n10.10.14.5 attackbox.local\n10.20.0.10 webforge.internal\n10.30.0.15 gateway.blackout.corp\n10.40.0.25 ai-gateway.neuroguard.corp',
      permissions: '-rw-r--r--',
      owner: 'root:root'
    }
  };

  constructor(initialCwd: string = '/root') {
    this.cwd = initialCwd;
    this.env.PWD = initialCwd;
  }

  public getCwd(): string {
    return this.cwd;
  }

  public getEnv(key: string): string {
    return this.env[key] || '';
  }

  public getPrompt(): string {
    const user = this.env.USER || 'root';
    const host = this.env.HOSTNAME || 'attackbox';
    const symbol = user === 'root' ? '#' : '$';
    let displayPath = this.cwd;

    if (this.cwd === '/root') {
      displayPath = '~';
    } else if (this.cwd.startsWith('/root/')) {
      displayPath = '~' + this.cwd.slice(5);
    }

    return `${user}@${host}:${displayPath}${symbol}`;
  }

  public getHistory(): string[] {
    return [...this.history];
  }

  public execute(commandStr: string, roe: RulesOfEngagement | null): TerminalOutputLine[] {
    const rawCmd = commandStr.trim();
    if (!rawCmd) return [];

    this.history.push(rawCmd);
    this.historyIndex = this.history.length;

    // Scope check using LabScopeEnforcer
    const scopeCheck = LabScopeEnforcer.validateCommand(rawCmd, roe);
    if (!scopeCheck.allowed) {
      return [
        { text: `${this.getPrompt()} ${rawCmd}`, type: 'input' },
        {
          text: `[SCOPE SECURITY ENFORCER - REFUSAL]`,
          type: 'error'
        },
        {
          text: scopeCheck.reason || 'Operation rejected by Rules of Engagement scope enforcement.',
          type: 'error'
        }
      ];
    }

    const lines: TerminalOutputLine[] = [{ text: `${this.getPrompt()} ${rawCmd}`, type: 'input' }];

    // Tokenize
    const tokens = rawCmd.split(/\s+/);
    const mainCmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);

    switch (mainCmd) {
      case 'help':
        lines.push(...this.handleHelp());
        break;
      case 'clear':
        // Special case: handled in frontend component, return empty signal
        return [];
      case 'pwd':
        lines.push({ text: this.cwd, type: 'output' });
        break;
      case 'whoami':
        lines.push({ text: this.env.USER, type: 'output' });
        break;
      case 'id':
        lines.push({ text: `uid=0(root) gid=0(root) groups=0(root)`, type: 'output' });
        break;
      case 'uname':
        lines.push({ text: `Linux attackbox 6.1.0-18-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.76-1 x86_64 GNU/Linux`, type: 'output' });
        break;
      case 'ifconfig':
      case 'ip':
        lines.push(...this.handleIpConfig());
        break;
      case 'ls':
        lines.push(...this.handleLs(args));
        break;
      case 'cd':
        lines.push(...this.handleCd(args[0]));
        break;
      case 'cat':
        lines.push(...this.handleCat(args));
        break;
      case 'echo':
        lines.push(...this.handleEcho(args, rawCmd));
        break;
      case 'mkdir':
        lines.push(...this.handleMkdir(args));
        break;
      case 'rm':
        lines.push(...this.handleRm(args));
        break;
      case 'chmod':
        lines.push(...this.handleChmod(args));
        break;
      case 'base64':
        lines.push(...this.handleBase64(args));
        break;
      case 'grep':
        lines.push(...this.handleGrep(args));
        break;
      case 'nmap':
        lines.push(...this.handleNmap(args, roe));
        break;
      case 'gobuster':
      case 'ffuf':
        lines.push(...this.handleGobuster(args, mainCmd));
        break;
      case 'hydra':
        lines.push(...this.handleHydra(args));
        break;
      case 'curl':
        lines.push(...this.handleCurl(args, rawCmd));
        break;
      case 'sudo':
        lines.push(...this.handleSudo(args, rawCmd));
        break;
      case 'wget':
        lines.push(...this.handleWget(args));
        break;
      case 'nc':
      case 'netcat':
        lines.push(...this.handleNc(args));
        break;
      case 'ssh':
        lines.push(...this.handleSsh(args));
        break;
      case 'python':
      case 'python3':
        if (rawCmd.toLowerCase().includes('getuserspns')) {
          lines.push(...this.handleKerberoast(args));
        } else if (rawCmd.toLowerCase().includes('bloodhound')) {
          lines.push(...this.handleBloodhound(args));
        } else {
          lines.push(...this.handlePython(args));
        }
        break;
      case 'ldapsearch':
        lines.push(...this.handleLdapsearch(args));
        break;
      case 'getuserspns.py':
      case 'impacket-getuserspns':
        lines.push(...this.handleKerberoast(args));
        break;
      case 'hashcat':
      case 'john':
        lines.push(...this.handleHashcat(args));
        break;
      case 'smbclient':
      case 'crackmapexec':
        lines.push(...this.handleSmbclient(args, rawCmd));
        break;
      case 'bloodhound-python':
      case 'bloodhound':
        lines.push(...this.handleBloodhound(args));
        break;
      case 'chisel':
        lines.push(...this.handleChisel(args));
        break;
      default:
        lines.push({ text: `bash: ${mainCmd}: command not found. Type "help" for available tools.`, type: 'error' });
        break;
    }

    return lines;
  }

  private resolvePath(target: string): string {
    if (!target) return this.cwd;
    if (target.startsWith('/')) return target;
    if (target === '~' || target.startsWith('~/')) {
      const sub = target.slice(1);
      return (this.env.HOME || '/root') + sub;
    }
    if (target === '.') return this.cwd;
    if (target === '..') {
      const parts = this.cwd.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('');
    }
    return (this.cwd === '/' ? '' : this.cwd) + '/' + target;
  }

  private handleHelp(): TerminalOutputLine[] {
    return [
      { text: '════════════════════════════════════════════════════════════════════════════════', type: 'system' },
      { text: '  MY CYBER LAB — AUTHORIZED ATTACKBOX BASH ENGINE v1.0', type: 'system' },
      { text: '════════════════════════════════════════════════════════════════════════════════', type: 'system' },
      { text: '  SYSTEM & SHELL:', type: 'banner' },
      { text: '    ls [path]             List files & directories', type: 'output' },
      { text: '    cd [path]             Change directory', type: 'output' },
      { text: '    pwd                   Print working directory', type: 'output' },
      { text: '    cat [file]            Display file contents', type: 'output' },
      { text: '    echo [text] > [file]  Write to file', type: 'output' },
      { text: '    grep [pattern] [file] Search for pattern in file', type: 'output' },
      { text: '    base64 [-d] [file]    Encode or decode base64 strings', type: 'output' },
      { text: '    ifconfig / ip a       Display local network configuration', type: 'output' },
      { text: '    clear                 Clear terminal scrollback', type: 'output' },
      { text: '  PENETRATION TESTING TOOL SUITE:', type: 'banner' },
      { text: '    nmap -sV -sC [ip]     TCP SYN & service version scanner', type: 'output' },
      { text: '    gobuster dir -u [url] Directory & file bruteforcer', type: 'output' },
      { text: '    hydra -l [user] -P [passlist] [ip] [service] Password brute force', type: 'output' },
      { text: '    curl [-v|-i] [url]    HTTP request client & header inspector', type: 'output' },
      { text: '    wget [url]            Download files to local VFS', type: 'output' },
      { text: '    nc -lvnp [port]       Netcat listener & socket client', type: 'output' },
      { text: '    ssh [user@ip]         Secure Shell client', type: 'output' },
      { text: '    python3 -m http.server [port] Spawn local web server', type: 'output' },
      { text: '════════════════════════════════════════════════════════════════════════════════', type: 'system' }
    ];
  }

  private handleIpConfig(): TerminalOutputLine[] {
    return [
      { text: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500', type: 'output' },
      { text: `        inet ${this.env.IP}  netmask 255.255.255.0  broadcast 10.10.14.255`, type: 'output' },
      { text: '        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>', type: 'output' },
      { text: '        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)', type: 'output' },
      { text: '        RX packets 42105  bytes 31405912 (31.4 MB)', type: 'output' },
      { text: '        TX packets 28912  bytes 4901234 (4.9 MB)', type: 'output' }
    ];
  }

  private handleLs(args: string[]): TerminalOutputLine[] {
    const showLong = args.some(a => a.includes('l'));
    const targetArg = args.find(a => !a.startsWith('-')) || '.';
    const targetPath = this.resolvePath(targetArg);

    const dirNode = this.vfs[targetPath];
    if (!dirNode) {
      return [{ text: `ls: cannot access '${targetArg}': No such file or directory`, type: 'error' }];
    }

    if (dirNode.type === 'file') {
      return [{ text: targetArg, type: 'output' }];
    }

    const items: string[] = [];
    const prefix = targetPath === '/' ? '/' : targetPath + '/';

    for (const p of Object.keys(this.vfs)) {
      if (p !== targetPath && p.startsWith(prefix)) {
        const sub = p.slice(prefix.length);
        if (!sub.includes('/')) {
          const node = this.vfs[p];
          if (showLong) {
            const perm = node.permissions || (node.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--');
            const owner = node.owner || 'root:root';
            const size = node.content ? node.content.length : 4096;
            items.push(`${perm} 1 ${owner} ${size.toString().padStart(5, ' ')} Aug 31 05:00 ${sub}`);
          } else {
            items.push(node.type === 'directory' ? `${sub}/` : sub);
          }
        }
      }
    }

    if (items.length === 0) {
      return [{ text: '(empty directory)', type: 'system' }];
    }

    return [{ text: items.join(showLong ? '\n' : '  '), type: 'output' }];
  }

  private handleCd(pathStr?: string): TerminalOutputLine[] {
    if (!pathStr || pathStr === '~') {
      this.cwd = this.env.HOME || '/root';
      this.env.PWD = this.cwd;
      return [];
    }

    const resolved = this.resolvePath(pathStr);
    const node = this.vfs[resolved];

    if (!node) {
      return [{ text: `bash: cd: ${pathStr}: No such file or directory`, type: 'error' }];
    }
    if (node.type !== 'directory') {
      return [{ text: `bash: cd: ${pathStr}: Not a directory`, type: 'error' }];
    }

    this.cwd = resolved;
    this.env.PWD = resolved;
    return [];
  }

  private handleCat(args: string[]): TerminalOutputLine[] {
    if (args.length === 0) return [{ text: 'cat: missing file operand', type: 'error' }];
    const targetPath = this.resolvePath(args[0]);
    const node = this.vfs[targetPath];

    if (!node) {
      return [{ text: `cat: ${args[0]}: No such file or directory`, type: 'error' }];
    }
    if (node.type === 'directory') {
      return [{ text: `cat: ${args[0]}: Is a directory`, type: 'error' }];
    }

    return [{ text: node.content || '', type: 'output' }];
  }

  private handleEcho(args: string[], rawCmd: string): TerminalOutputLine[] {
    const redirectIdx = args.findIndex(a => a === '>' || a === '>>');
    if (redirectIdx !== -1 && args[redirectIdx + 1]) {
      const isAppend = args[redirectIdx] === '>>';
      const fileTarget = args[redirectIdx + 1];
      const targetPath = this.resolvePath(fileTarget);
      
      const contentParts = args.slice(0, redirectIdx).join(' ').replace(/^["']|["']$/g, '');
      const existing = this.vfs[targetPath]?.content || '';
      const newContent = isAppend ? (existing ? existing + '\n' + contentParts : contentParts) : contentParts;

      this.vfs[targetPath] = {
        type: 'file',
        content: newContent,
        permissions: '-rw-r--r--',
        owner: `${this.env.USER}:${this.env.USER}`
      };

      return [{ text: `Written to ${fileTarget}`, type: 'success' }];
    }

    return [{ text: args.join(' ').replace(/^["']|["']$/g, ''), type: 'output' }];
  }

  private handleMkdir(args: string[]): TerminalOutputLine[] {
    if (!args[0]) return [{ text: 'mkdir: missing operand', type: 'error' }];
    const targetPath = this.resolvePath(args[0]);
    this.vfs[targetPath] = {
      type: 'directory',
      permissions: 'drwxr-xr-x',
      owner: `${this.env.USER}:${this.env.USER}`
    };
    return [];
  }

  private handleRm(args: string[]): TerminalOutputLine[] {
    const fileArg = args.find(a => !a.startsWith('-'));
    if (!fileArg) return [{ text: 'rm: missing operand', type: 'error' }];
    const targetPath = this.resolvePath(fileArg);

    if (this.vfs[targetPath]) {
      delete this.vfs[targetPath];
      return [];
    }
    return [{ text: `rm: cannot remove '${fileArg}': No such file or directory`, type: 'error' }];
  }

  private handleChmod(args: string[]): TerminalOutputLine[] {
    if (args.length < 2) return [{ text: 'chmod: missing operand', type: 'error' }];
    const perms = args[0];
    const targetPath = this.resolvePath(args[1]);
    if (this.vfs[targetPath]) {
      this.vfs[targetPath].permissions = perms;
      return [];
    }
    return [{ text: `chmod: cannot access '${args[1]}': No such file or directory`, type: 'error' }];
  }

  private handleBase64(args: string[]): TerminalOutputLine[] {
    const isDecode = args.includes('-d') || args.includes('--decode');
    const fileArg = args.find(a => !a.startsWith('-'));

    let inputStr = '';
    if (fileArg) {
      const resolved = this.resolvePath(fileArg);
      inputStr = this.vfs[resolved]?.content || fileArg;
    }

    if (!inputStr) return [{ text: 'base64: missing input string or file', type: 'error' }];

    try {
      if (isDecode) {
        return [{ text: atob(inputStr.trim()), type: 'output' }];
      } else {
        return [{ text: btoa(inputStr), type: 'output' }];
      }
    } catch {
      return [{ text: 'base64: invalid input string', type: 'error' }];
    }
  }

  private handleGrep(args: string[]): TerminalOutputLine[] {
    if (args.length < 2) return [{ text: 'grep: missing pattern or file', type: 'error' }];
    const pattern = args[0];
    const targetPath = this.resolvePath(args[1]);
    const file = this.vfs[targetPath];

    if (!file || file.type !== 'file') {
      return [{ text: `grep: ${args[1]}: No such file`, type: 'error' }];
    }

    const lines = (file.content || '').split('\n');
    const matches = lines.filter(l => l.includes(pattern));
    return matches.map(m => ({ text: m, type: 'output' }));
  }

  private handleNmap(args: string[], roe: RulesOfEngagement | null): TerminalOutputLine[] {
    const target = args.find(a => !a.startsWith('-') && a !== 'nmap');
    if (!target) {
      return [
        { text: 'Nmap 7.94 ( https://nmap.org )', type: 'banner' },
        { text: 'Usage: nmap [Scan Types] [Options] {target specification}', type: 'output' },
        { text: 'Example: nmap -sV -sC 10.20.0.10', type: 'output' }
      ];
    }

    const machine = MachineRegistry.getAllMachines().find(
      m => m.ipAddress === target || m.hostname.toLowerCase() === target.toLowerCase() || m.codename.toLowerCase() === target.toLowerCase()
    );

    const startTime = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (!machine) {
      return [
        { text: `Starting Nmap 7.94 ( https://nmap.org ) at ${startTime} UTC`, type: 'system' },
        { text: `Note: Host seems down. If it is really up, but blocking our ping probes, try -Pn`, type: 'warning' },
        { text: `Nmap done: 1 IP address (0 hosts up) scanned in 1.22 seconds`, type: 'system' }
      ];
    }

    const output: TerminalOutputLine[] = [
      { text: `Starting Nmap 7.94 ( https://nmap.org ) at ${startTime} UTC`, type: 'system' },
      { text: `Nmap scan report for ${machine.hostname} (${machine.ipAddress})`, type: 'success' },
      { text: `Host is up (0.0024s latency).`, type: 'output' },
      { text: `Not shown: 997 closed tcp ports (reset)`, type: 'output' },
      { text: `PORT     STATE SERVICE    VERSION`, type: 'banner' }
    ];

    for (const svc of machine.services) {
      const portStr = `${svc.port}/${svc.protocol.toLowerCase()}`.padEnd(9, ' ');
      const stateStr = svc.state.toLowerCase().padEnd(8, ' ');
      const serviceStr = svc.serviceName.padEnd(10, ' ');
      const verStr = `${svc.product || ''} ${svc.version || ''}`.trim();

      output.push({
        text: `${portStr}${stateStr}${serviceStr}${verStr}`,
        type: svc.isVulnerable ? 'warning' : 'output'
      });

      if (args.includes('-sC') || args.includes('-A')) {
        output.push({
          text: `|_ ${svc.serviceName}-banner: ${svc.banner}`,
          type: 'system'
        });
      }
    }

    if (args.includes('-O') || args.includes('-A')) {
      output.push({ text: `OS details: ${machine.os}`, type: 'system' });
    }

    output.push({ text: `Nmap done: 1 IP address (1 host up) scanned in 2.48 seconds`, type: 'success' });
    return output;
  }

  private handleGobuster(args: string[], mainCmd: string): TerminalOutputLine[] {
    const urlIdx = args.indexOf('-u');
    const url = urlIdx !== -1 ? args[urlIdx + 1] : args.find(a => a.startsWith('http'));

    if (!url) {
      return [{ text: `${mainCmd}: missing target URL flag -u http://10.20.0.10/`, type: 'error' }];
    }

    const cleanUrl = url.replace(/\/$/, '');
    const output: TerminalOutputLine[] = [
      { text: `===============================================================`, type: 'system' },
      { text: `${mainCmd} v3.6 - Directory & File Enumeration Engine`, type: 'banner' },
      { text: `===============================================================`, type: 'system' },
      { text: `[+] Url:          ${cleanUrl}`, type: 'output' },
      { text: `[+] Method:       GET`, type: 'output' },
      { text: `[+] Threads:      10`, type: 'output' },
      { text: `[+] Wordlist:     /usr/share/wordlists/common.txt`, type: 'output' },
      { text: `===============================================================`, type: 'system' }
    ];

    if (cleanUrl.includes('10.20.0.10') || cleanUrl.includes('webforge')) {
      output.push(
        { text: `[+] /index.html           (Status: 200) [Size: 420]`, type: 'output' },
        { text: `[+] /backup               (Status: 301) [Size: 182] -> /backup/`, type: 'success' },
        { text: `[+] /backup/db_config.php.bak (Status: 200) [Size: 188] [EXPOSED CREDENTIALS]`, type: 'success' },
        { text: `[+] /api                  (Status: 200) [Size: 95]`, type: 'output' },
        { text: `[+] /api/v1/download      (Status: 400) [Size: 52] [FILE READ VULNERABLE]`, type: 'warning' }
      );
    } else if (cleanUrl.includes('10.30.0.15') || cleanUrl.includes('blackout')) {
      output.push(
        { text: `[+] /index.html           (Status: 200) [Size: 1040]`, type: 'output' },
        { text: `[+] /login                (Status: 200) [Size: 850]`, type: 'output' },
        { text: `[+] /api/v1/health        (Status: 200) [Size: 45]`, type: 'output' }
      );
    } else {
      output.push(
        { text: `[+] /index.html           (Status: 200) [Size: 240]`, type: 'output' }
      );
    }

    output.push({ text: `===============================================================`, type: 'system' });
    output.push({ text: `Finished scanning target: ${cleanUrl}`, type: 'success' });
    return output;
  }

  private handleHydra(args: string[]): TerminalOutputLine[] {
    const target = args.find(a => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(a) || a.includes('.corp') || a.includes('.internal'));
    if (!target) {
      return [{ text: 'Hydra v9.5 - Usage: hydra -l [user] -P [passlist] [target_ip] [service]', type: 'error' }];
    }

    const userIdx = args.indexOf('-l');
    const username = userIdx !== -1 ? args[userIdx + 1] : 'developer';

    const output: TerminalOutputLine[] = [
      { text: `Hydra v9.5 (c) 2026 by van Hauser - Authorized Range Engine`, type: 'banner' },
      { text: `[DATA] attacking ssh://${target}:22/`, type: 'system' },
      { text: `[STATUS] hydra worker threads initialized (16 total)`, type: 'output' }
    ];

    const machine = MachineRegistry.getAllMachines().find(m => m.ipAddress === target || m.hostname === target);
    if (machine && machine.defaultCredentials && machine.defaultCredentials[username]) {
      const foundPass = machine.defaultCredentials[username];
      output.push({
        text: `[22][ssh] host: ${target}   login: ${username}   password: ${foundPass}`,
        type: 'success'
      });
      output.push({ text: `1 target successfully cracked (1 valid credential set found)`, type: 'success' });
    } else {
      output.push({ text: `0 valid password combinations discovered for user [${username}]`, type: 'warning' });
    }

    return output;
  }

  private handleCurl(args: string[], rawCmd: string): TerminalOutputLine[] {
    const url = args.find(a => a.startsWith('http://') || a.startsWith('https://')) || args.find(a => !a.startsWith('-') && a !== 'curl');
    if (!url) {
      return [{ text: 'curl: try "curl --help" for more information', type: 'error' }];
    }

    const cleanUrl = url.startsWith('http') ? url : `http://${url}`;
    const isVerbose = args.includes('-v') || args.includes('-i');

    const output: TerminalOutputLine[] = [];

    if (isVerbose) {
      output.push(
        { text: `* Connecting to ${cleanUrl}...`, type: 'system' },
        { text: `> GET / HTTP/1.1`, type: 'system' },
        { text: `> Host: ${cleanUrl.replace(/https?:\/\//, '')}`, type: 'system' },
        { text: `> User-Agent: curl/7.88.1`, type: 'system' },
        { text: `<`, type: 'system' },
        { text: `< HTTP/1.1 200 OK`, type: 'success' },
        { text: `< Server: WebForge HTTP Server v1.4 (Apache/2.4.52 PHP/8.1.2)`, type: 'system' },
        { text: `< Content-Type: text/html; charset=UTF-8`, type: 'system' },
        { text: `<`, type: 'system' }
      );
    }

    // Directory Traversal Endpoint Check: /api/v1/download?file=...
    if (cleanUrl.includes('/api/v1/download')) {
      if (cleanUrl.includes('sudoers')) {
        output.push({
          text: `developer ALL=(ALL) NOPASSWD: /usr/bin/sys-update`,
          type: 'warning'
        });
      } else if (cleanUrl.includes('user.txt') || cleanUrl.includes('developer')) {
        output.push({
          text: `FLAG{WEBFORGE_DIR_TRAVERSAL_EXPLOITED_8891}`,
          type: 'success'
        });
      } else if (cleanUrl.includes('root.txt') || cleanUrl.includes('root')) {
        output.push({
          text: `FLAG{WEBFORGE_ROOT_PRIVILEGE_UNLOCKED_9921}`,
          type: 'success'
        });
      } else {
        output.push({
          text: `[REST API FILE DOWNLOAD ENGINES] File specified by query parameter 'file' could not be found or read permission denied.`,
          type: 'error'
        });
      }
    } else if (cleanUrl.includes('db_config.php.bak')) {
      output.push({
        text: `<?php\n  // WebForge Staging Database Configuration\n  $db_host = "localhost";\n  $db_user = "developer";\n  $db_pass = "WebForge_Dev_Pass_2026!";\n  $DB_PASS = "devpass_2026!";\n  $db_name = "webforge_production";\n  // REST API Download Endpoint: /api/v1/download?file=<filepath>\n?>`,
        type: 'output'
      });
    } else if (cleanUrl.includes('10.20.0.10') || cleanUrl.includes('webforge')) {
      output.push({ text: `<!DOCTYPE html><html><head><title>WebForge Dev Portal v1.4</title></head><body><h1>WebForge Internal Dev Portal v1.4</h1><p>Internal Developer Services Active. Access restricted to authorized network 10.20.0.0/24.</p><!-- Note: Diagnostic backup saved in /backup/db_config.php.bak for maintenance --></body></html>`, type: 'output' });
    } else if (cleanUrl.includes('10.40.0.25') || cleanUrl.includes('neuroguard')) {
      output.push({ text: `{"status": "online", "model": "NeuroGuard-Enterprise-v2", "endpoints": ["/api/chat", "/api/ingest"]}`, type: 'output' });
    } else {
      output.push({ text: `<!DOCTYPE html><html><body><h1>200 OK - Target Online</h1></body></html>`, type: 'output' });
    }

    return output;
  }

  private handleWget(args: string[]): TerminalOutputLine[] {
    const url = args.find(a => !a.startsWith('-'));
    if (!url) return [{ text: 'wget: missing URL', type: 'error' }];

    const filename = url.split('/').pop() || 'index.html';
    const targetPath = this.resolvePath(filename);

    this.vfs[targetPath] = {
      type: 'file',
      content: `[Downloaded artifact from ${url}]\nFLAG{WEBFORGE_INITIAL_ACCESS_DEV_8821}`,
      permissions: '-rw-r--r--',
      owner: 'root:root'
    };

    return [
      { text: `--2026-08-31 05:00:00--  ${url}`, type: 'system' },
      { text: `Connecting to ${url}... connected.`, type: 'system' },
      { text: `HTTP request sent, awaiting response... 200 OK`, type: 'success' },
      { text: `Length: 512 [text/plain]`, type: 'output' },
      { text: `Saving to: ‘${filename}’`, type: 'output' },
      { text: `‘${filename}’ saved [512/512]`, type: 'success' }
    ];
  }

  private handleNc(args: string[]): TerminalOutputLine[] {
    const isListen = args.includes('-l') || args.includes('-lvnp') || args.includes('-lp');
    if (isListen) {
      const port = args.find(a => /^[0-9]+$/.test(a)) || '4444';
      return [
        { text: `listening on [any] ${port} ...`, type: 'system' },
        { text: `connect to [10.10.14.5] from (UNKNOWN) [10.20.0.10] 52144`, type: 'success' },
        { text: `developer@webforge:~$ whoami`, type: 'input' },
        { text: `developer`, type: 'output' }
      ];
    }
    return [{ text: 'netcat client connected cleanly.', type: 'success' }];
  }

  private handleSsh(args: string[]): TerminalOutputLine[] {
    const targetArg = args.find(a => !a.startsWith('-'));
    if (!targetArg) return [{ text: 'ssh: missing target address (e.g., developer@10.20.0.10)', type: 'error' }];

    const [user, host] = targetArg.includes('@') ? targetArg.split('@') : ['root', targetArg];

    const machine = MachineRegistry.getAllMachines().find(m => m.ipAddress === host || m.hostname === host);
    if (machine && machine.defaultCredentials && machine.defaultCredentials[user]) {
      return [
        { text: `The authenticity of host '${host}' can't be established.`, type: 'warning' },
        { text: `ED25519 key fingerprint is SHA256:7uG...`, type: 'output' },
        { text: `Warning: Permanently added '${host}' (ED25519) to the list of known hosts.`, type: 'system' },
        { text: `${user}@${host}'s password: `, type: 'input' },
        { text: `Welcome to ${machine.name} (${machine.os})`, type: 'success' },
        { text: `${user}@${machine.hostname}:~$ `, type: 'output' }
      ];
    }

    return [
      { text: `${user}@${host}'s password: `, type: 'input' },
      { text: `Permission denied, please try again.`, type: 'error' }
    ];
  }

  private handlePython(args: string[]): TerminalOutputLine[] {
    if (args.includes('-m') && args.includes('http.server')) {
      const port = args.find(a => /^[0-9]+$/.test(a)) || '8000';
      return [
        { text: `Serving HTTP on 0.0.0.0 port ${port} (http://0.0.0.0:${port}/) ...`, type: 'success' },
        { text: `10.20.0.10 - - [31/Aug/2026 05:00:00] "GET /exploit.py HTTP/1.1" 200 -`, type: 'output' }
      ];
    }
    return [
      { text: `Python 3.11.8 (main, Feb 12 2026, 14:50:00) [GCC 13.2.0] on linux`, type: 'banner' },
      { text: `Type "help", "copyright", "credits" or "license" for more information.`, type: 'output' },
      { text: `>>> print("MY CYBER LAB Python Execution Engine OK")`, type: 'input' },
      { text: `MY CYBER LAB Python Execution Engine OK`, type: 'output' }
    ];
  }

  private handleSudo(args: string[], rawCmd: string): TerminalOutputLine[] {
    if (args.includes('-l')) {
      return [
        { text: `Matching Defaults entries for developer on webforge:`, type: 'output' },
        { text: `    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin`, type: 'system' },
        { text: ``, type: 'output' },
        { text: `User developer may run the following commands on webforge:`, type: 'success' },
        { text: `    (ALL) NOPASSWD: /usr/bin/sys-update`, type: 'warning' }
      ];
    }

    if (rawCmd.includes('sys-update')) {
      this.env.USER = 'root';
      return [
        { text: `[+] System Update Utility v2.1 (SUID Executed as root)`, type: 'banner' },
        { text: `[+] Validating developer NOPASSWD privilege boundary...`, type: 'system' },
        { text: `[+] Elevating privileges to root administrative user...`, type: 'success' },
        { text: `FLAG{WEBFORGE_ROOT_PRIVILEGE_UNLOCKED_9921}`, type: 'success' }
      ];
    }

    if (rawCmd.includes('su') || rawCmd.includes('bash')) {
      this.env.USER = 'root';
      return [
        { text: `[+] Superuser privilege elevation granted.`, type: 'success' },
        { text: `root@webforge:~# whoami`, type: 'input' },
        { text: `root`, type: 'output' }
      ];
    }

    return [
      { text: `sudo: ${args.join(' ')}: command not found or privilege escalation denied`, type: 'error' }
    ];
  }

  private handleLdapsearch(args: string[]): TerminalOutputLine[] {
    const host = args.find(a => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(a) || a.includes('.corp')) || '10.30.10.10';
    return [
      { text: `# Extended LDIF`, type: 'system' },
      { text: `# LDAPv3 - Active Directory Service Provider`, type: 'banner' },
      { text: `# Base <dc=blackout,dc=corp> with scope subtree`, type: 'system' },
      { text: ``, type: 'output' },
      { text: `dn: DC=blackout,DC=corp`, type: 'output' },
      { text: `objectClass: top\nobjectClass: domain\ndc: blackout`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `dn: CN=operator,OU=Users,DC=blackout,DC=corp`, type: 'output' },
      { text: `sAMAccountName: operator\nuserPrincipalName: operator@blackout.corp`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `dn: CN=svc_sql,OU=Service Accounts,DC=blackout,DC=corp`, type: 'success' },
      { text: `sAMAccountName: svc_sql`, type: 'success' },
      { text: `servicePrincipalName: MSSQLSvc/srv01.blackout.corp:1433`, type: 'warning' },
      { text: `userPrincipalName: svc_sql@blackout.corp`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `dn: CN=Domain Admins,OU=Groups,DC=blackout,DC=corp`, type: 'output' },
      { text: `sAMAccountName: Domain Admins`, type: 'output' },
      { text: `member: CN=a.administrator,OU=Users,DC=blackout,DC=corp`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `# search result\nsearch: 2\nresult: 0 Success`, type: 'success' }
    ];
  }

  private handleKerberoast(args: string[]): TerminalOutputLine[] {
    return [
      { text: `Impacket v0.11.0 - Kerberos SPN Enumeration & Ticket Extraction Engine`, type: 'banner' },
      { text: `[+] Connecting to KDC 10.30.10.10:88 (BLACKOUT.CORP)... Connected.`, type: 'system' },
      { text: `[+] Authenticated user: operator@BLACKOUT.CORP`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `ServicePrincipalName               Name     MemberOf             PasswordLastSet`, type: 'banner' },
      { text: `---------------------------------  -------  -------------------  ---------------`, type: 'system' },
      { text: `MSSQLSvc/srv01.blackout.corp:1433  svc_sql  OU=Service Accounts  2026-05-12`, type: 'warning' },
      { text: ``, type: 'output' },
      { text: `[+] Requesting TGS ticket for MSSQLSvc/srv01.blackout.corp:1433...`, type: 'system' },
      { text: `[+] TGS Ticket Encrypted with RC4-HMAC (etype 23) captured:`, type: 'success' },
      { text: `$krb5tgs$23$*svc_sql$BLACKOUT.CORP$MSSQLSvc/srv01.blackout.corp:1433*$8f51a798bf1b349540b618e4785461c368d1bf7d3fa8791bd55b706c646b1428*a7c92e1049b11e2f`, type: 'warning' },
      { text: `[+] Saved TGS ticket hash to /root/hashes.kerberoast`, type: 'success' }
    ];
  }

  private handleHashcat(args: string[]): TerminalOutputLine[] {
    return [
      { text: `hashcat (v6.2.6) starting in autodetect mode...`, type: 'banner' },
      { text: `Hashes: 1 digest loaded`, type: 'system' },
      { text: `Bitmaps: 16 bits, 65536 entries`, type: 'output' },
      { text: `Wordlist: /usr/share/wordlists/rockyou.txt`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `$krb5tgs$23$*svc_sql$BLACKOUT.CORP$MSSQLSvc/srv01.blackout.corp:1433*:Summer2024!`, type: 'success' },
      { text: ``, type: 'output' },
      { text: `Session..........: hashcat`, type: 'output' },
      { text: `Status...........: Cracked`, type: 'success' },
      { text: `Hash.Mode........: 13100 (Kerberos 5 TGS-REP etype 23)`, type: 'system' },
      { text: `Hash.Target......: svc_sql ($krb5tgs$23$)`, type: 'output' },
      { text: `Speed.#1.........: 4521.2 kH/s (0.01s)`, type: 'output' },
      { text: `Recovered........: 1/1 (100.00%) Digests`, type: 'success' }
    ];
  }

  private handleSmbclient(args: string[], rawCmd: string): TerminalOutputLine[] {
    const host = args.find(a => /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(a) || a.includes('.corp')) || '10.30.10.20';
    return [
      { text: `[+] SMBv3 Session Established on ${host}:445 (BLACKOUT.CORP)`, type: 'banner' },
      { text: ``, type: 'output' },
      { text: `        Sharename       Type      Comment`, type: 'banner' },
      { text: `        ---------       ----      -------`, type: 'system' },
      { text: `        ADMIN$          Disk      Remote Admin`, type: 'output' },
      { text: `        C$              Disk      Default Share`, type: 'output' },
      { text: `        FinanceShares   Disk      Confidential Enterprise Financial Records`, type: 'warning' },
      { text: `        IPC$            IPC       IPC Service`, type: 'output' },
      { text: `        NETLOGON        Disk      Network Logon Service`, type: 'output' },
      { text: `        SYSVOL          Disk      Logon Scripts`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `smb: \\> ls FinanceShares`, type: 'input' },
      { text: `  .                                   D        0  Mon Aug 31 07:00:00 2026`, type: 'output' },
      { text: `  da_credentials_backup.txt           N     2048  Sun Aug 30 18:10:00 2026`, type: 'success' },
      { text: `  da_flag.txt                         N      512  Sun Aug 30 19:00:00 2026`, type: 'success' }
    ];
  }

  private handleBloodhound(args: string[]): TerminalOutputLine[] {
    return [
      { text: `[+] BloodHound Active Directory Ingestion Engine v1.7`, type: 'banner' },
      { text: `[+] Connecting to GC dc01.blackout.corp (10.30.10.10:389)... Connected.`, type: 'system' },
      { text: `[+] Authenticating as operator@BLACKOUT.CORP... Success.`, type: 'success' },
      { text: `[+] Domain: BLACKOUT.CORP (S-1-5-21-392104812-1049281-9921)`, type: 'output' },
      { text: `[+] Found 4 Users, 3 Groups, 3 Computers, 1 SPN Target.`, type: 'output' },
      { text: `[+] Graph compressed to 4 json files: users.json, groups.json, computers.json, domains.json.`, type: 'success' }
    ];
  }

  private handleChisel(args: string[]): TerminalOutputLine[] {
    return [
      { text: `[+] Chisel SOCKS5 Tunneling Agent v1.9.1`, type: 'banner' },
      { text: `[+] Client connecting to 10.30.0.15:8080 (tunnel established)`, type: 'system' },
      { text: `[+] SOCKS5 proxy listening on 127.0.0.1:1080 -> Pivoting into internal subnet 10.30.10.0/24`, type: 'success' }
    ];
  }
}
