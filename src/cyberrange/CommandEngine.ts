import { LabEnvironment, LabHostNode, LabTaskObjective } from './LabEnvironment';

export interface CommandResult {
  updatedEnvironment: LabEnvironment;
  output: string;
}

export const CommandEngine = {
  executeCommand(env: LabEnvironment, command: string): CommandResult {
    const updated = JSON.parse(JSON.stringify(env)) as LabEnvironment;
    const trimmed = command.trim();
    const parts = trimmed.split(/\s+/);
    const baseCmd = parts[0]?.toLowerCase();
    
    updated.timestamps.lastUpdated = new Date().toISOString();
    
    // Add action to learnerActions list
    updated.learnerActions.push({
      timestamp: new Date().toLocaleTimeString(),
      command: trimmed,
      output: '', // filled below
      path: this.getCommandPathCategory(baseCmd),
      noiseLevel: this.getCommandNoiseLevel(baseCmd)
    });

    let output = '';
    let isSuccess = true;
    let failureReason = '';
    let suggestion = '';

    // WAF Filter Check
    const isWafApplied = updated.defensiveControls['ctrl-1']?.applied;
    const hasSqliPattern = trimmed.toLowerCase().includes('union') || trimmed.toLowerCase().includes('select') || trimmed.toLowerCase().includes("'");
    if (isWafApplied && hasSqliPattern) {
      output = `HTTP/1.1 403 Forbidden\nContent-Type: text/html\nServer: Edge-WAF\n\nERROR: Request Blocked by Web Application Firewall Signature ID #88192 (SQLi Shield).`;
      
      // SIEM Alert Trigger
      this.triggerSiemAlert(updated, 'HIGH', 'WAF SQLi Block', 'Edge-WAF proxy', 'A blocked request containing SQL command injection parameters was intercepted.');
      this.updateScore(updated, 'execution', -5);
      return { updatedEnvironment: updated, output };
    }

    // Determine target nodes for network scanning and general operations
    const activeSubnet = updated.networkTopology.subnet.split('/')[0].replace('.0', '');
    const firstHost = updated.hosts[0];
    const secondHost = updated.hosts[1];
    const thirdHost = updated.hosts[2];
    const fourthHost = updated.hosts[3];

    switch (baseCmd) {
      case 'clear':
        output = 'clear';
        break;

      case 'help':
        output = `Available CLI Commands for this cyber range:\n\n` +
                 `  Reconnaissance: nmap, ping, dig, nslookup\n` +
                 `  Web Security:   curl, gobuster, nikto, sqlmap\n` +
                 `  Active Dir:     ldapsearch, smbclient, enum4linux\n` +
                 `  Linux Commands: whoami, id, uname, ip, ss, netstat, ps, ls, cat, find, grep, chmod\n` +
                 `  Cyber Lab Utility: retest, evidence lock\n\n` +
                 `Type commands as you would in a Kali terminal.`;
        break;

      case 'whoami':
        const isRoot = updated.currentStage >= 5; // Privilege escalated
        output = isRoot ? 'root' : 'student';
        break;

      case 'id':
        const escalated = updated.currentStage >= 5;
        output = escalated 
          ? 'uid=0(root) gid=0(root) groups=0(root)' 
          : 'uid=1001(student) gid=1001(student) groups=1001(student)';
        break;

      case 'uname':
        output = `Linux ${firstHost?.label || 'kali'} 5.15.0-88-generic #98-Ubuntu SMP Mon Oct 2 15:18:56 UTC 2023 x86_64 GNU/Linux`;
        break;

      case 'ip':
      case 'ifconfig':
        output = `eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n` +
                 `        inet ${activeSubnet}.100  netmask 255.255.255.0  broadcast ${activeSubnet}.255\n` +
                 `        inet6 fe80::215:5dff:fe00:ab12  prefixlen 64  scopeid 0x20<link>\n` +
                 `        ether 00:15:5d:00:ab:12  txqueuelen 1000  (Ethernet)\n` +
                 `        RX packets 2049  bytes 189210 (189.2 KB)\n` +
                 `        TX packets 1024  bytes 99402 (99.4 KB)`;
        break;

      case 'ss':
      case 'netstat':
        output = `State      Recv-Q Send-Q Local Address:Port               Peer Address:Port\n` +
                 `LISTEN     0      128    127.0.0.1:8080                   0.0.0.0:*\n` +
                 `LISTEN     0      128    0.0.0.0:22                       0.0.0.0:*\n` +
                 `LISTEN     0      50     0.0.0.0:5432                     0.0.0.0:*`;
        break;

      case 'ps':
        output = `PID TTY          TIME CMD\n` +
                 `  1 ?        00:00:02 systemd\n` +
                 `102 pts/0    00:00:00 bash\n` +
                 `105 pts/0    00:00:01 node /var/www/html/server.js\n` +
                 `112 ?        00:00:10 postgresql-server`;
        break;

      case 'nmap':
        const targetIp = parts[1] || parts[2] || '';
        if (!targetIp) {
          isSuccess = false;
          failureReason = 'No target IP or subnet specified.';
          suggestion = 'Execute "nmap 10.10.X.X" or "nmap -F 10.10.X.X"';
          break;
        }

        // Trigger SIEM alert for port scan
        this.triggerSiemAlert(updated, 'MEDIUM', 'Port Scan Detected', 'Network IDS', `SYN scanning signature identified from ${activeSubnet}.100 targeting ${targetIp}`);
        
        // Discover targets statefully
        if (targetIp.includes('/24') || targetIp === activeSubnet || targetIp.includes('.*')) {
          // Subnet scan
          updated.hosts.forEach(h => {
            if (h.status === 'UNKNOWN') h.status = 'DISCOVERED';
            if (!updated.discoveredAssets.includes(h.id)) updated.discoveredAssets.push(h.id);
          });
          output = `Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toLocaleString()}\n` +
                   `Nmap scan report for ${firstHost.label} (${firstHost.ip})\n` +
                   `Host is up (0.001s latency).\n` +
                   `PORT     STATE SERVICE\n` +
                   `22/tcp   open  ssh\n` +
                   `80/tcp   open  http\n` +
                   `443/tcp  open  https\n\n` +
                   `Nmap scan report for Database Segment (${secondHost.ip})\n` +
                   `Host is up (0.002s latency).\n` +
                   `PORT     STATE SERVICE\n` +
                   `5432/tcp open  postgresql\n\n` +
                   `Nmap done: 256 IP addresses scanned, ${updated.hosts.length} hosts active.`;
          updated.currentStage = Math.max(updated.currentStage, 2); // Footprinting complete
          this.completeObjective(updated, 'nmap');
        } else {
          // Specific host scan
          const matchedHost = updated.hosts.find(h => h.ip === targetIp || targetIp.includes(h.label));
          if (matchedHost) {
            matchedHost.status = 'ENUMERATED';
            if (!updated.discoveredAssets.includes(matchedHost.id)) updated.discoveredAssets.push(matchedHost.id);
            
            if (matchedHost.id === 'web') {
              output = `Nmap scan report for ${matchedHost.label} (${matchedHost.ip})\n` +
                       `Host is up (0.001s latency).\n` +
                       `PORT     STATE SERVICE   VERSION\n` +
                       `22/tcp   open  ssh       OpenSSH 8.9p1 (Ubuntu)\n` +
                       `80/tcp   open  http      Nginx 1.22.0\n` +
                       `443/tcp  open  https     Nginx 1.22.0\n` +
                       `8080/tcp open  http-proxy Node.js (Express)`;
              this.completeObjective(updated, 'nmap');
            } else if (matchedHost.id === 'db') {
              output = `Nmap scan report for Database Node (${matchedHost.ip})\n` +
                       `Host is up (0.002s latency).\n` +
                       `PORT     STATE SERVICE    VERSION\n` +
                       `5432/tcp open  postgresql PostgreSQL 14.5`;
            } else {
              output = `Nmap scan report for ${matchedHost.label} (${matchedHost.ip})\n` +
                       `Host is up (0.003s latency).\n` +
                       `PORT     STATE SERVICE\n` +
                       `135/tcp  open  msrpc\n` +
                       `445/tcp  open  microsoft-ds\n` +
                       `389/tcp  open  ldap`;
            }
          } else {
            output = `Host ${targetIp} seems down or does not exist in the simulated workspace subnet.`;
          }
        }
        break;

      case 'ping':
        const pingIp = parts[1] || '';
        if (!pingIp) {
          isSuccess = false;
          failureReason = 'No host IP specified to ping.';
          suggestion = 'Usage: ping <IP_ADDRESS>';
          break;
        }
        output = `PING ${pingIp} (${pingIp}) 56(84) bytes of data.\n` +
                 `64 bytes from ${pingIp}: icmp_seq=1 ttl=64 time=0.85 ms\n` +
                 `64 bytes from ${pingIp}: icmp_seq=2 ttl=64 time=0.91 ms\n` +
                 `--- ${pingIp} ping statistics ---\n` +
                 `2 packets transmitted, 2 received, 0% packet loss, time 1002ms`;
        break;

      case 'curl':
        const url = parts[1] || '';
        if (!url) {
          isSuccess = false;
          failureReason = 'URL argument missing.';
          suggestion = 'Run: curl http://10.10.X.X/api/v1/customer?id=101';
          break;
        }
        if (url.includes('/customer') || url.includes('id=')) {
          if (secondHost && secondHost.status === 'UNKNOWN') {
            secondHost.status = 'DISCOVERED';
            if (!updated.discoveredAssets.includes(secondHost.id)) updated.discoveredAssets.push(secondHost.id);
          }
          output = `HTTP/1.1 200 OK\n` +
                   `X-Powered-By: Express\n` +
                   `Content-Type: application/json; charset=utf-8\n` +
                   `Content-Length: 142\n` +
                   `ETag: W/"8e-v6U.../4"\n\n` +
                   `{\n` +
                   `  "status": "success",\n` +
                   `  "data": {\n` +
                   `    "id": 101,\n` +
                   `    "name": "Jane Doe",\n` +
                   `    "email": "jdoe@finvault.local",\n` +
                   `    "accountBalance": "$12,450.00",\n` +
                   `    "debugQuery": "SELECT * FROM customers WHERE id = 101"\n` +
                   `  }\n` +
                   `}`;
          updated.currentStage = Math.max(updated.currentStage, 3); // Service Enumerated
          this.completeObjective(updated, 'curl');
        } else {
          output = `HTTP/1.1 200 OK\n` +
                   `Server: nginx/1.22.0 (Ubuntu)\n` +
                   `Content-Length: 612\n\n` +
                   `<!DOCTYPE html>\n` +
                   `<html><head><title>Welcome to FinVault Portal</title></head>\n` +
                   `<body><h1>Administrative Login Interface</h1><p>Running legacy express integration.</p></body></html>`;
        }
        break;

      case 'gobuster':
        const gbUrl = parts.find(p => p.startsWith('http')) || '';
        if (!gbUrl) {
          isSuccess = false;
          failureReason = 'Target web URL parameter (-u) missing.';
          suggestion = 'Run: gobuster dir -u http://10.10.X.X -w wordlist.txt';
          break;
        }
        output = `===============================================================\n` +
                 `Gobuster v3.1.0 by OJ Reeves (@TheColonial)\n` +
                 `===============================================================\n` +
                 `[+] Url:                     ${gbUrl}\n` +
                 `[+] Method:                  GET\n` +
                 `===============================================================\n` +
                 `[+] /index.html           (Status: 200) [Size: 612]\n` +
                 `[+] /api                  (Status: 301) [Size: 185]\n` +
                 `[+] /admin                (Status: 401) [Size: 224]\n` +
                 `[+] /backup.zip           (Status: 200) [Size: 450123]\n` +
                 `[+] /config               (Status: 301) [Size: 142]\n` +
                 `===============================================================\n` +
                 `Finished crawling web server.`;
        break;

      case 'sqlmap':
        const sqlUrl = parts.find(p => p.startsWith('http')) || '';
        if (!sqlUrl) {
          isSuccess = false;
          failureReason = 'Target database injection point URL (-u) missing.';
          suggestion = 'Run: sqlmap -u "http://10.10.X.X/api/v1/customer?id=101" --dump';
          break;
        }

        // Advance database compromised statefully
        if (secondHost) {
          secondHost.status = 'COMPROMISED';
          if (!updated.compromisedAssets.includes(secondHost.id)) updated.compromisedAssets.push(secondHost.id);
        }
        if (thirdHost && thirdHost.status === 'UNKNOWN') {
          thirdHost.status = 'DISCOVERED';
          if (!updated.discoveredAssets.includes(thirdHost.id)) updated.discoveredAssets.push(thirdHost.id);
        }

        output = `[+] GET parameter 'id' is vulnerable. Injected payload found!\n` +
                 `--- \n` +
                 `Parameter: id (GET)\n` +
                 `    Type: boolean-based blind / UNION query injection\n` +
                 `    Title: PostgreSQL UNION query (NULL) - 5 columns\n` +
                 `--- \n` +
                 `[+] Dumping PostgreSQL customers database...\n` +
                 `[+] Retreiving schema hashes and system shadow backup tables:\n\n` +
                 `  username: pg_admin\n` +
                 `  hash: $6$saltsalt$hashedpassword99281\n` +
                 `  flag: ${updated.flags[0]}\n` +
                 `  secret_key: FinVaultMasterKeys0023`;
        
        updated.currentStage = Math.max(updated.currentStage, 4); // Vulnerability exploited
        this.completeObjective(updated, 'sqlmap');
        this.triggerSiemAlert(updated, 'CRITICAL', 'Database Exfiltration', 'Postgres IDS', 'UNION injection query signature observed accessing internal system backup registers.');
        break;

      case 'ls':
        const dir = parts[1] || '';
        if (dir === '/etc') {
          output = `hosts      passwd     shadow     fstab      resolv.conf`;
        } else if (dir.includes('backup')) {
          output = `db_hash_backup.sql`;
        } else {
          output = `flag.txt    mission_plan.txt    exploit_sandbox.py    credential_keys.json`;
        }
        break;

      case 'cat':
        const fileToRead = parts[1] || '';
        if (!fileToRead) {
          isSuccess = false;
          failureReason = 'Missing file parameter.';
          suggestion = 'Run: cat flag.txt or cat /etc/passwd';
          break;
        }
        if (fileToRead.includes('passwd')) {
          output = `root:x:0:0:root:/root:/bin/bash\n` +
                   `student:x:1001:1001:Student:/home/student:/bin/bash\n` +
                   `www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n` +
                   `postgres:x:102:105:Postgres:/var/lib/postgresql:/bin/bash`;
        } else if (fileToRead.includes('flag')) {
          output = updated.flags[0] || 'MCL{SEC_RANGE_FLAG_DEFAULT}';
          this.completeObjective(updated, 'flag');
        } else if (fileToRead.includes('credential') || fileToRead.includes('key')) {
          output = JSON.stringify(updated.simulatedCredentials, null, 2);
        } else {
          output = `### INSTRUCTION DETAILS ###\nVerify that SQL parameters are fully sanitized using parameter binding on express interfaces. Escalation vectors on python SUID binaries can be checked using "find / -perm -4000".`;
        }
        break;

      case 'find':
        if (trimmed.includes('-perm -4000') || trimmed.includes('/ -perm')) {
          output = `/usr/lib/dbus-1.0/dbus-daemon-launch-helper\n` +
                   `/usr/lib/openssh/ssh-keysign\n` +
                   `/usr/bin/passwd\n` +
                   `/usr/bin/chsh\n` +
                   `/usr/bin/gpasswd\n` +
                   `/usr/bin/newgrp\n` +
                   `/usr/bin/chfn\n` +
                   `/usr/bin/python3 (SUID CRITICAL CONFIGURATION)`;
          updated.currentStage = Math.max(updated.currentStage, 5); // Privilege escalation vector discovered
          this.completeObjective(updated, 'find');
        } else {
          output = `./flag.txt\n./mission_plan.txt\n./exploit_sandbox.py`;
        }
        break;

      case 'chmod':
        output = `chmod: shifting file registers... Done.`;
        break;

      case 'ssh':
        const sshTarget = parts[1] || '';
        if (!sshTarget) {
          isSuccess = false;
          failureReason = 'No host destination specified.';
          suggestion = 'ssh admin@10.10.X.X';
          break;
        }
        output = `ssh: connecting to administrative shell at ${sshTarget}...\n` +
                 `Connection established. Current identity is admin under secure container namespace.`;
        break;

      case 'ldapsearch':
        if (fourthHost && fourthHost.status === 'UNKNOWN') {
          fourthHost.status = 'DISCOVERED';
        }
        output = `# extended LDIF\n` +
                 `# LDAPv3 connection open. Binding with public guest permissions...\n` +
                 `dn: DC=finvault,DC=local\n` +
                 `objectClass: domain\n` +
                 `name: finvault\n\n` +
                 `dn: CN=Administrator,CN=Users,DC=finvault,DC=local\n` +
                 `sAMAccountName: Administrator\n` +
                 `memberOf: CN=Domain Admins,CN=Users,DC=finvault,DC=local`;
        break;

      case 'smbclient':
        output = `Domain=[FINVAULT] OS=[Windows Server 2022] Server=[NT LM 0.12]\n` +
                 `\tSharename       Type      Comment\n` +
                 `\t---------       ----      -------\n` +
                 `\tADMIN$          Disk      Remote Admin\n` +
                 `\tC$              Disk      Default share\n` +
                 `\tSYSVOL          Disk      System Volume share\n` +
                 `\tIPC$            IPC       Remote IPC`;
        break;

      case 'enum4linux':
        output = `Starting enum4linux v0.8.9 ( http://www.portcullis-security.com ) at ${new Date().toLocaleDateString()}\n` +
                 ` [+] Target Subnet domain: FINVAULT\n` +
                 ` [+] Server name is: WIN-DC-CORE-01\n` +
                 ` [+] Enumerating Domain Users via SAMR:\n` +
                 `     User: 'Administrator' (RID: 500)\n` +
                 `     User: 'Guest' (RID: 501)\n` +
                 `     User: 'BackupAdmin' (RID: 1005)`;
        break;

      case 'nc':
        const port = parts[2] || '';
        output = `nc: connecting to target port ${port}... Connection successful. Ready for raw terminal session stream.`;
        break;

      case 'retest':
        const allMitigated = Object.values(updated.defensiveControls).every(ctrl => ctrl.applied);
        if (allMitigated) {
          updated.remediationStatus = 'REMEDIATED';
          output = `[RETEST VERIFICATION TRIGGERED]\n\n` +
                   `Testing active security vectors on range IP ${firstHost?.ip || '10.10.20.25'}:\n` +
                   `[+] SQL Injection payload test -> REQUEST BLOCKED (Status: 403 Forbidden)\n` +
                   `[+] SUID Python Escalation test -> PERMISSION DENIED (SUID Bit Removed)\n` +
                   `[+] Retest successful: All target system vulnerabilities are mitigated!\n\n` +
                   `Grade: S+ Complete. Security baseline hardened.`;
          updated.score.totalScore = 100;
          updated.score.grade = 'S+';
          updated.currentStage = 12; // Complete/retested
          updated.isCompleted = true;
          this.completeObjective(updated, 'retest');
        } else {
          output = `[RETEST VERIFICATION TRIGGERED]\n\n` +
                   `Testing active security vectors on range IP ${firstHost?.ip || '10.10.20.25'}:\n` +
                   `[-] SQL Injection payload test -> VULNERABLE (Status: 200 OK — Data Exfiltrated)\n` +
                   `[-] Retest failed: Ingress vulnerabilities are still active. Apply security controls first.`;
        }
        break;

      default:
        isSuccess = false;
        failureReason = `Command "${baseCmd}" not recognized or unauthorized in this simulated target terminal interface.`;
        suggestion = 'Try using "nmap", "curl", "whoami", "find", or type "help" for guidance.';
        break;
    }

    if (!isSuccess) {
      updated.lastFailureInfo = {
        actionName: baseCmd.toUpperCase(),
        why: failureReason,
        whatChanged: 'No system components changed, command execution aborted.',
        whatYouLearned: 'Slight command syntax issues or typing unauthorized commands will fail range validation rules.',
        amanSocraticQuestion: `A true hacker verifies command options. What flag can you check in the help menu to discover valid command parameters?`
      };
      updated.mistakeCount = (updated.mistakeCount || 0) + 1;
      output = `bash: command execution failed: ${failureReason}\n${suggestion}`;
    } else {
      updated.lastFailureInfo = null;
    }

    // Append output to the latest action log
    const lastAction = updated.learnerActions[updated.learnerActions.length - 1];
    if (lastAction) {
      lastAction.output = output.slice(0, 500); // truncate for performance context limit
    }

    // Push events onto timeline
    updated.timeline.push({
      timestamp: new Date().toLocaleTimeString(),
      type: isSuccess ? 'INVESTIGATION_PERFORMED' : 'ALERT_TRIGGERED',
      title: `Command: ${baseCmd}`,
      description: isSuccess ? `Successfully ran: ${trimmed}` : `Command failed: ${failureReason}`,
      team: 'RED'
    });

    return { updatedEnvironment: updated, output };
  },

  getCommandPathCategory(cmd: string): string {
    const categories: Record<string, string> = {
      'nmap': 'SERVICE_ENUMERATION',
      'ping': 'HEADER_FINGERPRINT',
      'dig': 'HEADER_FINGERPRINT',
      'nslookup': 'HEADER_FINGERPRINT',
      'curl': 'HEADER_FINGERPRINT',
      'gobuster': 'DIRECTORY_FUZZING',
      'nikto': 'DIRECTORY_FUZZING',
      'sqlmap': 'EXPLOIT_POC',
      'whoami': 'PRIVILEGE_ESCALATION',
      'id': 'PRIVILEGE_ESCALATION',
      'find': 'PRIVILEGE_ESCALATION',
      'cat': 'OTHER'
    };
    return categories[cmd] || 'OTHER';
  },

  getCommandNoiseLevel(cmd: string): string {
    const noise: Record<string, string> = {
      'nmap': 'MEDIUM',
      'ping': 'LOW',
      'dig': 'LOW',
      'curl': 'LOW',
      'gobuster': 'HIGH',
      'nikto': 'HIGH',
      'sqlmap': 'CRITICAL',
      'whoami': 'LOW',
      'find': 'LOW'
    };
    return noise[cmd] || 'LOW';
  },

  triggerSiemAlert(env: LabEnvironment, severity: string, title: string, source: string, description: string) {
    env.SIEMEvents.unshift({
      timestamp: new Date().toLocaleTimeString(),
      severity,
      title,
      source,
      description,
      read: false
    });
    // Dynamically scale noise meter
    const dNoise = severity === 'CRITICAL' ? 40 : severity === 'HIGH' ? 25 : 10;
    env.noiseMeter = Math.min(100, (env.noiseMeter || 0) + dNoise);
  },

  updateScore(env: LabEnvironment, category: string, delta: number) {
    const s: any = env.score;
    if (s[category] !== undefined) {
      s[category] = Math.max(0, Math.min(20, s[category] + delta));
    }
    // recalculate total
    const total = (s.recon || 10) + (s.investigation || 10) + (s.reasoning || 10) + (s.execution || 10) + (s.evidence || 10);
    s.totalScore = Math.min(100, total);
    s.grade = total >= 90 ? 'S+' : total >= 80 ? 'S' : total >= 70 ? 'A' : total >= 60 ? 'B' : total >= 50 ? 'C' : 'D';
  },

  completeObjective(env: LabEnvironment, cmdKeyword: string) {
    let objectiveCompleted = false;
    env.objectives.forEach((obj: LabTaskObjective) => {
      if (!obj.isCompleted && obj.expectedValue.toLowerCase().includes(cmdKeyword)) {
        obj.isCompleted = true;
        objectiveCompleted = true;
        
        // Append timeline event
        env.timeline.push({
          timestamp: new Date().toLocaleTimeString(),
          type: 'VULN_CONFIRMED',
          title: `Objective Cleared`,
          description: `Trainee verified vulnerability criteria: "${obj.description}"`,
          team: 'RED'
        });
        
        // Increment Score
        this.updateScore(env, 'execution', 4);
      }
    });

    // Check overall completion state
    const allCompleted = env.objectives.every(obj => obj.isCompleted);
    if (allCompleted && !env.isCompleted && env.labType === 'PRACTICE_LAB') {
      env.isCompleted = true;
      env.score.totalScore = 95;
      env.score.grade = 'S';
      env.timeline.push({
        timestamp: new Date().toLocaleTimeString(),
        type: 'REPORT_SUBMITTED',
        title: 'Mission Target Compromised',
        description: 'All system audit requirements satisfied. Cyber briefing completed successfully.',
        team: 'RED'
      });
    }
  }
};
