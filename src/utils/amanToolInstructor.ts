import { CareerRoleId } from '../types';

export interface ToolExplanation {
  spokenText: string;
  markdownText: string;
}

export interface ToolGuide {
  title: string;
  purpose: string;
  syntax: string;
  examples: { cmd: string; desc: string }[];
  options: { opt: string; desc: string }[];
  expectedOutput: string;
  relevance: string;
}

/**
 * Checks whether a security/system tool is supported in the current lab context.
 */
export function isToolSupportedInLab(
  tool: string,
  currentModule: any,
  activeTask: any
): boolean {
  const t = tool.toLowerCase().trim();
  
  // Base general utility tools are always supported
  const generalTools = ['pwd', 'ls', 'cd', 'cat', 'whoami', 'id', 'grep', 'find', 'chmod'];
  if (generalTools.includes(t)) {
    return true;
  }

  // Network and specialty scanning/diagnostics tools
  const specialtyTools = ['nmap', 'ip', 'ss', 'ping', 'curl', 'dig', 'nslookup', 'netstat'];
  if (specialtyTools.includes(t)) {
    if (!currentModule) return true;

    const category = (currentModule.category || '').toLowerCase();
    const title = (currentModule.title || '').toLowerCase();
    
    // Check if the current module represents a network, offensive, pentesting, web, range, or SOC topic
    const hasNetworkFocus = 
      category.includes('net') || 
      category.includes('recon') || 
      category.includes('pentest') || 
      category.includes('web') || 
      category.includes('soc') || 
      category.includes('investigation') || 
      category.includes('range') ||
      title.includes('net') ||
      title.includes('recon') ||
      title.includes('port') ||
      title.includes('scan') ||
      title.includes('dns') ||
      title.includes('http') ||
      title.includes('routing') ||
      title.includes('firewall');

    if (hasNetworkFocus) {
      return true;
    }

    // Check if the current task mentions the tool
    if (activeTask) {
      const taskTitle = (activeTask.title || '').toLowerCase();
      const taskDesc = (activeTask.description || '').toLowerCase();
      const taskInst = (activeTask.instructions || '').toLowerCase();
      const taskCmd = (activeTask.educationalCommandSuggestion || '').toLowerCase();
      
      if (
        taskTitle.includes(t) || 
        taskDesc.includes(t) || 
        taskInst.includes(t) || 
        taskCmd.includes(t)
      ) {
        return true;
      }
    }
    
    // Specific custom checks per module id
    if (currentModule.id === 'mod-networking' || currentModule.id === 'mod-recon' || currentModule.id === 'mod-soc' || currentModule.id === 'mod-pentesting') {
      return true;
    }

    return false;
  }

  return false;
}

/**
 * Provides contextual explanation when a command is run inside the lab workbench.
 */
export function explainToolExecution(
  command: string,
  isExpert: boolean,
  isSupported: boolean,
  currentModule: any,
  activeTask: any,
  isHinglish: boolean = false
): ToolExplanation {
  const parts = command.trim().split(' ');
  const tool = parts[0].toLowerCase();
  
  if (!isSupported) {
    const spoken = isHinglish 
      ? `Nmap ya networking utilities is fundamentals lab environment mein enabled nahi hain. Aap help command run karke available tools dekh sakte hain.`
      : `${tool} is not enabled in this fundamental lab environment. Please run "help" to see the active diagnostics utilities for this module.`;
    
    const markdown = `### ⚠️ Utility Restricted
The command \`${tool}\` is not supported in this restricted baseline lab profile. 

**AMAN Instructor Note:**
${isHinglish 
  ? `Hume is lab mein specific os aur files fundamentals par focus karna hai. Network scanning utilities active nahi hain. Symmetrical utilities ke liye \`help\` type karein.` 
  : `To ensure focus on kernel and file attributes, advanced network probes are locked for this module. Please use standard utilities. Type \`help\` for a list of available tools.`}`;

    return { spokenText: spoken, markdownText: markdown };
  }

  // Generate customized explanation based on tool
  switch (tool) {
    case 'nmap': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "Nmap ek powerful network scanning tool hai, jo open ports ko discover karta hai. Yeh simple knock-on-door concept par kaam karta hai. Is open port audit se target ki vulnerable services identify hongi."
          : "Nmap is a network scanner used to find open ports and discover services. It works like knocking on doors in a hotel to see which rooms are open. This audit helps us identify active interfaces.";
        
        const markdown = `### 🛠️ Tool Intercepted: \`nmap\` (Network Mapper)
* **Simple Meaning:** Ek tool jo network par hosts aur unke active ports ko search karta hai.
* **Analogy:** Knocking on doors to check which rooms are occupied and unlocked.
* **Technical Purpose:** Active host mapping, TCP/UDP port states detection, and banner grabbing.
* **Current Action:** Running a port discovery. SSH on port 22 and HTTP on port 80 are listening on the target.
* **What to do next:** Observe the open port numbers and investigate whether any unauthorized ports are exposed.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "Nmap port scanner executed. Utilizing TCP SYN half-open connection scans to determine port states, protocol handshakes, and application layer service version detection metrics.";
        const markdown = `### ⚡ Tool Intercepted: \`nmap\` (Advanced Portfolio Mode)
* **Scan Behavior:** Sends raw SYN packets. A SYN-ACK response indicates an \`open\` state, while a RST indicates \`closed\`.
* **Protocol Implications:** Bypasses standard complete 3-way handshakes to speed up scanning and avoid certain application-level log records.
* **Detection Considerations:** SYN bursts are easily flagged by network intrusion detection systems (IDS) such as Snort or Suricata.
* **Limitations:** Firewalls frequently employ drop rules that drop ICMP or SYN requests, resulting in a false \`filtered\` state.
* **Next Tactical Step:** Run version detection (\`-sV\`) to identify specific software builds and cross-reference them with standard vulnerability databases.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'ip': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "IP command local network interfaces aur configurations ko view karta hai. Yeh aapke local digital address ya identity card ki tarah hai."
          : "The IP command is used to display and configure network interfaces. It shows your computer's local digital address.";
        const markdown = `### 🛠️ Tool Intercepted: \`ip\` (Routing/Interface Tool)
* **Simple Meaning:** Interface configurations check karne ka primary command.
* **Analogy:** Checking your home postal address and mailbox status.
* **Technical Purpose:** Displays link state (Layer 2), IP address bounds (Layer 3), and active local gateway routes.
* **What to do next:** Type \`ip addr\` or \`ip route\` to inspect the interface names, subnet bounds, and default local gateways.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "IP routing utility. Inspecting the routing table and link encapsulation structures to map default gateways and local address resolution constraints.";
        const markdown = `### ⚡ Tool Intercepted: \`ip\` (Advanced Mode)
* **Scope:** Interacts with the Netlink kernel interface to query routing tables, neighbor lists (ARP table), and policy routes.
* **Protocol Implications:** Essential for determining if traffic exits via the expected default interface (e.g., eth0) or is redirected via static host configurations.
* **Next Tactical Step:** Run \`ip route\` to identify the default gateway metric bounds, and cross-reference with active DNS resolver endpoints.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'ss':
    case 'netstat': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "SS command active sockets aur listening connections ko inspect karta hai. Yeh batata hai ki target computer par kaunsi network applications currently open hain."
          : "The SS command inspects active sockets and listening connections. It displays which applications are currently waiting for connection requests.";
        const markdown = `### 🛠️ Tool Intercepted: \`ss\` / \`netstat\` (Socket Statistics)
* **Simple Meaning:** Server par running port bindings aur active connections ki list dikhata hai.
* **Analogy:** Checking which phone lines in an office are busy or waiting for a call.
* **Technical Purpose:** Queries socket buffers to list TCP/UDP port states, process identifiers (PIDs), and active remote connections.
* **What to do next:** Execute \`ss -tuln\` to check for active listening TCP/UDP ports without resolving hostnames.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "SS command initiated. Directly queries kernel namespace socket descriptors to analyze active transport layer states, listening sockets, and process descriptors.";
        const markdown = `### ⚡ Tool Intercepted: \`ss\` (Advanced Mode)
* **Scan Behavior:** Reads socket statistics directly from kernel TCP diag modules. Faster and more reliable than older legacy \`netstat\` which parsed \`/proc/net/tcp\`.
* **Security Implications:** Vital for detecting stealthy reverse shells, established unauthorized listeners, or data exfiltration sockets.
* **Next Tactical Step:** Match ports to PIDs (\`ss -tulnp\`) to locate the exact binary executing behind the listening socket.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'ping': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "Ping command remote target ke saath connectivity test karta hai, aur responses measure karta hai. Yeh ek simple 'hello, kya aap online hain?' request hai."
          : "Ping measures round-trip time and checks connectivity to a remote host. It is like asking a question and waiting for a verbal reply.";
        const markdown = `### 🛠️ Tool Intercepted: \`ping\` (Packet Internet Groper)
* **Simple Meaning:** Remote host active aur responsive hai ya nahi, yeh confirm karne ka tools.
* **Analogy:** Calling out a friend's name in a quiet room and waiting to hear a response.
* **Technical Purpose:** Sends ICMP Echo Request packets and listens for ICMP Echo Reply packets.
* **What to do next:** Ping the target gateway address to verify routing connectivity before executing scans.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "ICMP diagnostic ping initiated. Testing transport routing path and measuring latency intervals to analyze network jitter and potential packet dropping thresholds.";
        const markdown = `### ⚡ Tool Intercepted: \`ping\` (Advanced Mode)
* **Scope:** Measures round-trip time (RTT) and packet loss parameters.
* **Protocol Implications:** Operates directly over Layer 3 raw sockets using ICMP protocol Type 8 (Request) and Type 0 (Reply).
* **Detection & Defense:** Security-hardened perimeter firewalls often block outbound or inbound ICMP packets to prevent passive host discovery.
* **Next Tactical Step:** Check the Time-To-Live (TTL) field. A TTL around 64 suggests a Linux kernel, while 128 indicates a Windows-based host.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'curl': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "Curl command target server se direct standard web raw headers aur contents download karta hai. Yeh standard browser window ka terminal version hai."
          : "Curl is a command-line tool used to transfer data from web servers. It is the terminal version of typing a website URL into a browser.";
        const markdown = `### 🛠️ Tool Intercepted: \`curl\` (Client URL Library)
* **Simple Meaning:** Terminal se websites ya API endpoints inspect karne ka modern utility.
* **Analogy:** Reading a restaurant's physical menu on the front board rather than walking inside.
* **Technical Purpose:** Sends customizable HTTP request methods and prints the raw HTML/JSON response body.
* **What to do next:** Run \`curl -I http://10.10.10.5\` to view response status codes, web server banners, and security cookies.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "Curl command executed. Sending HTTP request headers to parse application-layer metadata, server frameworks, and protective response cookies.";
        const markdown = `### ⚡ Tool Intercepted: \`curl\` (Advanced Mode)
* **Scope:** Multiprotocol data transfer client (supports HTTP, HTTPS, FTP, SMB).
* **Protocol Implications:** Useful for verifying web server configurations, API responses, CORS configurations, and TLS cipher options.
* **Security Audits:** Run with \`-vvv\` for full TCP handshake and SSL negotiation headers, exposing insecure cipher configurations.
* **Next Tactical Step:** Check the \`Server\` header to find outdated server version footprints (e.g. Apache/2.4) containing exploitable CVEs.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'dig':
    case 'nslookup': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "Dig command domain name system records ko query karta hai, aur exact DNS addresses analyze karta hai. Yeh phonebook entry look up karne jaisa hai."
          : "Dig queries domain name system servers for specific records. It is like looking up a phonebook registry entry.";
        const markdown = `### 🛠️ Tool Intercepted: \`dig\` / \`nslookup\` (DNS Diagnostics)
* **Simple Meaning:** Kisi website ya server ka IP address DNS database se fetch karne ka tools.
* **Analogy:** Looking up an official business name to find their exact physical street address.
* **Technical Purpose:** Direct DNS server querying for A, MX, NS, TXT, and CNAME records.
* **What to do next:** Check the ANSWER SECTION in the output to locate the target IPv4 addresses.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "DNS lookup initiated. Querying root nameservers or designated local resolvers to inspect canonical name pointers, TTL zones, and resource records.";
        const markdown = `### ⚡ Tool Intercepted: \`dig\` (Advanced Mode)
* **Scope:** Sends UDP (or TCP for large transfers) queries on port 53.
* **Protocol Implications:** Allows checking DNSSEC validation status, zone delegation authority (NS), and potential DNS poisoning anomalies.
* **Tactical Penetration:** Use zone transfer query formats (\`dig axfr @dns-server\`) to see if administrative misconfigurations expose internal host maps.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'grep': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "Grep command massive text files ya log entries mein specific keywords search karne ke liye use hota hai. Yeh virtual control-plus-f feature hai."
          : "Grep searches massive text files or logs for specific keywords. It is the command line equivalent of typing control-plus-f.";
        const markdown = `### 🛠️ Tool Intercepted: \`grep\` (Global Regular Expression Print)
* **Simple Meaning:** Kisi text stream ya log file ke andarse matching patterns find karna.
* **Analogy:** Scanning a massive book of telephone records with a highlighter to mark specific names.
* **Technical Purpose:** Processes lines of files and stdout streams to output matching regex strings.
* **What to do next:** Run \`grep -i "failed" /var/log/auth.log\` to discover unauthorized access alerts.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "Grep text parser executed. Utilizing regular expressions and stdout piping to extract specific network telemetry markers and forensic anomalies.";
        const markdown = `### ⚡ Tool Intercepted: \`grep\` (Advanced Mode)
* **Optimization:** Leverages Boyer-Moore string search algorithms for highly optimized processing of large text documents and binary indicators.
* **Forensic Utility:** Use regex patterns with \`grep -E\` or recursive sweeps (\`grep -r\`) to sweep code repositories or configuration directories for active secrets/keys.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'find': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "Find command complete filesystem tree ko filter karke files aur folder patterns search karta hai. Yeh window explorer search bar ki tarah hai."
          : "Find command searches the filesystem tree for files and folder patterns. It acts like the windows explorer search bar.";
        const markdown = `### 🛠️ Tool Intercepted: \`find\` (File Finder)
* **Simple Meaning:** Pure computer storage directory tree mein files search karna.
* **Analogy:** Looking through a massive filing cabinet using an index cards index.
* **Technical Purpose:** Recurse folders to match files by name, type, size, modification bounds, and owner permissions.
* **What to do next:** Run \`find . -name "*.txt"\` to locate all text documents in the current scope.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "Find command sweeps directories. Auditing file permission bits, setuid indicators, and user-writeable folders to map escalation vectors.";
        const markdown = `### ⚡ Tool Intercepted: \`find\` (Advanced Mode)
* **Privilege Escalation:** Vital for locating files with standard misconfigurations, such as globally writeable configuration files or active SUID bits (\`find / -perm -4000 -type f 2>/dev/null\`).
* **Tactical Sweep:** Combine with \`-exec\` execution bounds to parse files on-the-fly.`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'chmod': {
      if (!isExpert) {
        const spoken = isHinglish
          ? "Chmod command local file permissions aur access constraints ko modify karta hai. Yeh files par locking and unlocking patterns apply karne jaisa hai."
          : "Chmod modifies file permissions and access constraints. It is like locking or unlocking specific digital desk drawers.";
        const markdown = `### 🛠️ Tool Intercepted: \`chmod\` (Change Mode)
* **Simple Meaning:** File read, write, aur execute permissions set karna.
* **Analogy:** Setting password access levels for files or physical lockers.
* **Technical Purpose:** Modifies Linux DAC (Discretionary Access Control) octal permission bits (User, Group, Others).
* **What to do next:** Execute \`chmod +x script.sh\` to make an automated script executable.`;
        return { spokenText: spoken, markdownText: markdown };
      } else {
        const spoken = "Chmod command altering discretionary access control bits. Recalibrating read, write, and executable flags to secure system boundaries.";
        const markdown = `### ⚡ Tool Intercepted: \`chmod\` (Advanced Mode)
* **Core DAC Structure:** Linux maps permissions in octals. \`755\` translates to \`rwxr-xr-x\` (Full owner, read/execute for group/others).
* **Hardening Practice:** Ensure production database credentials are restricted to strictly read-only by the service user (\`chmod 400 .env\`).`;
        return { spokenText: spoken, markdownText: markdown };
      }
    }

    case 'pwd': {
      const spoken = isHinglish
        ? "pwd command ka matlab print working directory hai. Yeh system directory tree mein aapki current position dikhata hai. Yeh batata hai ki aap active execution folder mein kahan hain."
        : "The pwd command stands for print working directory. It shows your exact active location inside the filesystem directory tree.";
      const markdown = `### 🛠️ Tool Intercepted: \`pwd\` (Print Working Directory)
* **Simple Meaning:** Pata karna ki aap currently kis folder/directory ke andarse commands execute kar rahe hain.
* **Analogy:** Checking the GPS coordinates or floor number on an elevator to see where you are inside a skyscraper.
* **Technical Purpose:** Prints the absolute filepath of the current working directory from the root \`/\`.
* **Current Action:** Inspecting directory structure. The terminal is running in the sandbox environment.
* **What to do next:** Run \`ls\` to list the contents of this current working directory and find targets.`;
      return { spokenText: spoken, markdownText: markdown };
    }

    case 'ls': {
      const spoken = isHinglish
        ? "ls command directory contents ko list karta hai. Yeh aapke folder mein available files aur subdirectories ko view karne ka primary tools hai."
        : "The ls command is used to list file directory contents. It displays the active files and subdirectories in your current folder.";
      const markdown = `### 🛠️ Tool Intercepted: \`ls\` (List Directory Contents)
* **Simple Meaning:** Current folder ke andar kaun-kaun si files aur folders hain, unki list dekhna.
* **Analogy:** Opening a physical folder or desk drawer to see what papers and files are kept inside.
* **Technical Purpose:** Queries the directory inode records to output lists of filenames, file sizes, and owner attributes.
* **What to do next:** Type \`ls -la\` or \`ls -l\` to see hidden configurations, file sizes, and permission octals.`;
      return { spokenText: spoken, markdownText: markdown };
    }

    case 'whoami':
    case 'id': {
      const spoken = isHinglish
        ? "Whoami aur id commands system par aapki active identity aur security privileges check karte hain. Yeh digital employee ID inspect karne jaisa hai."
        : "Whoami and ID verify your active system identity and group privileges. It is like checking your official digital ID card.";
      const markdown = `### 🛠️ Tool Intercepted: \`whoami\` / \`id\` (Identity Check)
* **Simple Meaning:** Verify karna ki is terminal shell session ko kaun chala raha hai.
* **Analogy:** Checking your name tag in an office to see which doors your keycard opens.
* **Technical Purpose:** Queries real/effective user IDs (UID) and group IDs (GID).
* **What to do next:** Always run \`id\` upon gaining shell access to inspect whether you belong to the privileged \`sudo\` or \`root\` groups.`;
      return { spokenText: spoken, markdownText: markdown };
    }

    default: {
      const spoken = `Command ${tool} executed successfully. Inspect the output feedback to progress.`;
      const markdown = `### 🔍 Interactive Command Executed
You executed \`${command}\` inside the training sandbox.

* **Result:** Output returned from terminal provider.
* **Tip:** Review standard error streams if output is blank, or type \`help\` for alternative tools.`;
      return { spokenText: spoken, markdownText: markdown };
    }
  }
}

/**
 * Returns a complete Contextual Tool Guide when student types "tool ?" or "How do I use tool?".
 */
export function getContextualToolGuide(tool: string, currentModule: any): ToolGuide {
  const t = tool.toLowerCase().trim();
  const targetIp = currentModule?.sandboxEnvironment?.targetIp || '10.10.10.5';
  
  switch (t) {
    case 'nmap':
      return {
        title: 'NMAP — Network Scanner Reference Guide',
        purpose: 'Discover active network hosts, audit listening port numbers, detect active operating systems, and capture application service banners.',
        syntax: 'nmap [Options] [Target IP / Range]',
        examples: [
          { cmd: `nmap ${targetIp}`, desc: 'Baseline TCP connect port scan on target.' },
          { cmd: `nmap -sV ${targetIp}`, desc: 'Active banner service version detection scan.' },
          { cmd: `nmap -p 22,80,443 ${targetIp}`, desc: 'Restricted scan targeting only web and secure shells.' }
        ],
        options: [
          { opt: '-sS', desc: 'TCP SYN Stealth half-open scan (requires administrator/root).' },
          { opt: '-sV', desc: 'Probe open port listeners to grab banners and service versions.' },
          { opt: '-Pn', desc: 'Disable ICMP ping sweep host discovery (assume host is up).' },
          { opt: '-v', desc: 'Increase stdout detail logs during execution.' }
        ],
        expectedOutput: `PORT   STATE SERVICE VERSION\n22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu\n80/tcp open  http    Apache/2.4.52 (Ubuntu)`,
        relevance: 'Essential for mapping the attack surface of target containers before attempting exploits or auditing active defense firewalls.'
      };

    case 'ip':
      return {
        title: 'IP — Routing and Interface Control Utility',
        purpose: 'Displays, configures, and controls network adapters, routing parameters, and link states.',
        syntax: 'ip [options] [object] [command]',
        examples: [
          { cmd: 'ip addr show', desc: 'Lists all available interface cards and assigned IP coordinates.' },
          { cmd: 'ip route show', desc: 'Displays active routing table gateway definitions.' },
          { cmd: 'ip neigh', desc: 'Displays resolved local ARP address resolution tables.' }
        ],
        options: [
          { opt: 'addr', desc: 'Address object: manage IP coordinates on active links.' },
          { opt: 'route', desc: 'Routing object: inspect default local network exits.' },
          { opt: 'link', desc: 'Link object: configure adapter online/offline states.' }
        ],
        expectedOutput: `2: eth0: <BROADCAST,UP,LOWER_UP> mtu 1500\n    inet 10.10.10.100/24 scope global eth0`,
        relevance: 'Crucial to determine the local student gateway and subnet masks, helping identify which CIDR ranges are reachable.'
      };

    case 'ss':
      return {
        title: 'SS — Socket Statistics Utility',
        purpose: 'Dump socket statistics. Essential for displaying active listening TCP/UDP applications and established connections.',
        syntax: 'ss [options]',
        examples: [
          { cmd: 'ss -tuln', desc: 'Display all listening TCP and UDP sockets without resolving names.' },
          { cmd: 'ss -atp', desc: 'Display all active sockets and map them to their execution process ID (PID).' }
        ],
        options: [
          { opt: '-t', desc: 'Display TCP sockets only.' },
          { opt: '-u', desc: 'Display UDP sockets only.' },
          { opt: '-l', desc: 'Display listening sockets waiting for incoming requests.' },
          { opt: '-n', desc: 'Suppress service name lookup (display numeric ports only).' }
        ],
        expectedOutput: `Netid State  Local Address:Port\ntcp   LISTEN 0.0.0.0:22\ntcp   LISTEN 0.0.0.0:80`,
        relevance: 'Allows monitoring local server bindings. Used to confirm if defensive firewalls have successfully blocked listening backdoors.'
      };

    case 'ping':
      return {
        title: 'PING — Connectivity Echo Sweep',
        purpose: 'Sends ICMP Echo requests to verify if a remote host is alive and responding, and measures network latency.',
        syntax: 'ping [options] [destination]',
        examples: [
          { cmd: `ping -c 3 ${targetIp}`, desc: 'Sends exactly 3 ICMP checks and outputs response metrics.' },
          { cmd: `ping -i 2 ${targetIp}`, desc: 'Pings the target host every 2 seconds.' }
        ],
        options: [
          { opt: '-c <count>', desc: 'Stop sending packets after count replies.' },
          { opt: '-i <interval>', desc: 'Wait interval seconds between packet bursts.' },
          { opt: '-t <ttl>', desc: 'Set customizable IP Time-To-Live parameters.' }
        ],
        expectedOutput: `64 bytes from ${targetIp}: icmp_seq=1 ttl=64 time=0.34 ms`,
        relevance: 'Primary baseline diagnostic tool to confirm active host paths before attempting network intrusion steps.'
      };

    case 'curl':
      return {
        title: 'CURL — Client URL Request Transceiver',
        purpose: 'Command line application to transfer data from or to a server, supporting HTTP headers and request injections.',
        syntax: 'curl [options] [URL]',
        examples: [
          { cmd: `curl http://${targetIp}`, desc: 'Fetches and prints website raw HTML index contents.' },
          { cmd: `curl -I http://${targetIp}`, desc: 'Requests only the headers to check status and server version.' }
        ],
        options: [
          { opt: '-I', desc: 'Retrieve HTTP response headers only.' },
          { opt: '-s', desc: 'Silent mode. Hides progress meters.' },
          { opt: '-X <method>', desc: 'Specify custom HTTP request verb (POST, PUT, DELETE, etc.).' },
          { opt: '-H <header>', desc: 'Inject custom HTTP request header values.' }
        ],
        expectedOutput: `HTTP/1.1 200 OK\nServer: nginx/1.18.0 (Ubuntu)\nDate: Sun, 23 Aug 2026 GMT`,
        relevance: 'Indispensable tool for auditing web vulnerabilities, inspecting HTTP security attributes, and interacting with hidden REST APIs.'
      };

    default:
      return {
        title: `${tool.toUpperCase()} — Tool Reference Guide`,
        purpose: `Standard Linux terminal diagnostic and training utility command.`,
        syntax: `${t} [options] [arguments]`,
        examples: [
          { cmd: `${t} --help`, desc: 'Fetch standard manual reference logs.' }
        ],
        options: [],
        expectedOutput: `Success output returned from simulated baseline shell.`,
        relevance: 'Standard tool utilized inside authorized simulated Cyber Ranges and Sandbox Environments.'
      };
  }
}
