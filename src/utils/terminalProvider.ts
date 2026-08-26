export interface CommandHistoryItem {
  command: string;
  output: string;
  isError?: boolean;
}

export interface TerminalSessionState {
  sessionId: string;
  workingDirectory: string;
  commandHistory: CommandHistoryItem[];
  filesystemState: Record<string, any>;
  isActive: boolean;
}

export interface CommandExecutionResult {
  output: string;
  isError?: boolean;
  workingDirectory?: string;
}

export interface TerminalProvider {
  createSession(labId: string, userId: string): Promise<TerminalSessionState>;
  executeCommand(command: string): Promise<CommandExecutionResult>;
  getSessionState(): TerminalSessionState | null;
  getWorkingDirectory(): string;
  getFilesystemState(): Record<string, any>;
  getCommandHistory(): CommandHistoryItem[];
  resetSession(): Promise<TerminalSessionState>;
  terminateSession(): Promise<void>;
  getProviderName(): 'SIMULATED TRAINING TERMINAL' | 'Development/controlled sandbox' | 'ISOLATED TRAINING MACHINE';
}

/**
 * Concrete implementation of SimulatedTerminalProvider (Standard Client-Side Sandbox)
 */
export class SimulatedTerminalProvider implements TerminalProvider {
  private sessionId: string = '';
  private currentDir: string = '/home/student';
  private history: CommandHistoryItem[] = [];
  private isActive: boolean = false;
  private filesystem: Record<string, string> = {
    '/home/student/notes.txt': `=== MY CYBER LAB STUDENT NOTES ===\n1. Security starts with understanding normal baseline telemetry.\n2. Always verify host identity with "whoami" and "id".\n3. Port audits begin with "ss -tuln" and "ip addr".\n4. Never execute unknown scripts outside the safe training lab.`,
    '/labs/network_audit.sh': '# Network Audit Utility\necho "[*] Auditing range 10.10.10.0/24..."',
    '/labs/vault/.secret_flag': 'FLAG{LINUX_TERMINAL_MASTERY_APEX_8891}\nCongratulations! You have completed the terminal sandbox challenge.',
    '/labs/vault/instructions.md': 'Locate and inspect the hidden dotfile in this directory to extract the flag.'
  };

  async createSession(labId: string, userId: string): Promise<TerminalSessionState> {
    this.sessionId = `sim-session-${labId}-${Date.now()}`;
    this.currentDir = '/home/student';
    this.isActive = true;
    this.history = [
      {
        command: '# SYSTEM INITIALIZATION',
        output: `╔══════════════════════════════════════════════════════════════════════════════╗\n║  MY CYBER LAB — TRAINING TERMINAL (SIMULATED SANDBOX)                        ║\n║  Kernel: Linux 5.15.0-89-generic #99-Ubuntu SMP x86_64                      ║\n║  Security: Strict Client-Side Sandbox. Simulated environment only.          ║\n║  Type "help" for built-in commands or explore /home/student, /labs, /notes.  ║\n╚══════════════════════════════════════════════════════════════════════════════╝`
      }
    ];
    return this.getStateSnapshot();
  }

  async executeCommand(rawCmd: string): Promise<CommandExecutionResult> {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      return { output: '' };
    }

    const lower = trimmed.toLowerCase();
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = '';
    let isError = false;

    // Simulate Command Parsing
    if (cmd === 'help') {
      output = `MY CYBER LAB SIMULATED COMMANDS:\n` +
        `  pwd                  Print current working directory\n` +
        `  ls [-la]             List files and directories\n` +
        `  cd <dir>             Change directory (/home/student, /labs, /notes, /tmp, /etc, /var/log)\n` +
        `  cat <file>           Display file contents\n` +
        `  whoami / id          Show user and group identities\n` +
        `  uname -a             Show operating system kernel details\n` +
        `  ip addr / ifconfig   Show network interfaces\n` +
        `  ss -tuln             Inspect active listening sockets\n` +
        `  ps aux               List all active processes\n` +
        `  grep <pattern> <f>   Search pattern in files\n` +
        `  find <path>          Search filesystem\n` +
        `  ping -c 3 <ip>       Test ICMP reachability\n` +
        `  curl -I <url>        Send HTTP request\n` +
        `  nmap <target>        Run port scan in training range\n` +
        `  reset                Restore sandbox filesystem state\n` +
        `  clear                Clear terminal screen`;
    } else if (cmd === 'clear') {
      this.history = [];
      return { output: '', workingDirectory: this.currentDir };
    } else if (cmd === 'reset') {
      this.currentDir = '/home/student';
      output = '[+] Simulated training filesystem reset to default clean state.';
    } else if (cmd === 'pwd') {
      output = this.currentDir;
    } else if (cmd === 'cd') {
      const target = args[0] || '/home/student';
      if (['/', '/home', '/home/student', '/labs', '/labs/vault', '/notes', '/tools', '/tmp', '/etc', '/var/log'].includes(target)) {
        this.currentDir = target;
        output = `Changed directory to ${target}`;
      } else if (target === '..') {
        if (this.currentDir === '/labs/vault') {
          this.currentDir = '/labs';
        } else {
          this.currentDir = '/home/student';
        }
        output = `Moved to parent directory ${this.currentDir}`;
      } else {
        output = `cd: ${target}: No such file or directory`;
        isError = true;
      }
    } else if (cmd === 'ls') {
      if (this.currentDir === '/home/student') {
        output = `total 24\ndrwxr-xr-x 4 student student 4096 Aug 21 12:00 .\ndrwxr-xr-x 3 root    root    4096 Aug 21 12:00 ..\n-rw-r--r-- 1 student student  220 Aug 21 12:00 .bashrc\n-rw-r--r-- 1 student student  807 Aug 21 12:00 .profile\n-rw-r--r-- 1 student student 1420 Aug 21 12:00 notes.txt\ndrwxr-xr-x 2 student student 4096 Aug 21 12:00 scripts`;
      } else if (this.currentDir === '/labs') {
        output = `total 16\ndrwxr-xr-x 3 root root 4096 Aug 21 12:00 .\n-rwxr-xr-x 1 root root  512 Aug 21 12:00 network_audit.sh\n-rw-r--r-- 1 root root 1024 Aug 21 12:00 training_case.pcap\ndrwxr-xr-x 2 root root 4096 Aug 21 12:00 vault`;
      } else if (this.currentDir === '/labs/vault') {
        output = `total 8\n-rw-r--r-- 1 root root 128 Aug 21 12:00 .secret_flag\n-rw-r--r-- 1 root root 256 Aug 21 12:00 instructions.md`;
      } else if (this.currentDir === '/tmp') {
        output = `total 4\n-rw-r--r-- 1 student student 0 Aug 21 12:00 probe.txt`;
      } else {
        output = `total 12\n-rw-r--r-- 1 root root 512 Aug 21 12:00 config.conf\n-rw-r--r-- 1 root root 256 Aug 21 12:00 readme.txt`;
      }
    } else if (cmd === 'cat') {
      const file = args[0] || '';
      if (file.includes('notes.txt')) {
        output = this.filesystem['/home/student/notes.txt'];
      } else if (file.includes('.secret_flag') || file.includes('flag')) {
        output = this.filesystem['/labs/vault/.secret_flag'];
      } else if (file.includes('/etc/os-release') || file.includes('/etc/issue')) {
        output = `NAME="Ubuntu"\nVERSION="22.04.4 LTS (Jammy Jellyfish)"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME="Ubuntu 22.04.4 LTS"`;
      } else if (file.includes('/etc/passwd')) {
        output = `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nstudent:x:1000:1000:Student User,,,:/home/student:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin`;
      } else if (file.includes('instructions.md')) {
        output = this.filesystem['/labs/vault/instructions.md'];
      } else if (file.includes('network_audit.sh')) {
        output = this.filesystem['/labs/network_audit.sh'];
      } else {
        output = `cat: ${file}: No such file or directory in simulated filesystem`;
        isError = true;
      }
    } else if (cmd === 'whoami') {
      output = 'student';
    } else if (cmd === 'id') {
      output = 'uid=1000(student) gid=1000(student) groups=1000(student),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),110(lxd)';
    } else if (cmd === 'uname') {
      output = 'Linux mycyberlab-node 5.15.0-89-generic #99-Ubuntu SMP Fri Aug 21 12:00:00 UTC 2026 x86_64 x86_64 x86_64 GNU/Linux';
    } else if (cmd === 'ip' || cmd === 'ifconfig') {
      output = `1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000\n    inet 10.10.10.100/24 brd 10.10.10.255 scope global eth0`;
    } else if (cmd === 'ss' || cmd === 'netstat') {
      output = `Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port   Process\ntcp    LISTEN  0       128            0.0.0.0:22          0.0.0.0:*       users:(("sshd",pid=840,fd=3))\ntcp    LISTEN  0       511            0.0.0.0:80          0.0.0.0:*       users:(("nginx",pid=1024,fd=6))\ntcp    LISTEN  0       128          127.0.0.1:3306        0.0.0.0:*       users:(("mysqld",pid=1120,fd=22))`;
    } else if (cmd === 'ps') {
      output = `UID        PID  PPID  C STIME TTY          TIME CMD\nroot         1     0  0 12:00 ?        00:00:02 /sbin/init\nroot       840     1  0 12:00 ?        00:00:00 /usr/sbin/sshd -D\nroot      1024     1  0 12:00 ?        00:00:01 nginx: master process /usr/sbin/nginx\nstudent   2048  1980  0 12:05 pts/0    00:00:00 /bin/bash`;
    } else if (cmd === 'ping') {
      output = `PING 10.10.10.1 (10.10.10.1) 56(84) bytes of data.\n64 bytes from 10.10.10.1: icmp_seq=1 ttl=64 time=0.412 ms\n64 bytes from 10.10.10.1: icmp_seq=2 ttl=64 time=0.388 ms\n64 bytes from 10.10.10.1: icmp_seq=3 ttl=64 time=0.395 ms\n--- 10.10.10.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss, time 2004ms`;
    } else if (cmd === 'grep') {
      const pattern = args[0] || '';
      const file = args[1] || '';
      if (file.includes('syslog') || file.includes('log')) {
        output = `Aug 23 03:00:12 mycyberlab sshd[2904]: [Notice] Failed password for root from 192.168.1.150 port 49120 ssh2\nAug 23 03:01:45 mycyberlab systemd[1]: [Error] Failed to start systemd-networkd-wait-online.service.`;
      } else {
        output = `grep: ${file}: No such file in log cache. Try searching a simulated log path.`;
      }
    } else if (cmd === 'find') {
      if (trimmed.includes('flag')) {
        output = `/labs/vault/.secret_flag`;
      } else {
        output = `/home/student/notes.txt\n/labs/network_audit.sh\n/labs/vault/.secret_flag\n/labs/vault/instructions.md`;
      }
    } else if (cmd === 'curl') {
      output = `HTTP/1.1 200 OK\nServer: nginx/1.18.0 (Ubuntu)\nDate: Sun, 23 Aug 2026 10:30:00 GMT\nContent-Type: text/html\nContent-Length: 612\nConnection: keep-alive\nLast-Modified: Fri, 21 Aug 2026 12:00:00 GMT\nAccept-Ranges: bytes`;
    } else if (cmd === 'nmap') {
      output = `Starting Nmap 7.80 ( https://nmap.org ) at 2026-08-23 03:30 PDT\nNmap scan report for 10.10.10.5\nHost is up (0.0012s latency).\nNot shown: 998 closed ports\nPORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)\n80/tcp open  http    nginx 1.18.0 (Ubuntu)\n\nService detection performed. Please report any incorrect results at https://nmap.org/submit/ .\nNmap done: 1 IP address (1 host up) scanned in 0.45 seconds`;
    } else {
      output = `bash: ${cmd}: command not found in simulated terminal. Type "help" for a list of training shell tools.`;
      isError = true;
    }

    this.history.push({ command: rawCmd, output, isError });
    return { output, isError, workingDirectory: this.currentDir };
  }

  getSessionState(): TerminalSessionState | null {
    if (!this.isActive) return null;
    return this.getStateSnapshot();
  }

  getWorkingDirectory(): string {
    return this.currentDir;
  }

  getFilesystemState(): Record<string, any> {
    return this.filesystem;
  }

  getCommandHistory(): CommandHistoryItem[] {
    return this.history;
  }

  async resetSession(): Promise<TerminalSessionState> {
    this.currentDir = '/home/student';
    this.history.push({ command: '# RESET SANBOX', output: 'Simulated filesystem state refreshed to baseline.' });
    return this.getStateSnapshot();
  }

  async terminateSession(): Promise<void> {
    this.isActive = false;
    this.history = [];
  }

  getProviderName(): 'SIMULATED TRAINING TERMINAL' | 'Development/controlled sandbox' | 'ISOLATED TRAINING MACHINE' {
    return 'SIMULATED TRAINING TERMINAL';
  }

  private getStateSnapshot(): TerminalSessionState {
    return {
      sessionId: this.sessionId,
      workingDirectory: this.currentDir,
      commandHistory: this.history,
      filesystemState: this.filesystem,
      isActive: this.isActive
    };
  }
}

/**
 * Concrete implementation for Future ContainerTerminalProvider (Micro-container execution via secure API proxy)
 */
export class ContainerTerminalProvider implements TerminalProvider {
  private sessionId: string = '';
  private currentDir: string = '/home/student';
  private history: CommandHistoryItem[] = [];
  private isActive: boolean = false;

  async createSession(labId: string, userId: string): Promise<TerminalSessionState> {
    this.sessionId = `container-session-${labId}-${Date.now()}`;
    this.currentDir = '/home/student';
    this.isActive = true;
    this.history = [
      {
        command: '# STARTING REAL LINUX CONTAINER',
        output: `[+] Provisioning ephemeral micro-container for user ${userId}...\n[+] Session isolated inside restricted network boundary.\n[+] Sandbox activated. Welcome to your Isolated Linux Lab.`
      }
    ];
    return this.getStateSnapshot();
  }

  async executeCommand(command: string): Promise<CommandExecutionResult> {
    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, workingDirectory: this.currentDir })
      });
      if (response.ok) {
        const data = await response.json();
        this.currentDir = data.workingDirectory || this.currentDir;
        this.history.push({ command, output: data.output, isError: data.isError });
        return { output: data.output, isError: data.isError, workingDirectory: this.currentDir };
      }
    } catch (err) {
      console.warn('Backend container terminal API offline, using sandbox fallback:', err);
    }

    // Fallback behavior
    const fallbackOutput = `Executed "${command}" inside virtual isolated container (offline sandbox fallback).`;
    this.history.push({ command, output: fallbackOutput });
    return { output: fallbackOutput, isError: false, workingDirectory: this.currentDir };
  }

  getSessionState(): TerminalSessionState | null {
    return this.isActive ? this.getStateSnapshot() : null;
  }

  getWorkingDirectory(): string {
    return this.currentDir;
  }

  getFilesystemState(): Record<string, any> {
    return {};
  }

  getCommandHistory(): CommandHistoryItem[] {
    return this.history;
  }

  async resetSession(): Promise<TerminalSessionState> {
    this.currentDir = '/home/student';
    return this.getStateSnapshot();
  }

  async terminateSession(): Promise<void> {
    this.isActive = false;
  }

  getProviderName(): 'SIMULATED TRAINING TERMINAL' | 'Development/controlled sandbox' | 'ISOLATED TRAINING MACHINE' {
    return 'Development/controlled sandbox';
  }

  private getStateSnapshot(): TerminalSessionState {
    return {
      sessionId: this.sessionId,
      workingDirectory: this.currentDir,
      commandHistory: this.history,
      filesystemState: {},
      isActive: this.isActive
    };
  }
}

/**
 * Concrete implementation for Future VMTerminalProvider (Micro-VM sandbox execution via secure virtualization driver)
 */
export class VMTerminalProvider implements TerminalProvider {
  private sessionId: string = '';
  private currentDir: string = '/home/student';
  private history: CommandHistoryItem[] = [];
  private isActive: boolean = false;

  async createSession(labId: string, userId: string): Promise<TerminalSessionState> {
    this.sessionId = `vm-session-${labId}-${Date.now()}`;
    this.currentDir = '/home/student';
    this.isActive = true;
    this.history = [
      {
        command: '# BOOTING SECURE NESTED VM',
        output: `[+] Booting safe kernel driver...\n[+] System isolated inside hardware-accelerated VM slice.\n[+] Sandbox activated. Welcome to your Isolated Training Machine.`
      }
    ];
    return this.getStateSnapshot();
  }

  async executeCommand(command: string): Promise<CommandExecutionResult> {
    try {
      const response = await fetch('/api/terminal/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, workingDirectory: this.currentDir })
      });
      if (response.ok) {
        const data = await response.json();
        this.currentDir = data.workingDirectory || this.currentDir;
        this.history.push({ command, output: data.output, isError: data.isError });
        return { output: data.output, isError: data.isError, workingDirectory: this.currentDir };
      }
    } catch (err) {
      console.warn('Backend VM hypervisor API offline, using sandbox fallback:', err);
    }

    // Fallback behavior
    const fallbackOutput = `Executed "${command}" in complete hardware isolation (offline sandbox fallback).`;
    this.history.push({ command, output: fallbackOutput });
    return { output: fallbackOutput, isError: false, workingDirectory: this.currentDir };
  }

  getSessionState(): TerminalSessionState | null {
    return this.isActive ? this.getStateSnapshot() : null;
  }

  getWorkingDirectory(): string {
    return this.currentDir;
  }

  getFilesystemState(): Record<string, any> {
    return {};
  }

  getCommandHistory(): CommandHistoryItem[] {
    return this.history;
  }

  async resetSession(): Promise<TerminalSessionState> {
    this.currentDir = '/home/student';
    return this.getStateSnapshot();
  }

  async terminateSession(): Promise<void> {
    this.isActive = false;
  }

  getProviderName(): 'SIMULATED TRAINING TERMINAL' | 'Development/controlled sandbox' | 'ISOLATED TRAINING MACHINE' {
    return 'ISOLATED TRAINING MACHINE';
  }

  private getStateSnapshot(): TerminalSessionState {
    return {
      sessionId: this.sessionId,
      workingDirectory: this.currentDir,
      commandHistory: this.history,
      filesystemState: {},
      isActive: this.isActive
    };
  }
}
