/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/safety/LabScopeEnforcer.ts
 * Purpose: Strict Scope Policy Enforcement, Egress Control, and Anti-Targeting Security Boundary
 */

import { LabScopePolicy, ScopeValidationResult, RulesOfEngagement } from '../types';

export class LabScopeEnforcer {
  private static readonly DEFAULT_SAFE_COMMANDS = new Set([
    'help', 'clear', 'pwd', 'ls', 'cat', 'whoami', 'id', 'uname',
    'ip', 'ifconfig', 'ss', 'netstat', 'ps', 'grep', 'find', 'echo',
    'date', 'history', 'reset', 'exit', 'cd', 'head', 'tail', 'wc',
    'diff', 'file', 'strings', 'base64', 'tr', 'cut', 'awk', 'sed',
    'sort', 'uniq', 'md5sum', 'sha256sum', 'tree'
  ]);

  private static readonly BLOCKED_PATTERNS = [
    'rm -rf /',
    'rm -rf /*',
    ':(){ :|:& };:',
    'mkfs',
    'dd if=/dev/zero',
    'chmod 777 /',
    'chmod -R 777 /',
    '/etc/shadow',
    'process.env',
    'import.meta',
    'api_key',
    'gemini_api_key',
    'firebase_config',
    'gcloud auth',
    'docker.sock',
    '/var/run/docker.sock'
  ];

  /**
   * Evaluates if an IPv4 address or CIDR range is mathematically contained inside an authorized CIDR.
   */
  public static isIpInCidr(targetIpOrCidr: string, authorizedCidr: string): boolean {
    try {
      const cleanTarget = targetIpOrCidr.trim().split('/')[0];
      const cleanAuthorized = authorizedCidr.trim();

      if (!cleanAuthorized.includes('/')) {
        return cleanTarget === cleanAuthorized;
      }

      const [range, bitsStr] = cleanAuthorized.split('/');
      const bits = parseInt(bitsStr, 10);
      if (isNaN(bits) || bits < 0 || bits > 32) return false;

      const ipToLong = (addr: string): number => {
        const octets = addr.split('.').map(o => parseInt(o, 10));
        if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
          throw new Error('Invalid IP format');
        }
        return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
      };

      const ipLong = ipToLong(cleanTarget);
      const rangeLong = ipToLong(range);
      const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;

      return (ipLong & mask) === (rangeLong & mask);
    } catch {
      return false;
    }
  }

  /**
   * Parses command tokens to extract potential remote target IPs, hostnames, and domain names.
   */
  public static extractTargetsFromCommandLine(command: string): string[] {
    const targets: string[] = [];
    const tokens = command.trim().split(/\s+/);

    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/;
    const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}$/;
    const labHostRegex = /^[a-zA-Z0-9-_]+\.(?:internal|lab|local|corp)$/i;

    for (let i = 1; i < tokens.length; i++) {
      let token = tokens[i].replace(/[;,|&"']/g, '');
      if (!token || token.startsWith('-')) continue;

      // Clean protocol prefixes
      token = token.replace(/^https?:\/\//i, '').replace(/^ftp:\/\//i, '').replace(/^ssh:\/\//i, '');
      const hostOnly = token.split('/')[0].split(':')[0];

      if (ipv4Regex.test(hostOnly) || domainRegex.test(hostOnly) || labHostRegex.test(hostOnly)) {
        targets.push(hostOnly);
      }
    }

    return targets;
  }

  /**
   * Validates a command against the authoritative Rules of Engagement (RoE).
   * DENY BY DEFAULT: Strict containment inside the authorized range.
   */
  public static validateCommand(
    command: string,
    roe: RulesOfEngagement | null,
    customPolicy?: Partial<LabScopePolicy>
  ): ScopeValidationResult {
    const trimmed = (command || '').trim();
    if (!trimmed) {
      return { allowed: true, category: 'SAFE' };
    }

    const parts = trimmed.split(/\s+/);
    const baseCmd = parts[0].toLowerCase();
    const lowerFullCmd = trimmed.toLowerCase();

    // 1. Check Destructive / Sandbox escape patterns
    for (const blocked of this.BLOCKED_PATTERNS) {
      if (lowerFullCmd.includes(blocked)) {
        return {
          allowed: false,
          category: 'BLOCKED',
          violationCode: 'DESTRUCTIVE_ACTION',
          reason: `SECURITY POLICY VIOLATION: Execution of potentially destructive system command or secret extraction attempt [${blocked}] is prohibited.`
        };
      }
    }

    // 2. Safe local execution (no network activity)
    if (this.DEFAULT_SAFE_COMMANDS.has(baseCmd)) {
      if (!trimmed.includes('ping') && !trimmed.includes('curl') && !trimmed.includes('wget') && !trimmed.includes('nc') && !trimmed.includes('nmap')) {
        return { allowed: true, category: 'SAFE' };
      }
    }

    // 3. Network interaction tools
    const networkTools = [
      'nmap', 'ping', 'curl', 'wget', 'nc', 'netcat', 'dig', 'nslookup', 'host', 'ssh',
      'traceroute', 'ss', 'arp', 'redis-cli', 'ldapsearch', 'smbclient', 'crackmapexec',
      'bloodhound-python', 'getuserspns.py', 'impacket-getuserspns', 'chisel', 'enum4linux'
    ];
    if (networkTools.includes(baseCmd)) {
      if (!roe) {
        return {
          allowed: false,
          category: 'BLOCKED',
          violationCode: 'OUT_OF_SCOPE_TARGET',
          reason: 'DENY BY DEFAULT: No active Rules of Engagement (RoE) established for this session. Target authorization required.'
        };
      }

      const extractedTargets = this.extractTargetsFromCommandLine(trimmed);

      // Utility help flags (e.g. `nmap --help`, `curl -V`) without targets are safe
      if (extractedTargets.length === 0) {
        return { allowed: true, category: 'SAFE' };
      }

      for (const target of extractedTargets) {
        // Allow loopback
        if (target === '127.0.0.1' || target === 'localhost' || target === '0.0.0.0') {
          continue;
        }

        // Check prohibited list
        const isProhibited = roe.prohibitedScope.some(p => {
          const pLower = p.toLowerCase();
          if (pLower.startsWith('any ip outside') || pLower.startsWith('public internet')) return false;
          if (pLower === target.toLowerCase()) return true;
          return this.isIpInCidr(target, p);
        });

        if (isProhibited) {
          return {
            allowed: false,
            category: 'BLOCKED',
            violationCode: 'OUT_OF_SCOPE_TARGET',
            sanitizedTarget: target,
            reason: `RULES OF ENGAGEMENT VIOLATION: Target [${target}] is strictly listed as a PROHIBITED TARGET.`
          };
        }

        // Check authorized scope list
        const isAuthorized = roe.authorizedScope.some(authEntry => {
          const authLower = authEntry.toLowerCase();
          const targetLower = target.toLowerCase();
          if (authLower === targetLower) return true;
          if (targetLower.endsWith('.corp') || targetLower.endsWith('.lab') || targetLower.endsWith('.internal') || targetLower.endsWith('.local')) {
            const domainStem = targetLower.split('.').slice(-2).join('.');
            if (authLower.includes(domainStem) || authLower.endsWith(domainStem)) return true;
          }
          if (authLower.includes(targetLower) || targetLower.includes(authLower)) return true;
          return this.isIpInCidr(target, authEntry);
        });

        if (!isAuthorized) {
          return {
            allowed: false,
            category: 'BLOCKED',
            violationCode: 'OUT_OF_SCOPE_TARGET',
            sanitizedTarget: target,
            reason: `OUT OF SCOPE: Target [${target}] is not within the authorized laboratory subnet [${roe.authorizedScope.join(', ')}]. All operations must remain strictly inside the authorized training range.`
          };
        }
      }

      return { allowed: true, category: 'CONTROLLED' };
    }

    return { allowed: true, category: 'SAFE' };
  }
}
