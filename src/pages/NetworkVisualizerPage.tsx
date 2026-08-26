import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Layers, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Server, 
  Laptop, 
  Router, 
  ShieldAlert, 
  Radio, 
  Info, 
  HelpCircle, 
  Eye,
  Key,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';

export type ProtocolType = 'TCP' | 'ARP' | 'DNS' | 'DHCP' | 'ROUTING' | 'SUBNETTING' | 'TLS' | 'HTTP';

interface PacketStep {
  stepNumber: number;
  fromNode: string;
  toNode: string;
  arrowDirection: 'right' | 'left' | 'down' | 'up';
  actionName: string;
  layer2: { srcMac: string; dstMac: string; ethertype: string };
  layer3: { srcIp: string; dstIp: string; ttl: number; protocol: string };
  layer4: { srcPort: string; dstPort: string; flags: string; seqAck: string };
  layer7Payload: string;
  explanation: string;
  securityNote: string;
}

interface ProtocolVisualizerConfig {
  id: ProtocolType;
  title: string;
  badge: string;
  nodes: { id: string; name: string; type: 'client' | 'server' | 'router' | 'switch' | 'dns'; ip: string; mac: string }[];
  steps: PacketStep[];
}

const PROTOCOL_CONFIGS: Record<ProtocolType, ProtocolVisualizerConfig> = {
  TCP: {
    id: 'TCP',
    title: 'TCP 3-Way Handshake Connection Establishment',
    badge: 'LAYER 4 TRANSPORT',
    nodes: [
      { id: 'client', name: 'Learner Workstation', type: 'client', ip: '192.168.1.50', mac: '00:1A:2B:3C:4D:5E' },
      { id: 'server', name: 'Web Server (Port 443)', type: 'server', ip: '203.0.113.10', mac: '52:54:00:12:34:56' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'Learner Workstation',
        toNode: 'Web Server (Port 443)',
        arrowDirection: 'right',
        actionName: 'SYN (Synchronize Sequence Number)',
        layer2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '52:54:00:12:34:56', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '192.168.1.50', dstIp: '203.0.113.10', ttl: 64, protocol: 'TCP (6)' },
        layer4: { srcPort: '51234', dstPort: '443', flags: '[SYN]', seqAck: 'Seq=1000, Ack=0' },
        layer7Payload: '<No Application Data (Handshake Init)>',
        explanation: 'Client sends a TCP segment with the SYN flag set and an initial sequence number (ISN = 1000). It asks the server: "I want to open a reliable stream. Can you synchronize with me?"',
        securityNote: 'DEFENSE NOTE: SYN Flood attacks overwhelm the backlog queue by sending millions of spoofed SYNs without completing the handshake. Defenses include SYN Cookies and rate limiting.'
      },
      {
        stepNumber: 2,
        fromNode: 'Web Server (Port 443)',
        toNode: 'Learner Workstation',
        arrowDirection: 'left',
        actionName: 'SYN-ACK (Synchronize + Acknowledge)',
        layer2: { srcMac: '52:54:00:12:34:56', dstMac: '00:1A:2B:3C:4D:5E', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '203.0.113.10', dstIp: '192.168.1.50', ttl: 128, protocol: 'TCP (6)' },
        layer4: { srcPort: '443', dstPort: '51234', flags: '[SYN, ACK]', seqAck: 'Seq=5000, Ack=1001' },
        layer7Payload: '<No Application Data>',
        explanation: 'Server receives the SYN, allocates a socket buffer, acknowledges client sequence (Ack=1001), and generates its own sequence number (Seq=5000).',
        securityNote: 'PORT SCAN DETECTION: In a TCP SYN scan (Half-open / nmap -sS), the scanner sends RST immediately after receiving SYN-ACK to avoid completing full connection logs.'
      },
      {
        stepNumber: 3,
        fromNode: 'Learner Workstation',
        toNode: 'Web Server (Port 443)',
        arrowDirection: 'right',
        actionName: 'ACK (Acknowledge & Established)',
        layer2: { srcMac: '00:1A:2B:3C:4D:5E', dstMac: '52:54:00:12:34:56', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '192.168.1.50', dstIp: '203.0.113.10', ttl: 64, protocol: 'TCP (6)' },
        layer4: { srcPort: '51234', dstPort: '443', flags: '[ACK]', seqAck: 'Seq=1001, Ack=5001' },
        layer7Payload: '<Ready for TLS ClientHello or HTTP GET>',
        explanation: 'Client acknowledges server sequence (Ack=5001). The TCP socket transitions to ESTABLISHED state on both endpoints. Data transmission can now commence.',
        securityNote: 'SESSION HIJACKING: If an adversary can accurately predict TCP sequence numbers, they could inject arbitrary packets into an established unencrypted connection.'
      }
    ]
  },
  ARP: {
    id: 'ARP',
    title: 'ARP (Address Resolution Protocol) Broadcast & Resolution',
    badge: 'LAYER 2 / LAYER 3 BINDING',
    nodes: [
      { id: 'client', name: 'Host A', type: 'client', ip: '192.168.1.10', mac: 'AA:BB:CC:11:22:33' },
      { id: 'switch', name: 'Layer 2 Switch', type: 'switch', ip: '192.168.1.254', mac: 'FF:FF:FF:FF:FF:FF' },
      { id: 'target', name: 'Host B (Target)', type: 'server', ip: '192.168.1.20', mac: 'DD:EE:FF:44:55:66' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'Host A',
        toNode: 'Broadcast to all (Switch)',
        arrowDirection: 'right',
        actionName: 'ARP Request (Who has 192.168.1.20? Tell 192.168.1.10)',
        layer2: { srcMac: 'AA:BB:CC:11:22:33', dstMac: 'FF:FF:FF:FF:FF:FF (Broadcast)', ethertype: 'ARP (0x0806)' },
        layer3: { srcIp: '192.168.1.10', dstIp: '192.168.1.20', ttl: 1, protocol: 'ARP Operation 1 (Request)' },
        layer4: { srcPort: 'N/A', dstPort: 'N/A', flags: 'N/A', seqAck: 'N/A' },
        layer7Payload: 'Sender MAC: AA:BB:CC:11:22:33 | Target IP: 192.168.1.20',
        explanation: 'Host A knows the destination IP (192.168.1.20) but needs its Layer 2 MAC address to encapsulate the Ethernet frame. It sends an Ethernet broadcast (FF:FF:FF:FF:FF:FF) received by every device on the LAN.',
        securityNote: 'ARP POISONING / SPOOFING: Because ARP is stateless and unauthenticated, an attacker on the same broadcast domain can respond with their own MAC to execute a Man-in-the-Middle (MITM) attack. Use Dynamic ARP Inspection (DAI) on switches.'
      },
      {
        stepNumber: 2,
        fromNode: 'Host B (Target)',
        toNode: 'Host A',
        arrowDirection: 'left',
        actionName: 'ARP Reply (192.168.1.20 is at DD:EE:FF:44:55:66)',
        layer2: { srcMac: 'DD:EE:FF:44:55:66', dstMac: 'AA:BB:CC:11:22:33', ethertype: 'ARP (0x0806)' },
        layer3: { srcIp: '192.168.1.20', dstIp: '192.168.1.10', ttl: 1, protocol: 'ARP Operation 2 (Reply)' },
        layer4: { srcPort: 'N/A', dstPort: 'N/A', flags: 'N/A', seqAck: 'N/A' },
        layer7Payload: 'Sender MAC: DD:EE:FF:44:55:66 | Target IP: 192.168.1.10',
        explanation: 'Only Host B recognizes its own IP. It caches Host A MAC and sends a direct unicast reply: "192.168.1.20 is at DD:EE:FF:44:55:66". Host A stores this in its local ARP cache table (viewable with "arp -a" or "ip neigh").',
        securityNote: 'DEFENSE AUDIT: Check your ARP table with "ip neigh" to verify no duplicate MAC addresses exist for your default gateway.'
      }
    ]
  },
  DNS: {
    id: 'DNS',
    title: 'DNS Resolution Query & Response Flow',
    badge: 'LAYER 7 APPLICATION / UDP 53',
    nodes: [
      { id: 'client', name: 'Client Resolver', type: 'client', ip: '192.168.1.50', mac: '00:11:22:33:44:55' },
      { id: 'resolver', name: 'Recursive Resolver (8.8.8.8)', type: 'dns', ip: '8.8.8.8', mac: '66:77:88:99:AA:BB' },
      { id: 'auth', name: 'Authoritative Nameserver', type: 'server', ip: '198.51.100.5', mac: 'CC:DD:EE:FF:00:11' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'Client Resolver',
        toNode: 'Recursive Resolver (8.8.8.8)',
        arrowDirection: 'right',
        actionName: 'Standard Query: A record for "mycyberlab.internal"',
        layer2: { srcMac: '00:11:22:33:44:55', dstMac: 'Router MAC', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '192.168.1.50', dstIp: '8.8.8.8', ttl: 64, protocol: 'UDP (17)' },
        layer4: { srcPort: '58412', dstPort: '53', flags: '[QR=0, RD=1]', seqAck: 'TxID: 0x4A1F' },
        layer7Payload: 'Question: mycyberlab.internal, Type: A (IPv4)',
        explanation: 'The client checks local cache and /etc/hosts. If missing, it sends a UDP DNS query with the Recursion Desired (RD=1) flag to its configured DNS server.',
        securityNote: 'DNS TUNNELING: Attackers can encode exfiltrated data or C2 commands inside subdomains (e.g. data.attacker.com) over port 53. Monitor DNS query lengths and entropy.'
      },
      {
        stepNumber: 2,
        fromNode: 'Recursive Resolver (8.8.8.8)',
        toNode: 'Client Resolver',
        arrowDirection: 'left',
        actionName: 'Standard Response: A 10.10.14.50 (TTL=300)',
        layer2: { srcMac: 'Router MAC', dstMac: '00:11:22:33:44:55', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '8.8.8.8', dstIp: '192.168.1.50', ttl: 58, protocol: 'UDP (17)' },
        layer4: { srcPort: '53', dstPort: '58412', flags: '[QR=1, RA=1]', seqAck: 'TxID: 0x4A1F' },
        layer7Payload: 'Answer: mycyberlab.internal -> 10.10.14.50 (TTL=300s)',
        explanation: 'The resolver returns the IPv4 address. The client caches this for the TTL duration and can now initiate TCP handshakes directly to 10.10.14.50.',
        securityNote: 'DNS CACHE POISONING (Kaminsky attack): Injecting fraudulent DNS records into a resolver cache redirects users to phishing servers. Defend with DNSSEC.'
      }
    ]
  },
  DHCP: {
    id: 'DHCP',
    title: 'DHCP 4-Way Handshake (D.O.R.A.)',
    badge: 'LAYER 7 / UDP 67/68',
    nodes: [
      { id: 'client', name: 'New Workstation (Unconfigured)', type: 'client', ip: '0.0.0.0', mac: 'E0:D5:5E:66:77:88' },
      { id: 'server', name: 'DHCP Server & Gateway', type: 'server', ip: '192.168.1.1', mac: '00:50:56:C0:00:08' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'New Workstation',
        toNode: 'Broadcast to LAN',
        arrowDirection: 'right',
        actionName: 'DISCOVER (Broadcast to find DHCP servers)',
        layer2: { srcMac: 'E0:D5:5E:66:77:88', dstMac: 'FF:FF:FF:FF:FF:FF', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '0.0.0.0', dstIp: '255.255.255.255', ttl: 128, protocol: 'UDP (17)' },
        layer4: { srcPort: '68 (BootP Client)', dstPort: '67 (BootP Server)', flags: 'Broadcast', seqAck: 'TxID: 0x7B291' },
        layer7Payload: 'DHCP Message Type: Discover | Client MAC: E0:D5:5E:66:77:88',
        explanation: 'Workstation powers on with no IP address (0.0.0.0) and sends a broadcast asking: "Is there any DHCP server on this network that can lease me an IP?"',
        securityNote: 'ROGUE DHCP ATTACK: An attacker can deploy a rogue DHCP server on the LAN to hand out malicious DNS servers or set itself as the default gateway.'
      },
      {
        stepNumber: 2,
        fromNode: 'DHCP Server',
        toNode: 'New Workstation',
        arrowDirection: 'left',
        actionName: 'OFFER (Proposing IP 192.168.1.105, Mask 255.255.255.0)',
        layer2: { srcMac: '00:50:56:C0:00:08', dstMac: 'FF:FF:FF:FF:FF:FF', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '192.168.1.1', dstIp: '255.255.255.255', ttl: 64, protocol: 'UDP (17)' },
        layer4: { srcPort: '67', dstPort: '68', flags: 'Broadcast', seqAck: 'TxID: 0x7B291' },
        layer7Payload: 'Offered IP: 192.168.1.105 | Mask: /24 | Gateway: 192.168.1.1 | DNS: 1.1.1.1 | Lease: 86400s',
        explanation: 'DHCP server checks its pool, reserves 192.168.1.105, and sends an OFFER containing IP, subnet mask, default gateway, and DNS servers.',
        securityNote: 'DHCP SNOOPING: Enterprise switches use DHCP Snooping to designate trusted switchports for valid DHCP servers and block unauthorized server replies.'
      },
      {
        stepNumber: 3,
        fromNode: 'New Workstation',
        toNode: 'DHCP Server',
        arrowDirection: 'right',
        actionName: 'REQUEST (Accepting 192.168.1.105 lease)',
        layer2: { srcMac: 'E0:D5:5E:66:77:88', dstMac: 'FF:FF:FF:FF:FF:FF', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '0.0.0.0', dstIp: '255.255.255.255', ttl: 128, protocol: 'UDP (17)' },
        layer4: { srcPort: '68', dstPort: '67', flags: 'Broadcast', seqAck: 'TxID: 0x7B291' },
        layer7Payload: 'Requested IP: 192.168.1.105 | Server ID: 192.168.1.1',
        explanation: 'Workstation sends a broadcast REQUEST: "I accept the lease for 192.168.1.105 from server 192.168.1.1". Broadcasting notifies any other DHCP servers that their offers were not chosen.',
        securityNote: 'DHCP STARVATION: An attacker floods the network with thousands of fake MAC addresses requesting leases until the entire pool is exhausted.'
      },
      {
        stepNumber: 4,
        fromNode: 'DHCP Server',
        toNode: 'New Workstation',
        arrowDirection: 'left',
        actionName: 'ACKNOWLEDGE (Lease finalized & confirmed)',
        layer2: { srcMac: '00:50:56:C0:00:08', dstMac: 'E0:D5:5E:66:77:88', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '192.168.1.1', dstIp: '192.168.1.105', ttl: 64, protocol: 'UDP (17)' },
        layer4: { srcPort: '67', dstPort: '68', flags: 'Unicast', seqAck: 'TxID: 0x7B291' },
        layer7Payload: 'Lease Confirmed for 192.168.1.105 | Expiry: 24h',
        explanation: 'DHCP server commits the lease in its binding database and sends the ACK. The workstation binds 192.168.1.105 to its interface.',
        securityNote: 'COMPLETE D.O.R.A.: Discover → Offer → Request → Acknowledge.'
      }
    ]
  },
  ROUTING: {
    id: 'ROUTING',
    title: 'Layer 3 IP Routing & TTL Decrement Inspection',
    badge: 'LAYER 3 PACKET FORWARDING',
    nodes: [
      { id: 'host1', name: 'Subnet A Client', type: 'client', ip: '10.0.1.10', mac: 'AA:11:11:11:11:11' },
      { id: 'rtr', name: 'Enterprise Core Router', type: 'router', ip: '10.0.1.1 & 10.0.2.1', mac: 'RR:22:22:22:22:22' },
      { id: 'host2', name: 'Subnet B Server', type: 'server', ip: '10.0.2.50', mac: 'BB:33:33:33:33:33' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'Subnet A Client',
        toNode: 'Enterprise Core Router (Default Gateway)',
        arrowDirection: 'right',
        actionName: 'Hop 1: Subnet A Ingress (TTL=64)',
        layer2: { srcMac: 'AA:11:11:11:11:11', dstMac: 'RR:22:22:22:22:22 (Router)', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '10.0.1.10', dstIp: '10.0.2.50', ttl: 64, protocol: 'ICMP / TCP' },
        layer4: { srcPort: '49152', dstPort: '80', flags: 'SYN', seqAck: 'Seq=100' },
        layer7Payload: 'Destination in different subnet -> Send to Router MAC',
        explanation: 'Client evaluates destination IP (10.0.2.50). Its subnet mask reveals the destination is outside Subnet A. It encapsulates the packet with the MAC of its default gateway (RR:22:22:22:22:22) while preserving the original Destination IP (10.0.2.50).',
        securityNote: 'TIME-TO-LIVE (TTL): Every router decrements the TTL by 1. If TTL hits 0, the router drops the packet and returns "ICMP Time Exceeded" to prevent infinite routing loops.'
      },
      {
        stepNumber: 2,
        fromNode: 'Enterprise Core Router',
        toNode: 'Subnet B Server',
        arrowDirection: 'right',
        actionName: 'Hop 2: MAC Rewrite + TTL Decrement (TTL=63)',
        layer2: { srcMac: 'RR:22:22:22:22:22 (Router)', dstMac: 'BB:33:33:33:33:33 (Target)', ethertype: 'IPv4 (0x0800)' },
        layer3: { srcIp: '10.0.1.10 (Preserved)', dstIp: '10.0.2.50 (Preserved)', ttl: 63, protocol: 'ICMP / TCP' },
        layer4: { srcPort: '49152', dstPort: '80', flags: 'SYN', seqAck: 'Seq=100' },
        layer7Payload: 'Forwarded into Subnet B broadcast domain',
        explanation: 'KEY ROUTING LAW: Layer 2 MAC addresses change at every router hop (MAC Rewrite), but Layer 3 IP addresses remain constant end-to-end (unless NAT is applied). TTL is decremented from 64 to 63.',
        securityNote: 'TRACEROUTE RECONNAISSANCE: Traceroute discovers all intermediate routers by sending packets with incrementing TTLs (TTL=1, TTL=2, TTL=3) and collecting ICMP Time Exceeded replies.'
      }
    ]
  },
  SUBNETTING: {
    id: 'SUBNETTING',
    title: 'Subnet Mask & Bitwise AND Logical Inspection',
    badge: 'NETWORK ARCHITECTURE',
    nodes: [
      { id: 'client', name: 'Workstation', type: 'client', ip: '192.168.1.130/25', mac: '11:22:33:44:55:66' },
      { id: 'mask', name: 'Bitwise AND Engine', type: 'server', ip: 'Mask: 255.255.255.128', mac: '00:00:00:00:00:00' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'Workstation',
        toNode: 'Bitwise AND Engine',
        arrowDirection: 'right',
        actionName: 'Step 1: Convert IP & Subnet Mask to Binary',
        layer2: { srcMac: '11:22:33:44:55:66', dstMac: 'Broadcast', ethertype: 'IPv4' },
        layer3: { srcIp: '192.168.1.130', dstIp: '255.255.255.128 (/25)', ttl: 64, protocol: 'Logic' },
        layer4: { srcPort: 'N/A', dstPort: 'N/A', flags: 'N/A', seqAck: 'N/A' },
        layer7Payload: 'IP:   11000000.10101000.00000001.10000010\nMask: 11000000.10101000.00000001.10000000',
        explanation: 'A computer determines whether a destination IP is local or remote by performing a bitwise AND operation between the IP address and its subnet mask.',
        securityNote: 'NETWORK SEGMENTATION: Dividing a large flat network into isolated /26, /27, or /28 subnets prevents lateral movement by ransomware and malicious actors.'
      },
      {
        stepNumber: 2,
        fromNode: 'Bitwise AND Engine',
        toNode: 'Workstation',
        arrowDirection: 'left',
        actionName: 'Step 2: Calculate Network ID, Broadcast & Range',
        layer2: { srcMac: 'Logic Engine', dstMac: '11:22:33:44:55:66', ethertype: 'IPv4' },
        layer3: { srcIp: 'Net ID: 192.168.1.128', dstIp: 'Broadcast: 192.168.1.255', ttl: 64, protocol: 'Result' },
        layer4: { srcPort: 'N/A', dstPort: 'N/A', flags: 'N/A', seqAck: 'N/A' },
        layer7Payload: 'Network ID: 192.168.1.128\nFirst Usable: 192.168.1.129\nLast Usable: 192.168.1.254\nBroadcast: 192.168.1.255\nTotal Usable: 126 Hosts',
        explanation: 'For /25 prefix: 25 network bits and 7 host bits (2^7 = 128 total addresses). Minus Network ID (first) and Broadcast (last) = 126 usable host slots.',
        securityNote: 'DEFENSE RULE: Never assign the Network ID (.128) or Broadcast address (.255) to a host device.'
      }
    ]
  },
  TLS: {
    id: 'TLS',
    title: 'TLS 1.3 Cryptographic Handshake',
    badge: 'LAYER 5/6 SESSION CRYPTOGRAPHY',
    nodes: [
      { id: 'client', name: 'Browser Client', type: 'client', ip: '192.168.1.50', mac: '00:AA:BB:CC:DD:EE' },
      { id: 'server', name: 'Secure Web Server (HTTPS)', type: 'server', ip: '104.21.44.8', mac: '52:54:00:AA:BB:CC' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'Browser Client',
        toNode: 'Secure Web Server (HTTPS)',
        arrowDirection: 'right',
        actionName: 'ClientHello (Cipher Suites + Key Share)',
        layer2: { srcMac: '00:AA:BB:CC:DD:EE', dstMac: 'Router MAC', ethertype: 'IPv4' },
        layer3: { srcIp: '192.168.1.50', dstIp: '104.21.44.8', ttl: 64, protocol: 'TCP (6)' },
        layer4: { srcPort: '54321', dstPort: '443', flags: '[PSH, ACK]', seqAck: 'Seq=1, Ack=1' },
        layer7Payload: 'TLS 1.3 | Supported Ciphers: TLS_AES_256_GCM_SHA384 | Client Diffie-Hellman Key Share',
        explanation: 'In TLS 1.3, the client sends its supported cipher suites AND its Diffie-Hellman ephemeral key share in the very first packet (1-RTT handshake efficiency).',
        securityNote: 'DOWNGRADE ATTACKS: Attackers try to force clients into using deprecated protocols (SSL 3.0, TLS 1.0) with known weaknesses like POODLE or BEAST.'
      },
      {
        stepNumber: 2,
        fromNode: 'Secure Web Server',
        toNode: 'Browser Client',
        arrowDirection: 'left',
        actionName: 'ServerHello + Certificate + Finished',
        layer2: { srcMac: 'Router MAC', dstMac: '00:AA:BB:CC:DD:EE', ethertype: 'IPv4' },
        layer3: { srcIp: '104.21.44.8', dstIp: '192.168.1.50', ttl: 55, protocol: 'TCP (6)' },
        layer4: { srcPort: '443', dstPort: '54321', flags: '[PSH, ACK]', seqAck: 'Seq=1, Ack=200' },
        layer7Payload: 'Server Key Share + X.509 Digital Certificate (RSA/ECDSA) + CertificateVerify',
        explanation: 'Server selects the cipher, computes the shared symmetric session key using the Diffie-Hellman key share, presents its X.509 Certificate, and completes the handshake.',
        securityNote: 'CERTIFICATE VALIDATION: The client cryptographically validates that the certificate was signed by a trusted Certificate Authority (CA) and has not expired.'
      },
      {
        stepNumber: 3,
        fromNode: 'Browser Client',
        toNode: 'Secure Web Server',
        arrowDirection: 'right',
        actionName: 'Encrypted Application Data (AES-GCM)',
        layer2: { srcMac: '00:AA:BB:CC:DD:EE', dstMac: 'Router MAC', ethertype: 'IPv4' },
        layer3: { srcIp: '192.168.1.50', dstIp: '104.21.44.8', ttl: 64, protocol: 'TCP (6)' },
        layer4: { srcPort: '54321', dstPort: '443', flags: '[PSH, ACK]', seqAck: 'Seq=200, Ack=800' },
        layer7Payload: '🔒 Encrypted HTTP GET /dashboard Payload (Confidentiality & Integrity Guaranteed)',
        explanation: 'All subsequent HTTP traffic is fully encrypted using AES-GCM or ChaCha20-Poly1305. Eavesdroppers on the wire only see ciphertext.',
        securityNote: 'PERFECT FORWARD SECRECY (PFS): Even if the server private key is stolen in the future, past recorded traffic sessions cannot be decrypted.'
      }
    ]
  },
  HTTP: {
    id: 'HTTP',
    title: 'HTTP / HTTPS Request & Response Lifecycle',
    badge: 'LAYER 7 APPLICATION DATA',
    nodes: [
      { id: 'client', name: 'Web Client / Curl', type: 'client', ip: '192.168.1.50', mac: 'AA:BB:CC:11:22:33' },
      { id: 'server', name: 'App Web Server (Apache/Nginx)', type: 'server', ip: '10.10.14.80', mac: '52:54:00:99:88:77' }
    ],
    steps: [
      {
        stepNumber: 1,
        fromNode: 'Web Client / Curl',
        toNode: 'App Web Server',
        arrowDirection: 'right',
        actionName: 'HTTP GET /api/telemetry (Host: target.local)',
        layer2: { srcMac: 'AA:BB:CC:11:22:33', dstMac: '52:54:00:99:88:77', ethertype: 'IPv4' },
        layer3: { srcIp: '192.168.1.50', dstIp: '10.10.14.80', ttl: 64, protocol: 'TCP (6)' },
        layer4: { srcPort: '52011', dstPort: '80', flags: '[PSH, ACK]', seqAck: 'Seq=10, Ack=10' },
        layer7Payload: 'GET /api/telemetry HTTP/1.1\nHost: target.local\nUser-Agent: MyCyberLab-Client/2.0\nAccept: application/json',
        explanation: 'Client sends an HTTP request specifying the method (GET), resource path (/api/telemetry), HTTP version, and request headers.',
        securityNote: 'WEB RECONNAISSANCE: Attackers inspect User-Agent, Content-Type, and HTTP headers to detect technologies, frameworks, and WAF rules.'
      },
      {
        stepNumber: 2,
        fromNode: 'App Web Server',
        toNode: 'Web Client / Curl',
        arrowDirection: 'left',
        actionName: 'HTTP 200 OK + Security Headers + JSON Body',
        layer2: { srcMac: '52:54:00:99:88:77', dstMac: 'AA:BB:CC:11:22:33', ethertype: 'IPv4' },
        layer3: { srcIp: '10.10.14.80', dstIp: '192.168.1.50', ttl: 128, protocol: 'TCP (6)' },
        layer4: { srcPort: '80', dstPort: '52011', flags: '[PSH, ACK]', seqAck: 'Seq=10, Ack=150' },
        layer7Payload: 'HTTP/1.1 200 OK\nContent-Type: application/json\nContent-Security-Policy: default-src \'self\'\nX-Frame-Options: DENY\n\n{"status":"active","telemetry":"nominal"}',
        explanation: 'Server processes the request, returns the status code (200 OK), essential security headers (CSP, X-Frame-Options), and the response body payload.',
        securityNote: 'DEFENSIVE HARDENING: Always configure defensive HTTP headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), and X-Content-Type-Options: nosniff.'
      }
    ]
  }
};

export const NetworkVisualizerPage: React.FC = () => {
  const [activeProtocol, setActiveProtocol] = useState<ProtocolType>('TCP');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMs, setSpeedMs] = useState<number>(2500);

  const config = PROTOCOL_CONFIGS[activeProtocol];
  const currentStep = config.steps[currentStepIndex] || config.steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= config.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, config.steps.length, speedMs]);

  const handleSelectProtocol = (p: ProtocolType) => {
    setActiveProtocol(p);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleNextStep = () => {
    if (currentStepIndex < config.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold">
            <Network className="w-3.5 h-3.5" /> INTERACTIVE PACKET FLOW & PROTOCOL VISUALIZER
          </div>
          <h1 className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-tight">
            Animated Packet Diagnostics & Anatomy
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Inspect real animated packet transmissions across OSI Layer 2 (Data Link), Layer 3 (Network IP), Layer 4 (Transport Sockets), and Layer 7 (Application Payload). Step frame-by-frame and study live protocol mechanics and defensive security implications.
          </p>
        </div>
      </div>

      {/* Protocol Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto">
        {(Object.keys(PROTOCOL_CONFIGS) as ProtocolType[]).map((protoKey) => {
          const isSelected = activeProtocol === protoKey;
          return (
            <button
              key={protoKey}
              onClick={() => handleSelectProtocol(protoKey)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap font-bold flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{protoKey}</span>
              <span className="text-[10px] opacity-75">
                ({PROTOCOL_CONFIGS[protoKey].steps.length} Steps)
              </span>
            </button>
          );
        })}
      </div>

      {/* STAGE & ANIMATED TOPOLOGY */}
      <div className="rounded-3xl bg-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Stage Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider uppercase block">
              {config.badge}
            </span>
            <h2 className="text-xl font-mono font-bold text-white">
              {config.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Step</span>
            <span className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
              {currentStepIndex + 1} of {config.steps.length}
            </span>
          </div>
        </div>

        {/* TOPOLOGY NODES CANVAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center py-6">
          
          {/* Node 1 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Laptop className="w-6 h-6" />
            </div>
            <div className="font-mono text-sm font-bold text-white">
              {config.nodes[0]?.name}
            </div>
            <div className="font-mono text-[11px] text-cyan-300">
              IP: {config.nodes[0]?.ip}
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              MAC: {config.nodes[0]?.mac}
            </div>
          </div>

          {/* Center: Live Flow & Animated Packet Arrow */}
          <div className="flex flex-col items-center justify-center p-4 space-y-3 text-center">
            
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {currentStep.actionName}
            </div>

            {/* Directional arrow animation */}
            <div className="w-full flex items-center justify-center gap-2 py-2">
              {currentStep.arrowDirection === 'right' ? (
                <div className="flex items-center gap-1 text-cyan-400 font-mono font-bold text-sm animate-pulse">
                  <span>TRANSMITTING</span>
                  <ArrowRight className="w-5 h-5 text-cyan-400 animate-bounce" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-emerald-400 font-mono font-bold text-sm animate-pulse">
                  <ArrowRight className="w-5 h-5 text-emerald-400 rotate-180 animate-bounce" />
                  <span>RETURNING</span>
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              From: <strong className="text-slate-200">{currentStep.fromNode}</strong> → To: <strong className="text-slate-200">{currentStep.toNode}</strong>
            </div>

          </div>

          {/* Node 2 (Server / Target / Router) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center text-center space-y-2 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Server className="w-6 h-6" />
            </div>
            <div className="font-mono text-sm font-bold text-white">
              {config.nodes[config.nodes.length - 1]?.name}
            </div>
            <div className="font-mono text-[11px] text-emerald-300">
              IP: {config.nodes[config.nodes.length - 1]?.ip}
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              MAC: {config.nodes[config.nodes.length - 1]?.mac}
            </div>
          </div>

        </div>

        {/* CONTROLS BAR: Play, Pause, Step, Reset, Speed */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          
          <div className="flex items-center gap-2">
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                isPlaying
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:opacity-90'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> PAUSE FLOW
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> START AUTO-PLAY
                </>
              )}
            </button>

            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold cursor-pointer disabled:opacity-40"
            >
              ← PREV STEP
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex >= config.steps.length - 1}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold cursor-pointer disabled:opacity-40 flex items-center gap-1"
            >
              <span>NEXT STEP</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 cursor-pointer"
              title="Reset to step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Playback Speed:</span>
            <select
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value={4000}>0.5x (Slow - Study)</option>
              <option value={2500}>1.0x (Normal)</option>
              <option value={1200}>2.0x (Fast)</option>
            </select>
          </div>

        </div>

        {/* PACKET HEADER INSPECTOR (OSI LAYER BREAKDOWN) */}
        <div className="space-y-4 pt-2">
          
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase flex items-center gap-2">
              <Layers className="w-4 h-4" /> LIVE PACKET HEADER INSPECTOR (OSI LAYERS 2 - 7)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Captured Frame #{currentStep.stepNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
            
            {/* Layer 2: Data Link */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> LAYER 2: ETHERNET FRAME
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div><span className="text-slate-500">Src MAC:</span> {currentStep.layer2.srcMac}</div>
                <div><span className="text-slate-500">Dst MAC:</span> {currentStep.layer2.dstMac}</div>
                <div><span className="text-slate-500">EtherType:</span> {currentStep.layer2.ethertype}</div>
              </div>
            </div>

            {/* Layer 3: Network IP */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> LAYER 3: IPv4 PACKET
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div><span className="text-slate-500">Src IP:</span> <strong className="text-slate-200">{currentStep.layer3.srcIp}</strong></div>
                <div><span className="text-slate-500">Dst IP:</span> <strong className="text-slate-200">{currentStep.layer3.dstIp}</strong></div>
                <div><span className="text-slate-500">TTL:</span> {currentStep.layer3.ttl} • Protocol: {currentStep.layer3.protocol}</div>
              </div>
            </div>

            {/* Layer 4: Transport TCP/UDP */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-[10px] text-purple-400 font-bold uppercase flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" /> LAYER 4: TRANSPORT SEGMENT
              </div>
              <div className="space-y-1 text-slate-300 text-[11px]">
                <div><span className="text-slate-500">Src Port:</span> {currentStep.layer4.srcPort} → <span className="text-slate-500">Dst Port:</span> {currentStep.layer4.dstPort}</div>
                <div><span className="text-slate-500">Flags:</span> <span className="text-amber-300 font-bold">{currentStep.layer4.flags}</span></div>
                <div><span className="text-slate-500">Seq/Ack:</span> {currentStep.layer4.seqAck}</div>
              </div>
            </div>

          </div>

          {/* Layer 7: Application Payload */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> LAYER 7: APPLICATION DATA PAYLOAD
            </div>
            <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-200 font-mono whitespace-pre-wrap overflow-x-auto">
              {currentStep.layer7Payload}
            </pre>
          </div>

        </div>

        {/* EDUCATIONAL BREAKDOWN & DEFENSIVE SECURITY NOTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 font-bold uppercase flex items-center gap-1.5">
              <Info className="w-4 h-4" /> WHAT JUST HAPPENED? (PLAIN ENGLISH)
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
              {currentStep.explanation}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
            <h4 className="text-xs font-mono text-rose-400 font-bold uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> CYBER DEFENSE & THREAT IMPLICATION
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
              {currentStep.securityNote}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
