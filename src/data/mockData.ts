import {
  LevelModule,
  Lesson,
  SkillStatus,
  Mission,
  SkillNode,
  NetworkDevice,
  CTFChallenge,
  Achievement,
  NotebookEntry,
  CyberRangeLab
} from '../types';

import { COMPREHENSIVE_LEVELS_EXTENSION } from './curriculumData';
export { LEARNING_PATHS_DATA } from './learningPaths';
export { SOC_ALERTS_DATA } from './socAlerts';
export { THREAT_HUNTING_CASES } from './threatHunting';
export { BANDIT_LEVELS_DATA } from './banditChallenges';
export { PRESET_SUBNET_QUESTIONS, generateRandomSubnetQuestion } from './subnetQuestions';


export const INITIAL_USER_PROFILE = {
  name: 'Alex Mercer',
  codename: 'OPERATOR_01',
  cyberLevel: 3,
  xp: 1450,
  xpToNextLevel: 2500,
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  labHours: 12.4,
  experience: 'beginner' as const,
  language: 'English' as const,
  dailyTime: '30m' as const,
  learningStyle: 'mixed' as const,
  targetRole: 'soc-analyst' as const,
  onboardingCompleted: true,
  theme: 'dark' as const,
  accentColor: 'cyan' as const,
};

export const SKILL_PROGRESS_DATA = [
  { category: 'LINUX FUNDAMENTALS', percentage: 80, level: 4, totalXp: 980 },
  { category: 'NETWORKING', percentage: 60, level: 3, totalXp: 720 },
  { category: 'RECON & ENUMERATION', percentage: 40, level: 2, totalXp: 450 },
  { category: 'WEB SECURITY', percentage: 30, level: 1, totalXp: 300 },
  { category: 'DEFENSIVE & CTF', percentage: 15, level: 1, totalXp: 180 },
  { category: 'ETHICAL PENTESTING', percentage: 10, level: 1, totalXp: 120 },
];

export const BEGINNER_TOPICS: { id: string; title: string; summary: string; category: string; duration: string }[] = [
  { id: 'b1', title: 'What is a Computer?', summary: 'CPU, RAM, storage, and the digital processing loop explained from scratch.', category: 'Basics', duration: '5 min' },
  { id: 'b2', title: 'What is Hardware & Software?', summary: 'Physical components vs the instructions that bring silicon to life.', category: 'Basics', duration: '6 min' },
  { id: 'b3', title: 'What is an Operating System?', summary: 'The kernel, user space, device drivers, and system calls.', category: 'OS', duration: '8 min' },
  { id: 'b4', title: 'What is Linux & Why Hackers Use It?', summary: 'Open source, total kernel control, scriptability, and modularity.', category: 'Linux', duration: '10 min' },
  { id: 'b5', title: 'What is Kali Linux?', summary: 'The specialized Debian-based penetration testing distribution and its toolset.', category: 'Linux', duration: '8 min' },
  { id: 'b6', title: 'What is a Terminal & Shell?', summary: 'Why command line interface (CLI) is 100x more powerful than a GUI.', category: 'Linux', duration: '7 min' },
  { id: 'b7', title: 'What is a Command?', summary: 'Binaries, arguments, flags, standard input/output (stdin/stdout).', category: 'Linux', duration: '6 min' },
  { id: 'b8', title: 'What is a File & File System?', summary: 'Everything in Unix is a file: directories, permissions, absolute vs relative paths.', category: 'Linux', duration: '9 min' },
  { id: 'b9', title: 'What is a Process?', summary: 'Programs in execution, PIDs, memory allocation, and background daemons.', category: 'OS', duration: '7 min' },
  { id: 'b10', title: 'What is a User & Permissions?', summary: 'root (UID 0), standard users, groups, read/write/execute (rwx) bits.', category: 'Security', duration: '10 min' },
  { id: 'b11', title: 'What is a Computer Network?', summary: 'LAN, WAN, packets, routers, switches, and digital data transport.', category: 'Networking', duration: '8 min' },
  { id: 'b12', title: 'What is an IP Address?', summary: 'IPv4 vs IPv6, public vs private subnets (RFC 1918), and host identity.', category: 'Networking', duration: '8 min' },
  { id: 'b13', title: 'What is a Port & Service?', summary: '65,535 digital doorways, well-known ports (22, 80, 443) and listening daemons.', category: 'Networking', duration: '10 min' },
  { id: 'b14', title: 'What is a Client & Server?', summary: 'The request-response architecture powering the modern web and APIs.', category: 'Networking', duration: '7 min' },
  { id: 'b15', title: 'What is a Software Vulnerability?', summary: 'Flaws, logic bugs, buffer overflows, injection vectors, and CVE scores.', category: 'Security', duration: '12 min' },
  { id: 'b16', title: 'What is Ethical Hacking?', summary: 'White hat vs black hat, scope of work, rules of engagement, and lawful security testing.', category: 'Security', duration: '9 min' },
];

export const LEARNING_PATH_LEVELS: LevelModule[] = [
  {
    level: 0,
    title: 'Computer Fundamentals',
    code: 'LVL-00',
    description: 'Master hardware architecture, operating system kernels, binaries, and digital foundations before writing a single security script.',
    category: 'Foundations',
    status: 'mastered',
    lessonsCount: 4,
    completedLessons: 4,
    xpReward: 300,
    lessons: [
      {
        id: 'l0-1',
        levelId: 0,
        title: 'Hardware, CPU Cycles & Memory Architecture',
        duration: '10 min',
        xpReward: 75,
        summary: 'Understand registers, ALU, RAM addresses, and permanent storage buses.',
        theoryContent: `Computers manipulate binary voltage states (1s and 0s). The Central Processing Unit (CPU) executes billions of machine instructions every second via the Fetch-Decode-Execute cycle.\n\nMemory hierarchy:\n1. CPU Registers: Ultra-fast storage directly inside the processor.\n2. L1/L2/L3 Cache: Microsecond caching layer.\n3. RAM (Random Access Memory): Volatile byte-addressable workspace for active processes.\n4. Secondary Storage (SSD/NVMe): Non-volatile block storage.\n\nIn cybersecurity, understanding memory layouts is essential for buffer overflows, reverse engineering, and digital forensics.`,
        videoRecommendation: {
          title: 'How Computers Work: Binary, Logic Gates, and the CPU Cycle',
          channel: 'CrashCourse / Ben Eater',
          duration: '12:30',
          tags: ['Hardware', 'Architecture', 'Binary']
        },
        interactiveExample: {
          title: 'Memory Address Inspector',
          type: 'binary_inspector',
          description: 'Visualize how a 32-bit register stores a hexadecimal integer value.',
          codeOrData: 'Address: 0x7ffd9b8e21a0 | Value: 0x00000041 (ASCII "A") | Stack Pointer: ESP=0x7ffd9b8e219c'
        },
        quiz: {
          question: 'Which component provides volatile byte-addressable working memory for active programs?',
          options: ['NVMe Solid State Drive', 'RAM (Random Access Memory)', 'Motherboard BIOS ROM', 'GPU VRAM Framebuffer'],
          correctIndex: 1,
          explanation: 'RAM is volatile high-speed memory holding the instructions and variables of actively running processes.'
        },
        practiceTask: 'Inspect your local system specifications: note the CPU architecture (x86_64 or ARM64) and RAM capacity.',
        completed: true
      },
      {
        id: 'l0-2',
        levelId: 0,
        title: 'Operating System Kernels & User Space',
        duration: '12 min',
        xpReward: 75,
        summary: 'Explore ring 0 kernel privileges, system calls (syscalls), and user space sandboxing.',
        theoryContent: `An Operating System (OS) is the bridge between software and physical hardware. Modern operating systems divide execution into rings:\n\n• Ring 0 (Kernel Mode): Full unrestricted access to memory, hardware registers, and CPU instructions.\n• Ring 3 (User Space): Sandboxed environment where standard user applications execute.\n\nWhen a program needs to write to a disk or send network packets, it MUST issue a System Call (syscall like open(), read(), write(), socket()). The kernel validates permissions before executing the request on behalf of the user.`,
        quiz: {
          question: 'What mechanism allows a user space program to securely request kernel-level actions like disk I/O?',
          options: ['Direct memory bus write', 'System Calls (Syscalls)', 'BIOS Interrupt Vectoring', 'Direct DMA overwrite'],
          correctIndex: 1,
          explanation: 'System calls are the official, audited API gate between Ring 3 (user space) and Ring 0 (kernel space).'
        },
        practiceTask: 'List 3 common system calls used when creating network connections in Unix.',
        completed: true
      },
      {
        id: 'l0-3',
        levelId: 0,
        title: 'Binary, Hexadecimal & Data Representation',
        duration: '15 min',
        xpReward: 75,
        summary: 'Base 2, Base 16, ASCII encoding, Little-Endian vs Big-Endian byte order.',
        theoryContent: `Cybersecurity analysts constantly read raw packet hex dumps and compiled machine code.\n\n• Binary: Base-2 (0 and 1)\n• Hexadecimal: Base-16 (0-9, A-F). One byte (8 bits) is represented by two hex characters (e.g. 0xFF = 255 = 11111111).\n• Endianness: The order in which bytes are stored in memory.\n  - Little-Endian (x86/x64): Least significant byte stored first.\n  - Big-Endian (Network Byte Order): Most significant byte stored first.`,
        quiz: {
          question: 'What is the hexadecimal equivalent of decimal 255?',
          options: ['0xAA', '0xFF', '0x100', '0xFE'],
          correctIndex: 1,
          explanation: '0xFF is equal to 15 * 16^1 + 15 * 16^0 = 240 + 15 = 255 (or binary 11111111).'
        },
        practiceTask: 'Convert the ASCII characters "CYBER" into their respective hexadecimal ASCII codes.',
        completed: true
      },
      {
        id: 'l0-4',
        levelId: 0,
        title: 'Ethical Hacking Philosophy & Legal Scope',
        duration: '8 min',
        xpReward: 75,
        summary: 'Rules of Engagement, CFAA/GDPR compliance, Non-Disclosure Agreements, and Scope of Work.',
        theoryContent: `Ethical Hacking is legal penetration testing conducted with explicit, written authorization. The golden rule is:\n\n"ONLY TEST SYSTEMS YOU OWN OR HAVE EXPLICIT WRITTEN PERMISSION TO TEST."\n\nKey documents in professional pentesting:\n1. Rules of Engagement (RoE): Defines test windows, forbidden attack methods (e.g. no DoS), and emergency contacts.\n2. Scope Statement: Strict list of IP ranges, domains, or repos authorized for testing.\n3. NDA: Protects proprietary vulnerability findings until remediation is verified.`,
        quiz: {
          question: 'What is the most fundamental document required before any penetration testing activity begins?',
          options: ['A Kali Linux USB drive', 'Written Authorization & Rules of Engagement', 'A CVE vulnerability scanner', 'An anonymous VPN connection'],
          correctIndex: 1,
          explanation: 'Without explicit written authorization and defined scope, any scanning or exploitation is illegal unauthorized access.'
        },
        practiceTask: 'Review the Ethical-Use banner on My Cyber Lab and understand why isolated sandboxes are essential.',
        completed: true
      }
    ]
  },
  {
    level: 1,
    title: 'Linux Fundamentals',
    code: 'LVL-01',
    description: 'Master the Linux file hierarchy, standard I/O streams, piping, environment variables, and essential command line tools.',
    category: 'Linux',
    status: 'mastered',
    lessonsCount: 5,
    completedLessons: 5,
    xpReward: 400,
    lessons: [
      {
        id: 'l1-1',
        levelId: 1,
        title: 'The Unix Filesystem Hierarchy (FHS)',
        duration: '12 min',
        xpReward: 80,
        summary: 'Explore /, /bin, /etc, /var/log, /home, /root, /tmp and pseudo-filesystems like /proc.',
        theoryContent: `Unlike Windows with drive letters (C:\\, D:\\), Unix systems use a single unified hierarchical tree starting at root (/).\n\nCritical security directories:\n• /etc: System configuration files (e.g. /etc/passwd, /etc/shadow, /etc/hosts).\n• /var/log: System and service audit logs (auth.log, syslog, apache2/access.log).\n• /proc: Pseudo-filesystem exposing active process memory and kernel parameters.\n• /tmp: World-writable scratchpad frequently targeted during privilege escalation.`,
        quiz: {
          question: 'Which directory contains system-wide configuration files and password databases in Linux?',
          options: ['/var/log', '/etc', '/bin', '/usr/share'],
          correctIndex: 1,
          explanation: '/etc is the standard location for all system configuration files in Linux distributions.'
        },
        practiceTask: 'Use the command "ls -la /" in the Linux Lab simulator to inspect the root hierarchy.',
        completed: true
      },
      {
        id: 'l1-2',
        levelId: 1,
        title: 'Linux Permissions, Users & Groups',
        duration: '15 min',
        xpReward: 80,
        summary: 'Read, Write, Execute (rwx) octal permissions (chmod 755), chown, and SUID bits.',
        theoryContent: `Every file in Linux belongs to a User and a Group. Permissions are defined in 3 triplets: User | Group | Others.\n\nPermission Values:\n• r (Read) = 4\n• w (Write) = 2\n• x (Execute) = 1\n\nExample: chmod 755 script.sh gives User rwx (4+2+1=7), Group rx (4+0+1=5), and Others rx (4+0+1=5).\n\nSpecial Permissions:\n• SUID (Set User ID - 4000): Executes the binary with the file owner's privileges (e.g. /usr/bin/passwd owned by root). A misconfigured SUID binary is a primary privilege escalation vector!`,
        quiz: {
          question: 'What numeric chmod value grants read+write to owner, and read-only to group and others?',
          options: ['777', '755', '644', '600'],
          correctIndex: 2,
          explanation: 'Owner: 4+2=6, Group: 4, Others: 4 => 644.'
        },
        practiceTask: 'Experiment with chmod and ls -l in the Linux Lab simulator.',
        completed: true
      },
      {
        id: 'l1-3',
        levelId: 1,
        title: 'Pipes, Redirection & Text Processing',
        duration: '18 min',
        xpReward: 80,
        summary: 'Master stdout, stderr, grep, awk, sed, cut, sort, and uniq for log triage.',
        theoryContent: `The Unix philosophy: "Write programs that do one thing and do it well. Write programs to work together."\n\nStreams:\n• stdin (FD 0)\n• stdout (FD 1) > >>\n• stderr (FD 2) 2>\n\nThe Pipe (|) redirects the stdout of one program to the stdin of another. Example log triage:\ncat /var/log/auth.log | grep "Failed password" | awk '{print $11}' | sort | uniq -c | sort -nr\nThis single command parses thousands of lines of SSH logs to identify the top IP addresses attempting brute-force logins.`,
        quiz: {
          question: 'Which tool is ideal for filtering lines containing a specific pattern in Linux streams?',
          options: ['grep', 'chmod', 'fdisk', 'touch'],
          correctIndex: 0,
          explanation: 'grep (Global Regular Expression Print) searches and filters text based on regex patterns.'
        },
        practiceTask: 'In the Linux Lab simulator, run "cat /var/log/auth.log | grep Failed" to discover attack attempts.',
        completed: true
      },
      {
        id: 'l1-4',
        levelId: 1,
        title: 'Process Management, Daemons & Signals',
        duration: '10 min',
        xpReward: 80,
        summary: 'Inspect ps aux, top, kill signals (SIGTERM 15, SIGKILL 9), and background jobs (&).',
        theoryContent: `Every process has a unique PID (Process ID). The root init system (systemd, PID 1) spawns system services.\n\nUseful commands:\n• ps aux: Snapshot of all running processes across all users.\n• top / htop: Dynamic real-time interactive process monitor.\n• kill -9 <PID>: Forcefully sends SIGKILL signal.\n• systemctl status ssh: Checks status of the SSH daemon.`,
        quiz: {
          question: 'What is the Process ID (PID) of the master init / systemd process in Linux?',
          options: ['0', '1', '100', '65535'],
          correctIndex: 1,
          explanation: 'PID 1 is reserved for the initial system daemon (init / systemd) that boots all subsequent services.'
        },
        practiceTask: 'Run "ps aux" in the Linux Lab to inspect active background services.',
        completed: true
      },
      {
        id: 'l1-5',
        levelId: 1,
        title: 'Package Management & Security Tooling',
        duration: '10 min',
        xpReward: 80,
        summary: 'Debian APT repositories, compiling from source, Git workflows, and Python virtual environments.',
        theoryContent: `Kali Linux and Debian use the Advanced Package Tool (APT):\n• apt update && apt upgrade -y\n• apt install nmap wireshark gobuster -y\n\nSecurity professionals frequently clone cutting-edge research tools from GitHub and execute them in isolated Python venvs or Docker containers.`,
        quiz: {
          question: 'Which command refreshes local APT package index metadata from upstream mirrors?',
          options: ['apt upgrade', 'apt update', 'apt clean', 'apt purge'],
          correctIndex: 1,
          explanation: 'apt update fetches the latest package lists from repositories without actually upgrading packages.'
        },
        practiceTask: 'Verify package management commands and review security tool categories.',
        completed: true
      }
    ]
  },
  {
    level: 2,
    title: 'Networking Fundamentals',
    code: 'LVL-02',
    description: 'Master the OSI 7-layer model, Ethernet frames, MAC addresses, ARP resolution, and packet switching.',
    category: 'Networking',
    status: 'learning',
    lessonsCount: 4,
    completedLessons: 3,
    xpReward: 350,
    lessons: [
      {
        id: 'l2-1',
        levelId: 2,
        title: 'The OSI 7-Layer vs TCP/IP Model',
        duration: '15 min',
        xpReward: 90,
        summary: 'Layer 1 Physical to Layer 7 Application with encapsulation headers and protocol data units (PDUs).',
        theoryContent: `The Open Systems Interconnection (OSI) model standardizes network communication into 7 distinct layers:\n\n7. Application (HTTP, DNS, SSH, FTP)\n6. Presentation (SSL/TLS, ASCII, Encryption)\n5. Session (RPC, NetBIOS, session tokens)\n4. Transport (TCP, UDP - Segments/Datagrams)\n3. Network (IP, ICMP - Packets, Routing)\n2. Data Link (Ethernet, Wi-Fi - Frames, MAC addresses)\n1. Physical (Cables, Radio Waves, Bits)\n\nData Encapsulation: As data travels down the stack, each layer wraps the payload with its own header. On receipt, the process reverses (Decapsulation).`,
        quiz: {
          question: 'At which OSI layer do IP addresses and routing decisions operate?',
          options: ['Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)', 'Layer 7 (Application)'],
          correctIndex: 1,
          explanation: 'Layer 3 (Network Layer) is responsible for logical addressing (IP) and path routing.'
        },
        practiceTask: 'Open the Network Lab page and observe how packets move from the Student Workstation through Layer 3 Gateway to the Web Server.',
        completed: true
      },
      {
        id: 'l2-2',
        levelId: 2,
        title: 'MAC Addresses, Ethernet & Layer 2 Frames',
        duration: '10 min',
        xpReward: 85,
        summary: '48-bit hardware addresses (OUI + NIC ID), broadcast domains, and collision avoidance.',
        theoryContent: `Media Access Control (MAC) addresses are 48-bit hardware identifiers assigned to Network Interface Cards (NICs) e.g., 00:1A:2B:3C:4D:5E.\n\nThe first 24 bits represent the Organizationally Unique Identifier (OUI - Manufacturer like Cisco, Intel, Apple), and the last 24 bits are the unique device serial.\n\nSwitches operate at Layer 2 and forward frames based on internal MAC address tables (CAM tables).`,
        quiz: {
          question: 'How many bits long is a standard Ethernet MAC address?',
          options: ['32 bits', '48 bits', '64 bits', '128 bits'],
          correctIndex: 1,
          explanation: 'Ethernet MAC addresses are 48 bits (6 bytes), commonly formatted as six pairs of hexadecimal digits.'
        },
        practiceTask: 'Inspect the MAC address of the Student Machine in the Network Lab topology.',
        completed: true
      },
      {
        id: 'l2-3',
        levelId: 2,
        title: 'Address Resolution Protocol (ARP) & ARP Poisoning',
        duration: '14 min',
        xpReward: 90,
        summary: 'How IP maps to MAC, ARP tables, gratuitous ARP, and Man-in-the-Middle (MITM) concepts.',
        theoryContent: `When host A wants to talk to host B on the same local subnet, it knows B's IP address, but the local switch needs B's MAC address.\n\n1. Host A broadcasts an ARP Request: "Who has 192.168.1.1? Tell 192.168.1.10." (Sent to FF:FF:FF:FF:FF:FF)\n2. Host B sends a unicast ARP Reply: "192.168.1.1 is at 00:50:56:FE:ED:01."\n3. Host A caches this mapping in its ARP table.\n\nSecurity vulnerability: ARP has no authentication! An attacker on the local network can send forged unsolicited ARP replies ("ARP Poisoning") to intercept or alter traffic between a victim and the default gateway.`,
        quiz: {
          question: 'What is the broadcast MAC address used by ARP requests on an Ethernet network?',
          options: ['00:00:00:00:00:00', 'FF:FF:FF:FF:FF:FF', '192.168.1.255', 'FE:80::1'],
          correctIndex: 1,
          explanation: 'FF:FF:FF:FF:FF:FF is the Layer 2 Ethernet broadcast address received by all nodes on the collision domain.'
        },
        practiceTask: 'Review simulated ARP table entries in the Network Lab inspection panel.',
        completed: true
      },
      {
        id: 'l2-4',
        levelId: 2,
        title: 'Switches, Routers & Default Gateways',
        duration: '12 min',
        xpReward: 85,
        summary: 'Forwarding tables, routing metrics, broadcast containment, and VLAN segmentation.',
        theoryContent: `• Switch (Layer 2): Connects local devices in the same subnet using MAC addresses.\n• Router (Layer 3): Connects different subnets and routes packets across internet networks using IP addresses.\n• Default Gateway: The router interface IP where hosts send packets destined for outside their local subnet.\n• VLANs (Virtual LANs): Logically segment network traffic on switches to prevent unauthorized cross-department pivoting.`,
        quiz: {
          question: 'When sending data to a server on the internet, which device does your workstation forward the packet to first?',
          options: ['The public DNS server directly', 'The Default Gateway router IP', 'The web server MAC address', 'The root nameserver'],
          correctIndex: 1,
          explanation: 'Workstations forward all non-local traffic to their local configured Default Gateway router.'
        },
        practiceTask: 'Trace the default route path in Network Lab.',
        completed: false
      }
    ]
  },
  {
    level: 3,
    title: 'IP Addressing (IPv4 & IPv6)',
    code: 'LVL-03',
    description: 'Understand 32-bit IPv4 octets, binary representation, private RFC 1918 ranges, NAT, and 128-bit IPv6 headers.',
    category: 'Networking',
    status: 'learning',
    lessonsCount: 3,
    completedLessons: 1,
    xpReward: 300,
    lessons: [
      {
        id: 'l3-1',
        levelId: 3,
        title: 'IPv4 Structure & Private RFC 1918 Ranges',
        duration: '12 min',
        xpReward: 100,
        summary: 'Dotted decimal notation, classful addressing history, and private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.',
        theoryContent: `IPv4 uses 32-bit numbers formatted as four 8-bit octets (e.g. 192.168.1.100). Each octet ranges from 0 to 255.\n\nRFC 1918 Reserved Private Address Spaces (non-routable on public internet):\n• Class A: 10.0.0.0 – 10.255.255.255 (10.0.0.0/8 - 16.7M hosts)\n• Class B: 172.16.0.0 – 172.31.255.255 (172.16.0.0/12 - 1M hosts)\n• Class C: 192.168.0.0 – 192.168.255.255 (192.168.0.0/16 - 65,536 hosts)\n\nLoopback: 127.0.0.1 (localhost) refers to the local machine itself.`,
        quiz: {
          question: 'Which of the following IP addresses is a private RFC 1918 address?',
          options: ['8.8.8.8', '192.168.1.50', '1.1.1.1', '142.250.190.46'],
          correctIndex: 1,
          explanation: '192.168.1.50 falls inside the private RFC 1918 Class C range (192.168.0.0/16).'
        },
        practiceTask: 'Identify the IP and network class of the Student Workstation (192.168.1.10).',
        completed: true
      },
      {
        id: 'l3-2',
        levelId: 3,
        title: 'Network Address Translation (NAT) & Port Forwarding',
        duration: '10 min',
        xpReward: 100,
        summary: 'How routers multiplex thousands of private internal devices onto single public IPs using PAT.',
        theoryContent: `Due to IPv4 address exhaustion, Network Address Translation (NAT) enables multiple devices on a private LAN to share a single public routable IP address provided by an ISP.\n\nWhen you request a webpage, your router translates (Private IP, Source Port) -> (Public IP, NAT Source Port), maintaining a translation state table. When packets return, the router demultiplexes and delivers them to the correct internal workstation.`,
        quiz: {
          question: 'What technology allows hundreds of private devices to share a single public IP address?',
          options: ['DNS Root Lookup', 'Network Address Translation (NAT)', 'DHCP Snooping', 'BGP Peering'],
          correctIndex: 1,
          explanation: 'NAT (specifically PAT/NAPT) maps internal private IP/port tuples to a public routable IP.'
        },
        practiceTask: 'Review simulated NAT gateway mappings in the Cyber Lab topology.',
        completed: false
      },
      {
        id: 'l3-3',
        levelId: 3,
        title: 'IPv6 Architecture & Link-Local Addresses',
        duration: '10 min',
        xpReward: 100,
        summary: '128-bit hexadecimal addressing, fe80:: link-local, SLAAC auto-configuration, and no broadcast addresses.',
        theoryContent: `IPv6 replaces 32-bit IPv4 with 128-bit addresses, offering 3.4 x 10^38 addresses (enough for every atom on Earth).\n\nKey differences:\n• Written in 8 groups of 4 hexadecimal digits (e.g. 2001:0db8:85a3:0000:0000:8a2e:0370:7334).\n• Consecutive groups of zeros can be compressed once with '::' (e.g. 2001:db8:85a3::8a2e:370:7334).\n• Link-Local addresses begin with fe80:: and function within a local Layer 2 segment.\n• Broadcast is eliminated in favor of targeted Multicast.`,
        quiz: {
          question: 'How many bits are used in an IPv6 address?',
          options: ['32 bits', '64 bits', '128 bits', '256 bits'],
          correctIndex: 2,
          explanation: 'IPv6 addresses are 128 bits long, written as 8 groups of hexadecimal values separated by colons.'
        },
        practiceTask: 'Calculate the compressed format of fe80:0000:0000:0000:0202:b3ff:fe1e:8329.',
        completed: false
      }
    ]
  },
  {
    level: 4,
    title: 'Subnetting & CIDR Calculation',
    code: 'LVL-04',
    description: 'Calculate subnet masks, network IDs, broadcast addresses, usable host ranges, and CIDR prefix notation (/24, /28, /30) without sweat.',
    category: 'Networking',
    status: 'locked',
    lessonsCount: 3,
    completedLessons: 0,
    xpReward: 400,
    lessons: []
  },
  {
    level: 5,
    title: 'TCP/IP & Core Network Protocols',
    code: 'LVL-05',
    description: 'Master TCP 3-way handshake (SYN, SYN-ACK, ACK), TCP flags, UDP datagrams, DNS queries, DHCP leases, and ICMP diagnostics.',
    category: 'Networking',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 400,
    lessons: []
  },
  {
    level: 6,
    title: 'Linux for Security Professionals',
    code: 'LVL-06',
    description: 'Bash scripting, cron jobs, network sockets, netcat, ssh tunneling, iptables firewalling, and auditd log analysis.',
    category: 'Linux',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 450,
    lessons: []
  },
  {
    level: 7,
    title: 'Passive & Active Reconnaissance',
    code: 'LVL-07',
    description: 'OSINT methodologies, DNS brute-forcing (Amass, Sublist3r), WHOIS, Shodan, Google Dorking, and certificate transparency logs.',
    category: 'Offensive',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 500,
    lessons: []
  },
  {
    level: 8,
    title: 'Port Scanning & Service Enumeration',
    code: 'LVL-08',
    description: 'Deep dive into Nmap (SYN scan -sS, Version -sV, Script -sC, UDP -sU), banner grabbing, and service fingerprinting.',
    category: 'Offensive',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 500,
    lessons: []
  },
  {
    level: 9,
    title: 'Network Security & Traffic Analysis',
    code: 'LVL-09',
    description: 'Wireshark packet dissections, tcpdump capture filters, MITM detection, and IDS/IPS alert rules (Snort/Suricata).',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 500,
    lessons: []
  },
  {
    level: 10,
    title: 'Web Application Security & OWASP Top 10',
    code: 'LVL-10',
    description: 'SQL Injection (SQLi), Cross-Site Scripting (XSS), CSRF, IDOR, SSRF, broken authentication, and security misconfigurations.',
    category: 'Web',
    status: 'locked',
    lessonsCount: 6,
    completedLessons: 0,
    xpReward: 600,
    lessons: []
  },
  {
    level: 11,
    title: 'Burp Suite & HTTP Proxy Mastery',
    code: 'LVL-11',
    description: 'Intercepting proxy, Repeater manual testing, Intruder payload fuzzing, Decoder, Comparer, and automated scanning workflows.',
    category: 'Web',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 550,
    lessons: []
  },
  {
    level: 12,
    title: 'Vulnerability Assessment & CVSS Scoring',
    code: 'LVL-12',
    description: 'Nessus, OpenVAS, CVE databases, CVSS v3.1 vector calculations, false positive filtering, and remediation planning.',
    category: 'Assessment',
    status: 'locked',
    lessonsCount: 3,
    completedLessons: 0,
    xpReward: 500,
    lessons: []
  },
  {
    level: 13,
    title: 'Linux Security Hardening & Privilege Escalation',
    code: 'LVL-13',
    description: 'SUID binaries, sudo -l misconfigurations, cron job hijacking, path injection, capabilities (getcap), and LinPEAS.',
    category: 'Linux',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 650,
    lessons: []
  },
  {
    level: 14,
    title: 'Windows Security Architecture',
    code: 'LVL-14',
    description: 'NTFS permissions, Registry keys, SAM database, LSASS process, User Account Control (UAC), and PowerShell security.',
    category: 'Windows',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 600,
    lessons: []
  },
  {
    level: 15,
    title: 'Privilege Escalation Concepts & Windows PrivEsc',
    code: 'LVL-15',
    description: 'Unquoted service paths, always install elevated, token impersonation (SeImpersonatePrivilege), and WinPEAS automation.',
    category: 'Offensive',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 700,
    lessons: []
  },
  {
    level: 16,
    title: 'Active Directory Security & Domain Pentesting',
    code: 'LVL-16',
    description: 'Kerberos authentication, AS-REP Roasting, Kerberoasting, BloodHound graph analysis, Pass-the-Hash, and DCSync attacks.',
    category: 'Enterprise',
    status: 'locked',
    lessonsCount: 6,
    completedLessons: 0,
    xpReward: 800,
    lessons: []
  },
  {
    level: 17,
    title: 'Digital Forensics & Incident Response (DFIR)',
    code: 'LVL-17',
    description: 'Memory analysis with Volatility, disk imaging, timeline reconstruction (Plaso), log correlation, and chain of custody.',
    category: 'Forensics',
    status: 'locked',
    lessonsCount: 4,
    completedLessons: 0,
    xpReward: 650,
    lessons: []
  },
  {
    level: 18,
    title: 'Blue Team Operations & Threat Hunting',
    code: 'LVL-18',
    description: 'SIEM architectures (Splunk/Elastic), Sigma rules, MITRE ATT&CK mapping, endpoint detection (Sysmon), and defense in depth.',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 700,
    lessons: []
  },
  {
    level: 19,
    title: 'Capture The Flag (CTF) Strategies',
    code: 'LVL-19',
    description: 'Reverse engineering with Ghidra, binary exploitation (pwn), web challenge speedruns, and steganography decoding.',
    category: 'CTF',
    status: 'locked',
    lessonsCount: 5,
    completedLessons: 0,
    xpReward: 750,
    lessons: []
  },
  {
    level: 20,
    title: 'Advanced Ethical Hacking & Red Teaming',
    code: 'LVL-20',
    description: 'Evasion techniques, custom payload crafting, command & control (C2) frameworks, and professional report writing.',
    category: 'Advanced',
    status: 'locked',
    lessonsCount: 6,
    completedLessons: 0,
    xpReward: 900,
    lessons: []
  },
  {
    level: 21,
    title: 'Final Cyber Range Capstone',
    code: 'LVL-21',
    description: 'End-to-end multi-machine enterprise simulation. Full scope engagement, penetration test, forensic post-mortem, and executive debrief.',
    category: 'Capstone',
    status: 'locked',
    lessonsCount: 3,
    completedLessons: 0,
    xpReward: 1200,
    lessons: []
  },
  {
    level: 22,
    title: 'Cryptography & Secure Communications',
    code: 'LVL-22',
    description: 'Master symmetric vs asymmetric cryptography, digital signatures, hashing vs encoding vs encryption, certificates, PKI, and TLS handshakes.',
    category: 'Security Fundamentals',
    status: 'locked',
    lessonsCount: 8,
    completedLessons: 0,
    xpReward: 950,
    lessons: []
  },
  {
    level: 23,
    title: 'API Security & Modern Web Applications',
    code: 'LVL-23',
    description: 'REST & JSON architecture, HTTP methods, JWT & Bearer tokens, Broken Object Level Authorization (BOLA/IDOR), rate limiting, and API security testing.',
    category: 'Web',
    status: 'locked',
    lessonsCount: 8,
    completedLessons: 0,
    xpReward: 1000,
    lessons: []
  },
  {
    level: 24,
    title: 'Secure Programming & Vulnerability Prevention',
    code: 'LVL-24',
    description: 'Master defensive secure coding: parameterized SQL queries, context-aware HTML output encoding, password hashing with bcrypt, and session handling.',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1050,
    lessons: []
  },
  {
    level: 25,
    title: 'Cloud Security Fundamentals',
    code: 'LVL-25',
    description: 'IaaS, PaaS, SaaS architecture, AWS/GCP/Azure IAM least privilege, S3 bucket misconfigurations, security groups, and cloud incident remediation.',
    category: 'Cloud',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1100,
    lessons: []
  },
  {
    level: 26,
    title: 'Container & Docker Security',
    code: 'LVL-26',
    description: 'Docker image layers, rootless containers, exposed daemon sockets (/var/run/docker.sock), Linux capabilities (CAP_SYS_ADMIN), and container hardening.',
    category: 'Infrastructure',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1100,
    lessons: []
  },
  {
    level: 27,
    title: 'Wireless & Network Access Security',
    code: 'LVL-27',
    description: '802.11 standards, WPA2 4-way handshake, WPA3 SAE (Simultaneous Authentication of Equals), Rogue Access Points, Evil Twins, and 802.1X Enterprise.',
    category: 'Networking',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1000,
    lessons: []
  },
  {
    level: 28,
    title: 'Malware Analysis & Reverse Engineering Fundamentals',
    code: 'LVL-28',
    description: 'Static analysis (strings, PE headers, imports), dynamic sandbox analysis, indicators of compromise (IoCs), process hollowing, and persistence mechanisms.',
    category: 'Forensics',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1200,
    lessons: []
  },
  {
    level: 29,
    title: 'Threat Intelligence & Adversary Simulation',
    code: 'LVL-29',
    description: 'Strategic & tactical CTI, Indicators of Compromise (IoCs), MITRE ATT&CK enterprise matrix, Sigma rules, threat hunting hypotheses, and attack chain mapping.',
    category: 'Defensive',
    status: 'locked',
    lessonsCount: 10,
    completedLessons: 0,
    xpReward: 1250,
    lessons: []
  },
  {
    level: 30,
    title: 'Professional Ethical Hacking Methodology',
    code: 'LVL-30',
    description: 'Scope definition, Rules of Engagement (RoE), PTES methodology, vulnerability scoring (CVSS v3.1), proof-of-concept hygiene, executive reporting, and remediation retesting.',
    category: 'Professional',
    status: 'locked',
    lessonsCount: 14,
    completedLessons: 0,
    xpReward: 1400,
    lessons: []
  },
  {
    level: 31,
    title: 'MY CYBER LAB MASTER RANGE',
    code: 'LVL-31',
    description: 'The ultimate 12-phase capstone cyber range. Multi-subnet enterprise simulation: Perimeter Firewall, Web App, DNS, Database, Linux Host, Windows Host, and Active Directory domain.',
    category: 'Capstone',
    status: 'locked',
    lessonsCount: 12,
    completedLessons: 0,
    xpReward: 2500,
    lessons: []
  }
].map((lvl): LevelModule => {
  const ext = COMPREHENSIVE_LEVELS_EXTENSION[lvl.level];
  if (ext && ext.lessons && ext.lessons.length > 0) {
    return {
      ...lvl,
      status: lvl.status as SkillStatus,
      lessonsCount: ext.lessonsCount || ext.lessons.length,
      lessons: ext.lessons
    };
  }
  return {
    ...lvl,
    status: lvl.status as SkillStatus
  };
});



export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm-01',
    missionNumber: 'MISSION 01',
    codename: 'OP_INIT_SYSTEM',
    title: 'Meet Your Machine',
    difficulty: 'Beginner',
    xp: 150,
    estimatedTime: '15 min',
    status: 'completed',
    prerequisite: 'Level 0 — Computer Fundamentals',
    category: 'Linux',
    description: 'Boot into your simulated workstation environment, identify your logged-in user account, kernel version, and system hostname.',
    briefing: [
      'Welcome Operator. Before executing offensive investigations or defensive audits, you must know the exact environment you operate.',
      'Your workstation terminal is your primary instrument. You will execute basic discovery commands to map your host architecture, current user permissions, and directory coordinates.'
    ],
    objectives: [
      { id: 'obj-1', title: 'Verify logged in user', description: 'Run whoami to confirm current security context.', completed: true, hint: 'Execute: whoami' },
      { id: 'obj-2', title: 'Check system hostname', description: 'Run hostname to verify station network identifier.', completed: true, hint: 'Execute: hostname' },
      { id: 'obj-3', title: 'Inspect kernel architecture', description: 'Run uname -a to observe OS version and CPU architecture.', completed: true, hint: 'Execute: uname -a' },
      { id: 'obj-4', title: 'Locate current path', description: 'Run pwd to identify current absolute path.', completed: true, hint: 'Execute: pwd' }
    ],
    rewardBadge: 'Operator Genesis'
  },
  {
    id: 'm-02',
    missionNumber: 'MISSION 02',
    codename: 'OP_FIRST_COMMAND',
    title: 'Your First Linux Command',
    difficulty: 'Beginner',
    xp: 200,
    estimatedTime: '20 min',
    status: 'completed',
    prerequisite: 'Mission 01',
    category: 'Linux',
    description: 'Navigate the file tree, list hidden files, view file metadata, read file contents, and create your first mission workspace.',
    briefing: [
      'In Linux, everything is treated as a file or stream. Master file inspection, permissions checking, and directory navigation.',
      'You will navigate to /tmp/cyber_briefing, uncover hidden dot-files, inspect file sizes, and concatenate text strings.'
    ],
    objectives: [
      { id: 'obj-1', title: 'List all files including hidden', description: 'Execute ls -la to view hidden dotfiles and permission bits.', completed: true, hint: 'Flags: -l for long format, -a for all' },
      { id: 'obj-2', title: 'Read mission briefing file', description: 'Use cat to output briefing text to terminal stdout.', completed: true, hint: 'Command: cat /etc/motd' },
      { id: 'obj-3', title: 'Create safe laboratory workspace', description: 'Make a directory named /tmp/lab_workspace using mkdir.', completed: true, hint: 'Command: mkdir -p /tmp/lab_workspace' }
    ],
    rewardBadge: 'Terminal Initiate'
  },
  {
    id: 'm-03',
    missionNumber: 'MISSION 03',
    codename: 'OP_EXPLORE_ROOT',
    title: 'Explore Linux',
    difficulty: 'Beginner',
    xp: 250,
    estimatedTime: '25 min',
    status: 'in_progress',
    prerequisite: 'Mission 02',
    category: 'Linux',
    description: 'Investigate the Linux /etc directory, examine the password database /etc/passwd, and understand how user IDs (UIDs) correlate with system accounts.',
    briefing: [
      'The file /etc/passwd is world-readable and defines every account on the system.',
      'You must inspect the format: username:x:UID:GID:comment:home_directory:login_shell. Note which users have login shells like /bin/bash versus /usr/sbin/nologin.'
    ],
    objectives: [
      { id: 'obj-1', title: 'Filter login-capable users', description: 'Use grep to search /etc/passwd for accounts assigned /bin/bash.', completed: true, hint: 'Command: grep "/bin/bash" /etc/passwd' },
      { id: 'obj-2', title: 'Identify UID 0 administrator', description: 'Verify which account possesses User ID 0 (root).', completed: false, hint: 'UID 0 is strictly root in standard Unix distributions.' },
      { id: 'obj-3', title: 'Check system release details', description: 'Examine /etc/os-release to observe distribution information.', completed: false, hint: 'Command: cat /etc/os-release' }
    ],
    rewardBadge: 'System Investigator'
  },
  {
    id: 'm-04',
    missionNumber: 'MISSION 04',
    codename: 'OP_LOCAL_IP',
    title: 'Find Your IP Address',
    difficulty: 'Beginner',
    xp: 250,
    estimatedTime: '20 min',
    status: 'available',
    prerequisite: 'Mission 03 & Level 2',
    category: 'Networking',
    description: 'Use ip addr and ifconfig to discover your network interfaces (eth0, lo), IPv4 address, MAC address, and subnet mask.',
    briefing: [
      'To interact with network targets, an analyst must first understand their own network interface cards (NICs).',
      'Learn how the loopback interface (lo: 127.0.0.1) differs from the local physical or virtual ethernet interface (eth0: 192.168.1.10).'
    ],
    objectives: [
      { id: 'obj-1', title: 'Display active network interfaces', description: 'Run ip addr or ifconfig to list all configured interfaces.', completed: false, hint: 'Command: ip a or ifconfig' },
      { id: 'obj-2', title: 'Extract IPv4 address of eth0', description: 'Identify the dotted decimal IP assigned to eth0.', completed: false, hint: 'Look for the "inet" line under eth0' },
      { id: 'obj-3', title: 'Determine MAC hardware address', description: 'Locate the 48-bit link/ether address of eth0.', completed: false, hint: 'Look for "link/ether 00:0c:..."' }
    ]
  },
  {
    id: 'm-05',
    missionNumber: 'MISSION 05',
    codename: 'OP_MAP_GATEWAY',
    title: 'Understand Your Network',
    difficulty: 'Easy',
    xp: 300,
    estimatedTime: '25 min',
    status: 'available',
    prerequisite: 'Mission 04',
    category: 'Networking',
    description: 'Inspect the local routing table with ip route, verify default gateway connectivity with ping, and analyze ARP cache with ip neigh.',
    briefing: [
      'How does your machine reach the outside world? Through the Default Gateway router.',
      'You will examine how the kernel routes packets and how ARP maps neighboring IP addresses to MAC addresses.'
    ],
    objectives: [
      { id: 'obj-1', title: 'Find default gateway IP', description: 'Execute ip route show to find the "default via" IP.', completed: false, hint: 'Command: ip route' },
      { id: 'obj-2', title: 'Test ICMP reachability', description: 'Send 3 ICMP echo request packets to the default gateway (192.168.1.1).', completed: false, hint: 'Command: ping -c 3 192.168.1.1' },
      { id: 'obj-3', title: 'Inspect local ARP cache', description: 'Run ip neigh or arp -a to inspect resolved neighboring devices.', completed: false, hint: 'Command: ip neigh show' }
    ]
  },
  {
    id: 'm-06',
    missionNumber: 'MISSION 06',
    codename: 'OP_PROTO_DIAG',
    title: 'TCP vs UDP in Action',
    difficulty: 'Easy',
    xp: 350,
    estimatedTime: '30 min',
    status: 'available',
    prerequisite: 'Mission 05 & Level 5',
    category: 'Networking',
    description: 'Compare connection-oriented TCP (3-way handshake) against connectionless UDP. Inspect open listening sockets with ss and netstat.',
    briefing: [
      'TCP provides reliable, ordered data streams with congestion control. UDP provides lightweight, fast transmission without connection overhead.',
      'Use the socket statistics utility (ss) to observe which ports are in LISTEN state on your machine.'
    ],
    objectives: [
      { id: 'obj-1', title: 'List all listening TCP sockets', description: 'Execute ss -tulpn to inspect listening TCP & UDP daemons.', completed: false, hint: 'Command: ss -tulpn' },
      { id: 'obj-2', title: 'Differentiate TCP Port 80 vs UDP Port 53', description: 'Analyze why web traffic uses TCP while DNS queries default to UDP.', completed: false, hint: 'Review DNS single packet query efficiency.' }
    ]
  },
  {
    id: 'm-07',
    missionNumber: 'MISSION 07',
    codename: 'OP_SERVICE_DISCO',
    title: 'Discover Services with Nmap',
    difficulty: 'Intermediate',
    xp: 400,
    estimatedTime: '35 min',
    status: 'locked',
    prerequisite: 'Mission 06 & Level 8',
    category: 'Recon',
    description: 'Perform an authorized port scan on the laboratory target machine (192.168.1.100). Identify open ports, service versions, and OS fingerprints.',
    briefing: [
      'Nmap (Network Mapper) is the quintessential network auditing tool.',
      'Execute a stealth SYN scan (-sS), detect service versions (-sV), and run default NSE discovery scripts (-sC) against the designated lab machine.'
    ],
    objectives: [
      { id: 'obj-1', title: 'Execute fast SYN port scan', description: 'Run nmap -sS -T4 192.168.1.100 to detect open ports.', completed: false, hint: 'Target: 192.168.1.100' },
      { id: 'obj-2', title: 'Enumerate service versions', description: 'Run nmap -sV -sC -p 22,80,3306 192.168.1.100.', completed: false, hint: 'Note the version of Apache and OpenSSH.' },
      { id: 'obj-3', title: 'Identify simulated web daemon', description: 'Extract the exact HTTP server banner running on port 80.', completed: false, hint: 'Look for "Apache/2.4.41 (Ubuntu)".' }
    ]
  },
  {
    id: 'm-08',
    missionNumber: 'MISSION 08',
    codename: 'OP_FIRST_INVESTIGATION',
    title: 'First Security Investigation',
    difficulty: 'Intermediate',
    xp: 500,
    estimatedTime: '45 min',
    status: 'locked',
    prerequisite: 'Mission 07',
    category: 'Investigation',
    description: 'Correlate web server access logs with authentication logs to reconstruct a simulated brute-force and web directory fuzzing attempt.',
    briefing: [
      'Security operations center (SOC) analysts and incident responders investigate audit logs to detect unauthorized access patterns.',
      'You will examine /var/log/apache2/access.log and /var/log/auth.log to determine the attacker IP, timestamp, user agent, and targeted endpoints.'
    ],
    objectives: [
      { id: 'obj-1', title: 'Detect directory fuzzing activity', description: 'Search access.log for rapid 404 HTTP status codes generated by tools like Gobuster/ffuf.', completed: false, hint: 'Look for repetitive HEAD or GET requests.' },
      { id: 'obj-2', title: 'Identify breached admin user', description: 'Find the single HTTP 200 /admin/dashboard request that succeeded.', completed: false, hint: 'Filter with: grep "200" /var/log/apache2/access.log' },
      { id: 'obj-3', title: 'Compile incident investigation summary', description: 'Document the attacker IP and affected URI in your Personal Notebook.', completed: false, hint: 'Use the Notebook tab to record your findings.' }
    ],
    rewardBadge: 'Cyber Investigator'
  }
];

export const SKILL_TREE_NODES: SkillNode[] = [
  {
    id: 'node-comp-fund',
    name: 'Computer Fundamentals',
    code: 'SKILL-01',
    tier: 1,
    category: 'Foundations',
    status: 'mastered',
    description: 'Hardware buses, CPU instruction cycles, memory addressing, and binary data representations.',
    prerequisites: [],
    associatedMissions: ['MISSION 01'],
    keyConcepts: ['CPU Registers', 'RAM Addressing', 'Hexadecimal Conversion', 'OS Architecture'],
    iconName: 'Cpu'
  },
  {
    id: 'node-linux',
    name: 'Linux Mastery',
    code: 'SKILL-02',
    tier: 2,
    category: 'Operating Systems',
    status: 'mastered',
    description: 'Unix filesystem hierarchy, process management, standard streams, SUID permissions, and Bash automation.',
    prerequisites: ['node-comp-fund'],
    associatedMissions: ['MISSION 01', 'MISSION 02', 'MISSION 03'],
    keyConcepts: ['FHS Hierarchy', 'chmod/chown', 'grep/awk/sed', 'Systemd Daemons', 'SUID Privileges'],
    iconName: 'Terminal'
  },
  {
    id: 'node-networking',
    name: 'Networking Core',
    code: 'SKILL-03',
    tier: 2,
    category: 'Networking',
    status: 'learning',
    description: 'OSI 7 layers, TCP 3-way handshake, UDP, Ethernet frames, ARP resolution, and routing gateways.',
    prerequisites: ['node-comp-fund'],
    associatedMissions: ['MISSION 04', 'MISSION 05', 'MISSION 06'],
    keyConcepts: ['OSI Model', 'TCP Handshake', 'ARP Tables', 'Default Gateways', 'Socket States (ss)'],
    iconName: 'Network'
  },
  {
    id: 'node-sec-fund',
    name: 'Security Fundamentals',
    code: 'SKILL-04',
    tier: 3,
    category: 'Security',
    status: 'learning',
    description: 'CIA triad (Confidentiality, Integrity, Availability), threat modeling, CVSS scoring, and ethical legal frameworks.',
    prerequisites: ['node-linux', 'node-networking'],
    associatedMissions: ['MISSION 08'],
    keyConcepts: ['CIA Triad', 'Rules of Engagement', 'Vulnerability Scopes', 'CVSS Metrics'],
    iconName: 'ShieldAlert'
  },
  {
    id: 'node-recon',
    name: 'Reconnaissance & OSINT',
    code: 'SKILL-05',
    tier: 4,
    category: 'Offensive',
    status: 'locked',
    description: 'Passive & active intelligence gathering, DNS enumeration, Shodan queries, subdomains, and search engine dorking.',
    prerequisites: ['node-sec-fund'],
    associatedMissions: ['MISSION 07'],
    keyConcepts: ['Passive OSINT', 'DNS Brute Forcing', 'WHOIS Recon', 'Shodan Filters'],
    iconName: 'Radio'
  },
  {
    id: 'node-enum',
    name: 'Port Scanning & Enumeration',
    code: 'SKILL-06',
    tier: 4,
    category: 'Offensive',
    status: 'locked',
    description: 'Deep service scanning with Nmap, banner grabbing, SMB share enumeration, and web directory fuzzing (Gobuster/ffuf).',
    prerequisites: ['node-recon'],
    associatedMissions: ['MISSION 07'],
    keyConcepts: ['Nmap SYN Scans', 'NSE Scripts', 'Banner Grabbing', 'Directory Fuzzing'],
    iconName: 'Radar'
  },
  {
    id: 'node-web-sec',
    name: 'Web Application Security',
    code: 'SKILL-07',
    tier: 5,
    category: 'Web',
    status: 'locked',
    description: 'OWASP Top 10 vulnerabilities: SQL Injection, XSS, CSRF, IDOR, SSRF, and proxy interception with Burp Suite.',
    prerequisites: ['node-enum'],
    associatedMissions: ['MISSION 08'],
    keyConcepts: ['SQL Injection', 'Reflected/Stored XSS', 'IDOR', 'Burp Repeater & Intruder'],
    iconName: 'Globe'
  },
  {
    id: 'node-linux-sec',
    name: 'Linux Security & PrivEsc',
    code: 'SKILL-08',
    tier: 5,
    category: 'System Security',
    status: 'locked',
    description: 'Privilege escalation techniques on Linux: misconfigured sudo rights, vulnerable cron jobs, SUID exploits, and kernel CVEs.',
    prerequisites: ['node-linux', 'node-sec-fund'],
    associatedMissions: [],
    keyConcepts: ['sudo -l vectors', 'SUID Abuses', 'Cron Wildcard Injection', 'LinPEAS Automation'],
    iconName: 'Lock'
  },
  {
    id: 'node-windows',
    name: 'Windows & Active Directory',
    code: 'SKILL-09',
    tier: 6,
    category: 'Enterprise',
    status: 'locked',
    description: 'Windows internal security, Kerberos authentication, BloodHound domain mapping, AS-REP Roasting, and Kerberoasting.',
    prerequisites: ['node-web-sec', 'node-linux-sec'],
    associatedMissions: [],
    keyConcepts: ['SAM & LSASS', 'Kerberos Tickets', 'BloodHound Graphs', 'AS-REP Roasting'],
    iconName: 'Server'
  },
  {
    id: 'node-ctf',
    name: 'CTF & Exploit Crafting',
    code: 'SKILL-10',
    tier: 7,
    category: 'Offensive',
    status: 'locked',
    description: 'Capture-the-flag methodologies, cryptographic puzzles, forensic steganography, and binary reverse engineering.',
    prerequisites: ['node-windows'],
    associatedMissions: [],
    keyConcepts: ['Reverse Engineering', 'Steganography', 'Crypto Ciphers', 'Pwn & Buffer Overflow'],
    iconName: 'Trophy'
  },
  {
    id: 'node-cyber-range',
    name: 'Advanced Cyber Range',
    code: 'SKILL-11',
    tier: 8,
    category: 'Capstone',
    status: 'locked',
    description: 'Full-spectrum authorized penetration testing inside multi-subnet virtual network ranges with formal executive reporting.',
    prerequisites: ['node-ctf'],
    associatedMissions: [],
    keyConcepts: ['Pivoting & Port Forwarding', 'C2 Frameworks', 'Red Team Engagements', 'Executive Debriefing'],
    iconName: 'Crosshair'
  }
];

export const NETWORK_LAB_DEVICES: NetworkDevice[] = [
  {
    id: 'dev-student',
    name: 'Student Workstation',
    role: 'Workstation',
    ip: '192.168.1.10',
    mac: '00:0C:29:4F:8E:1A',
    subnetMask: '255.255.255.0 (/24)',
    openPorts: [
      { port: 22, service: 'OpenSSH (internal)', protocol: 'TCP', status: 'open' }
    ],
    os: 'Kali Linux 2026 / Debian Rolling (Simulated)',
    status: 'online',
    description: 'Your primary training machine. Operating with non-root student privileges and pre-installed cybersecurity analysis utilities.',
    securityNotes: 'Default security profile: UFW active, outgoing traffic permitted, local SSH daemon listening on localhost only.'
  },
  {
    id: 'dev-router',
    name: 'Lab Gateway Router',
    role: 'Gateway / Router',
    ip: '192.168.1.1',
    mac: '00:50:56:FE:ED:01',
    subnetMask: '255.255.255.0 (/24)',
    openPorts: [
      { port: 53, service: 'DNS Forwarder (dnsmasq)', protocol: 'UDP', status: 'open' },
      { port: 67, service: 'DHCP Server Daemon', protocol: 'UDP', status: 'open' },
      { port: 443, service: 'RouterOS Admin Web UI', protocol: 'TCP', status: 'filtered' }
    ],
    os: 'OpenWrt 23.05 Linux Router OS',
    status: 'online',
    description: 'Default gateway interconnecting internal student lab subnet (192.168.1.0/24) with isolated target zones and upstream simulation DNS.',
    securityNotes: 'Enforces strict Layer 3 isolation rules. Disallows any arbitrary external internet routing to preserve containment.'
  },
  {
    id: 'dev-web',
    name: 'Internal Web Server',
    role: 'Web Server',
    ip: '192.168.1.50',
    mac: '00:0C:29:A1:B2:C3',
    subnetMask: '255.255.255.0 (/24)',
    openPorts: [
      { port: 80, service: 'Apache HTTP Server 2.4.41', protocol: 'TCP', status: 'open' },
      { port: 443, service: 'HTTPS (Self-signed TLS)', protocol: 'TCP', status: 'open' },
      { port: 3306, service: 'MySQL Database 8.0.28', protocol: 'TCP', status: 'filtered' }
    ],
    os: 'Ubuntu 20.04.4 LTS Server',
    status: 'online',
    description: 'Hosts the fictional company intranet "NovaCorp Portal" used for web security lessons and HTTP protocol analysis.',
    securityNotes: 'Exposes simulated employee directory and legacy PHP login forms designed for authorized educational testing.'
  },
  {
    id: 'dev-dns',
    name: 'Internal DNS Nameserver',
    role: 'DNS Server',
    ip: '192.168.1.53',
    mac: '00:0C:29:D4:E5:F6',
    subnetMask: '255.255.255.0 (/24)',
    openPorts: [
      { port: 53, service: 'BIND 9.16.1 (DNS Resolver)', protocol: 'UDP', status: 'open' },
      { port: 53, service: 'BIND 9.16.1 (Zone Transfer)', protocol: 'TCP', status: 'open' },
      { port: 22, service: 'OpenSSH 8.2p1', protocol: 'TCP', status: 'open' }
    ],
    os: 'Debian 11 Bullseye Server',
    status: 'online',
    description: 'Resolves lab domain names: lab.internal, novacorp.portal, target.range. Demonstrates DNS record queries (A, AAAA, MX, TXT, PTR).',
    securityNotes: 'Demonstrates educational zone transfer queries (dig axfr @192.168.1.53 lab.internal).'
  },
  {
    id: 'dev-target',
    name: 'Target Box: "NIGHTFALL"',
    role: 'Target Host',
    ip: '192.168.1.100',
    mac: '00:0C:29:77:88:99',
    subnetMask: '255.255.255.0 (/24)',
    openPorts: [
      { port: 21, service: 'vsftpd 3.0.3 (Anonymous read enabled)', protocol: 'TCP', status: 'open' },
      { port: 22, service: 'OpenSSH 7.9p1', protocol: 'TCP', status: 'open' },
      { port: 80, service: 'nginx 1.18.0 (Nightfall API v1)', protocol: 'TCP', status: 'open' },
      { port: 8080, service: 'Apache Tomcat / Jenkins CI', protocol: 'TCP', status: 'open' }
    ],
    os: 'Alpine Linux / Custom Fictional Target',
    status: 'vulnerable',
    description: 'Intentionally vulnerable educational target machine containing simulated CTF flags and realistic privilege escalation paths.',
    securityNotes: 'Strictly sandboxed. Contains simulated user flag (/home/operator/user.txt) and root flag (/root/root.txt).'
  }
];

export const CTF_CHALLENGES: CTFChallenge[] = [
  {
    id: 'ctf-01',
    title: 'Secret in the Source',
    category: 'Web',
    difficulty: 'Beginner',
    points: 50,
    xpReward: 100,
    solvedCount: 1420,
    isSolved: true,
    description: 'A developer left sensitive staging credentials in the HTML comment of the login page. Inspect the source to recover the flag.',
    targetHint: 'Look between <!-- and --> tags in the page markup.',
    hints: [
      { text: 'Right click and choose "View Page Source" or press Ctrl+U.', xpCost: 0, unlocked: true },
      { text: 'Search for "MCL{" using Ctrl+F inside the source inspector.', xpCost: 10, unlocked: true }
    ],
    expectedFlagHash: 'MCL{welcome_to_cyber_lab_1337}',
    flagSampleFormat: 'MCL{...}'
  },
  {
    id: 'ctf-02',
    title: 'Hidden Dotfiles',
    category: 'Linux',
    difficulty: 'Beginner',
    points: 75,
    xpReward: 150,
    solvedCount: 1180,
    isSolved: true,
    description: 'A system administrator backed up a password in a hidden file inside /home/student. Can you reveal and read it?',
    targetHint: 'Standard ls command omits files beginning with a dot (.).',
    hints: [
      { text: 'Use the -a flag with the ls command to list all files.', xpCost: 0, unlocked: true },
      { text: 'The flag is stored in /home/student/.secret_flag.txt', xpCost: 15, unlocked: true }
    ],
    expectedFlagHash: 'MCL{linux_hidden_files_uncovered}',
    flagSampleFormat: 'MCL{...}'
  },
  {
    id: 'ctf-03',
    title: 'Base64 Transmission',
    category: 'Cryptography',
    difficulty: 'Beginner',
    points: 100,
    xpReward: 200,
    solvedCount: 950,
    isSolved: false,
    description: 'Intercepted string: TVFMe2Jhc2U2NF9pc19ub3RfZW5jcnlwdGlvbl9qdXN0X2VuY29kaW5nfQ==. Decode it to retrieve the flag.',
    targetHint: 'Base64 is a 64-character binary-to-text encoding scheme, recognizable by trailing "=" padding.',
    hints: [
      { text: 'In Linux CLI, run: echo "TVFMe..." | base64 -d', xpCost: 10, unlocked: false },
      { text: 'The prefix "TVFM" decodes directly to "MCL".', xpCost: 20, unlocked: false }
    ],
    expectedFlagHash: 'MCL{base64_is_not_encryption_just_encoding}',
    flagSampleFormat: 'MCL{...}'
  },
  {
    id: 'ctf-04',
    title: 'Rotten Caesar Cipher',
    category: 'Cryptography',
    difficulty: 'Easy',
    points: 120,
    xpReward: 220,
    solvedCount: 780,
    isSolved: false,
    description: 'Ciphertext: ZPY{ebg13_pvcure_vf_n_pynffvp}. The message was shifted using ROT13 substitution.',
    targetHint: 'Rotate each letter by 13 positions in the alphabet (A -> N, B -> O).',
    hints: [
      { text: 'ROT13 is symmetrical: applying ROT13 to ciphertext decrypts it.', xpCost: 15, unlocked: false }
    ],
    expectedFlagHash: 'MCL{rot13_cipher_is_a_classic}',
    flagSampleFormat: 'MCL{...}'
  },
  {
    id: 'ctf-05',
    title: 'Wireshark Packet Whisperer',
    category: 'Networking',
    difficulty: 'Easy',
    points: 150,
    xpReward: 250,
    solvedCount: 610,
    isSolved: false,
    description: 'An unencrypted HTTP GET request transmitted a secret parameter in a simulated packet capture. Filter for http.request.method == "GET".',
    targetHint: 'Inspect the URI query string in packet #42.',
    hints: [
      { text: 'Look at HTTP headers: GET /api/v1/auth?token=MCL{...}', xpCost: 25, unlocked: false }
    ],
    expectedFlagHash: 'MCL{cleartext_http_leaks_secrets}',
    flagSampleFormat: 'MCL{...}'
  },
  {
    id: 'ctf-06',
    title: 'SQLi Bypass Authentication',
    category: 'Web',
    difficulty: 'Intermediate',
    points: 200,
    xpReward: 300,
    solvedCount: 420,
    isSolved: false,
    description: 'A vulnerable login query: SELECT * FROM users WHERE user=\'$u\' AND pass=\'$p\'. Bypass password checking with classic boolean injection.',
    targetHint: 'Payload: admin\' OR \'1\'=\'1\' --',
    hints: [
      { text: 'The single quote breaks the SQL string literal, and -- comments out password validation.', xpCost: 30, unlocked: false }
    ],
    expectedFlagHash: 'MCL{sql_injection_bypassed_auth_2026}',
    flagSampleFormat: 'MCL{...}'
  },
  {
    id: 'ctf-07',
    title: 'SUID Privilege Escalation',
    category: 'Privilege Escalation',
    difficulty: 'Intermediate',
    points: 250,
    xpReward: 350,
    solvedCount: 290,
    isSolved: false,
    description: 'Find a custom binary in /opt/backup with SUID bit set (4755) owned by root that executes a relative path without full sanitization.',
    targetHint: 'Inspect binary permissions with find / -perm -4000 2>/dev/null',
    hints: [
      { text: 'Check GTFOBins or path hijacking techniques.', xpCost: 40, unlocked: false }
    ],
    expectedFlagHash: 'MCL{suid_root_execution_privesc}',
    flagSampleFormat: 'MCL{...}'
  },
  {
    id: 'ctf-08',
    title: 'Kerberoast Service Ticket',
    category: 'Active Directory',
    difficulty: 'Hard',
    points: 350,
    xpReward: 450,
    solvedCount: 140,
    isSolved: false,
    description: 'Extract and crack a Service Principal Name (SPN) Kerberos TGS-REP hash for the MSSQL service account.',
    targetHint: 'Request TGS using GetUserSPNs.py and crack with hashcat -m 13100.',
    hints: [
      { text: 'Service accounts with weak passwords can be cracked offline without sending noise to the Domain Controller.', xpCost: 50, unlocked: false }
    ],
    expectedFlagHash: 'MCL{kerberoasted_service_ticket_cracked}',
    flagSampleFormat: 'MCL{...}'
  }
];

export const CYBER_RANGE_FEATURE_LAB: CyberRangeLab = {
  id: 'lab-nightfall',
  name: 'NIGHTFALL',
  codename: 'TARGET_NIGHTFALL_LINUX',
  difficulty: 'Intermediate',
  targetType: 'Fictional Linux Enterprise Machine',
  targetIp: '10.10.14.88 (Isolated Lab VIP)',
  targetOs: 'Ubuntu 20.04 LTS (x86_64)',
  summary: 'A simulated target host representing a corporate staging API server with misconfigured FTP, exposed Swagger endpoints, and a vulnerable internal SUID backup utility.',
  scenario: `You are contracted as an authorized ethical penetration tester for NovaCorp Industries.
Your authorized scope of work is limited to the single virtual machine at IP 10.10.14.88.
Your goal is to conduct an end-to-end security assessment: discover open ports, enumerate the API, exploit a file upload flaw to obtain initial user shell access (User Flag), and perform local privilege escalation to acquire root administrator access (Root Flag).`,
  objectives: [
    { id: 'obj-1', title: 'Phase 1: Reconnaissance & Port Scanning', phase: 'Reconnaissance', completed: true },
    { id: 'obj-2', title: 'Phase 2: Service & API Enumeration', phase: 'Enumeration', completed: true },
    { id: 'obj-3', title: 'Phase 3: Identify File Upload Vulnerability', phase: 'Vulnerability Analysis', completed: false },
    { id: 'obj-4', title: 'Phase 4: Establish Initial User Access', phase: 'Initial Access', completed: false },
    { id: 'obj-5', title: 'Phase 5: Capture User Flag (/home/operator/user.txt)', phase: 'Initial Access', completed: false },
    { id: 'obj-6', title: 'Phase 6: Privilege Escalation via SUID /opt/sysbackup', phase: 'Privilege Escalation', completed: false },
    { id: 'obj-7', title: 'Phase 7: Capture Root Flag (/root/root.txt)', phase: 'Privilege Escalation', completed: false },
    { id: 'obj-8', title: 'Phase 8: Complete Remediation Report', phase: 'Post-Exploitation', completed: false }
  ],
  userFlagPoints: 250,
  rootFlagPoints: 500,
  userFlagFound: false,
  rootFlagFound: false,
  status: 'Requires Local Lab'
};

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: 'ach-first-step', code: 'ACH_FIRST_STEP', title: 'First Step', description: 'Complete your first hands-on terminal mission during onboarding.', category: 'Milestone', xp: 100, xpReward: 100, icon: 'Flag', unlocked: false },
  { id: 'ach-1', code: 'ACH_FIRST_LOGIN', title: 'Welcome Operator', description: 'Initialize your workstation identity and complete setup.', category: 'Milestone', xp: 50, xpReward: 50, icon: 'Terminal', unlocked: true, unlockedAt: '2026-08-20' },
  { id: 'ach-first-linux-cmd', code: 'ACH_FIRST_LINUX_COMMAND', title: 'First Linux Command', description: 'Execute your first interactive Linux command in the terminal or mission.', category: 'Linux', xp: 100, xpReward: 100, icon: 'Terminal', unlocked: false },
  { id: 'ach-networking-beginner', code: 'ACH_NETWORKING_BEGINNER', title: 'Networking Beginner', description: 'Explore OSI layers, IP addressing, and network devices.', category: 'Networking', xp: 150, xpReward: 150, icon: 'Network', unlocked: false },
  { id: 'ach-2', code: 'ACH_FIRST_LESSON', title: 'Knowledge Seeker', description: 'Complete your first theory and quiz lesson.', category: 'Milestone', xp: 75, xpReward: 75, icon: 'BookOpen', unlocked: true, unlockedAt: '2026-08-20' },
  { id: 'ach-3', code: 'ACH_FIRST_MISSION', title: 'Field Operative', description: 'Successfully finish Mission 01: Meet Your Machine.', category: 'Milestone', xp: 100, xpReward: 100, icon: 'CheckCircle', unlocked: true, unlockedAt: '2026-08-20' },
  { id: 'ach-4', code: 'ACH_LINUX_BEGINNER', title: 'Penguin Whisperer', description: 'Master Level 1: Linux Fundamentals and file navigation.', category: 'Linux', xp: 150, xpReward: 150, icon: 'Cpu', unlocked: true, unlockedAt: '2026-08-21' },
  { id: 'ach-5', code: 'ACH_PACKET_NAVIGATOR', title: 'Packet Navigator', description: 'Explore OSI layers, MAC addresses, and ARP resolution.', category: 'Networking', xp: 150, xpReward: 150, icon: 'Network', unlocked: true, unlockedAt: '2026-08-21' },
  { id: 'ach-6', code: 'ACH_SUBNET_COMPLETE', title: 'Subnetting Solver', description: 'Calculate 10 CIDR subnets without errors.', category: 'Networking', xp: 200, xpReward: 200, icon: 'Binary', unlocked: false, progress: 3, maxProgress: 10 },
  { id: 'ach-7', code: 'ACH_FIRST_CTF', title: 'Flag Captor', description: 'Submit your first correct CTF flag in the arena.', category: 'CTF', xp: 150, xpReward: 150, icon: 'Flag', unlocked: true, unlockedAt: '2026-08-21' },
  { id: 'ach-8', code: 'ACH_CYBER_APPRENTICE', title: 'Cyber Apprentice', description: 'Accumulate 1,000 XP and reach Cyber Level 3.', category: 'Milestone', xp: 250, xpReward: 250, icon: 'Award', unlocked: true, unlockedAt: '2026-08-21' },
  { id: 'ach-9', code: 'ACH_ETHICAL_DEFENDER', title: 'Ethical Defender', description: 'Acknowledge ethical boundaries and log Rules of Engagement.', category: 'Milestone', xp: 100, xpReward: 100, icon: 'ShieldCheck', unlocked: true, unlockedAt: '2026-08-20' },
  { id: 'ach-10', code: 'ACH_STREAK_7', title: 'Relentless Hacker', description: 'Maintain a 7-day daily cybersecurity learning streak.', category: 'Dedication', xp: 300, xpReward: 300, icon: 'Flame', unlocked: false, progress: 5, maxProgress: 7 },
  { id: 'ach-nmap-explorer', code: 'ACH_NMAP_EXPLORER', title: 'Nmap Explorer', description: 'Run network scans and inspect open ports and service banners.', category: 'Tools', xp: 175, xpReward: 175, icon: 'Radar', unlocked: false },
  { id: 'ach-packet-detective', code: 'ACH_PACKET_DETECTIVE', title: 'Packet Detective', description: 'Analyze PCAP packets and track HTTP and DNS streams in Wireshark.', category: 'Networking', xp: 200, xpReward: 200, icon: 'Radio', unlocked: false },
  { id: 'ach-web-sec-student', code: 'ACH_WEB_SECURITY_STUDENT', title: 'Web Security Student', description: 'Investigate SQL injection, XSS vulnerabilities, and OWASP top 10.', category: 'Web', xp: 200, xpReward: 200, icon: 'Globe', unlocked: false },
  { id: 'ach-ctf-beginner', code: 'ACH_CTF_BEGINNER', title: 'CTF Beginner', description: 'Solve your first 3 Capture The Flag arena challenges.', category: 'CTF', xp: 220, xpReward: 220, icon: 'Trophy', unlocked: false },
  { id: 'ach-lab-master', code: 'ACH_LAB_MASTER', title: 'Lab Master', description: 'Complete 5 hands-on terminal missions and laboratory scenarios.', category: 'Milestone', xp: 250, xpReward: 250, icon: 'Sparkles', unlocked: false },
  { id: 'ach-case-investigator', code: 'ACH_CASE_INVESTIGATOR', title: 'Case Investigator', description: 'Solve a real-world security incident case study recreation.', category: 'Forensics', xp: 300, xpReward: 300, icon: 'ShieldAlert', unlocked: false },
  { id: 'ach-cyber-range-grad', code: 'ACH_CYBER_RANGE_GRADUATE', title: 'Cyber Range Graduate', description: 'Successfully finish the capstone enterprise cyber range simulation.', category: 'Milestone', xp: 500, xpReward: 500, icon: 'Award', unlocked: false }
];

export const INITIAL_NOTEBOOK_ENTRIES: NotebookEntry[] = [
  {
    id: 'note-1',
    title: 'Essential Linux Triage Commands',
    category: 'Commands',
    content: `# Linux Quick Investigation Cheatsheet

## User & Identity
- \`whoami\` -> Output current effective username
- \`id\` -> Show UID, GID, and assigned group memberships
- \`w\` / \`who\` -> Show currently logged-in users

## File Search & SUID Binaries
- \`find / -perm -4000 2>/dev/null\` -> List SUID binaries (privesc vector)
- \`grep -rnI "password" /var/www/ 2>/dev/null\` -> Search source code recursively

## Active Network Sockets
- \`ss -tulpn\` -> List numeric listening TCP & UDP ports with process names`,
    createdAt: '2026-08-20 14:32',
    updatedAt: '2026-08-21 09:15',
    tags: ['Linux', 'Cheatsheet', 'PrivEsc']
  },
  {
    id: 'note-2',
    title: 'OSI 7 Layer Mnemonic & Port Reference',
    category: 'Concepts',
    content: `**Mnemonic (Top-down)**: **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing
- Layer 7: Application (HTTP/80, HTTPS/443, SSH/22, DNS/53)
- Layer 4: Transport (TCP vs UDP)
- Layer 3: Network (IP, ICMP)
- Layer 2: Data Link (MAC, Ethernet)

**Well-known Ports**:
- 21: FTP (Cleartext file transfer)
- 22: SSH (Encrypted remote shell)
- 25: SMTP (Mail)
- 53: DNS (Domain resolution)
- 80: HTTP (Web)`,
    createdAt: '2026-08-21 08:45',
    updatedAt: '2026-08-21 08:45',
    tags: ['Networking', 'OSI', 'Ports']
  },
  {
    id: 'note-3',
    title: 'CTF Strategy: Web Source Inspection',
    category: 'CTF Notes',
    content: `When approaching beginner Web CTFs:
1. Always view page source (Ctrl+U) for comments: \`<!-- TODO: remove test credentials -->\`
2. Check \`/robots.txt\` and \`/sitemap.xml\` for hidden directories.
3. Check HTTP Response Headers using curl -I https://target or Browser DevTools Network tab.
4. Inspect Cookies / LocalStorage for base64 encoded JSON tokens.`,
    createdAt: '2026-08-21 10:20',
    updatedAt: '2026-08-21 10:20',
    tags: ['CTF', 'Web', 'Methodology']
  }
];

export const SKILL_TREE_DATA = SKILL_TREE_NODES;

export const AI_MENTOR_PRESETS = [
  {
    id: 'p1',
    label: 'Explain Subnetting Simply',
    prompt: 'Can you explain subnetting and what /24 means using a real-world analogy?'
  },
  {
    id: 'p2',
    label: 'What is the TCP 3-Way Handshake?',
    prompt: 'Explain the SYN, SYN-ACK, ACK handshake and why it matters in port scanning.'
  },
  {
    id: 'p3',
    label: 'How does Nmap work?',
    prompt: 'What is the difference between an Nmap SYN scan (-sS) and a full Connect scan (-sT)?'
  },
  {
    id: 'p4',
    label: 'Explain in Hinglish',
    prompt: 'Ethical hacking start karne ke liye sabse pehle mujhe kya sikhna chahiye?'
  },
  {
    id: 'p5',
    label: 'Give me a practice quiz',
    prompt: 'Give me a quick 3-question quiz on Linux file permissions and chmod octal values!'
  }
];
