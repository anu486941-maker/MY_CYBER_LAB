import { ClientEngagement } from '../types';

export interface ScopeValidationResult {
  allowed: boolean;
  reason?: string;
  category: 'SAFE' | 'CONTROLLED' | 'RESTRICTED' | 'BLOCKED';
  sanitizedTarget?: string;
}

/**
 * Checks if an IPv4 address or CIDR range is within an authorized CIDR subnet.
 * E.g., isIpInCidr('10.50.0.10', '10.50.0.0/24') => true
 * E.g., isIpInCidr('10.50.0.0/24', '10.50.0.0/24') => true
 */
export function isIpInCidr(ipOrCidr: string, cidr: string): boolean {
  try {
    const cleanTarget = ipOrCidr.trim().split('/')[0];
    const cleanCidr = cidr.trim();

    if (!cleanCidr.includes('/')) {
      return cleanTarget === cleanCidr;
    }

    const [range, bitsStr] = cleanCidr.split('/');
    const bits = parseInt(bitsStr, 10);
    if (isNaN(bits) || bits < 0 || bits > 32) return false;

    const ipToLong = (addr: string): number => {
      const octets = addr.split('.').map(o => parseInt(o, 10));
      if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
        throw new Error('Invalid IP');
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
 * Extracts potential IP targets or domains from a command line string.
 */
export function extractTargetsFromCommand(command: string): string[] {
  const targets: string[] = [];
  const tokens = command.trim().split(/\s+/);

  // Match IPv4 addresses or CIDRs
  const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?$/;
  // Match hostnames / domains
  const domainRegex = /^[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}$/;

  for (let i = 1; i < tokens.length; i++) {
    const token = tokens[i].replace(/[;,|&"']/g, '');
    if (!token || token.startsWith('-')) continue;

    // Remove URL prefixes if present (preserve CIDR subnet if present)
    const cleanToken = token.replace(/^https?:\/\//i, '').split(':')[0];

    if (ipv4Regex.test(cleanToken) || domainRegex.test(cleanToken) || cleanToken.endsWith('.internal')) {
      targets.push(cleanToken);
    }
  }

  return targets;
}

/**
 * Validates a command against the Authorized Client Engagement Scope.
 * Deny by Default: If a command targets an unapproved IP/domain, or is destructive, it is blocked.
 */
export function validateAceCommandScope(
  command: string,
  engagement: ClientEngagement | null
): ScopeValidationResult {
  const trimmed = command.trim();
  if (!trimmed) {
    return { allowed: true, category: 'SAFE' };
  }

  const parts = trimmed.split(/\s+/);
  const baseCmd = parts[0].toLowerCase();

  // 1. BLOCKED: Outright destructive or sandbox escape commands
  const blockedCommands = [
    'rm -rf /',
    'rm -rf /*',
    ':(){ :|:& };:',
    'mkfs',
    'dd if=/dev/zero',
    'chmod 777 /',
    'chmod -R 777 /',
    '/etc/shadow',
    'process.env'
  ];

  for (const blocked of blockedCommands) {
    if (trimmed.includes(blocked)) {
      return {
        allowed: false,
        category: 'BLOCKED',
        reason: `SECURITY POLICY VIOLATION: Execution of potentially destructive system command or credential dump attempt [${blocked}] is strictly prohibited.`
      };
    }
  }

  // 2. SAFE Local Commands (read-only diagnostic utilities)
  const safeCommands = [
    'help', 'clear', 'pwd', 'ls', 'cat', 'whoami', 'id', 'uname',
    'ip', 'ifconfig', 'ss', 'netstat', 'ps', 'grep', 'find', 'echo',
    'date', 'history', 'reset', 'exit', 'cd'
  ];

  if (safeCommands.includes(baseCmd)) {
    // If it's a safe command that doesn't target external networks, allow
    if (!trimmed.includes('ping') && !trimmed.includes('curl') && !trimmed.includes('nmap')) {
      return { allowed: true, category: 'SAFE' };
    }
  }

  // 3. RESTRICTED: Destructive offensive tooling without explicit mission context
  const restrictedTools = [
    'sqlmap', 'hydra', 'metasploit', 'msfconsole', 'arpspoof', 'ettercap',
    'aircrack-ng', 'wireshark', 'tcpdump', 'nikto'
  ];

  if (restrictedTools.includes(baseCmd)) {
    return {
      allowed: false,
      category: 'RESTRICTED',
      reason: `POLICY NOTICE: Specialized offensive utility [${baseCmd}] requires isolated laboratory orchestration. In this reconnaissance module, please use standard diagnostic and enumeration tooling (e.g. nmap, curl, redis-cli, nc).`
    };
  }

  // 4. CONTROLLED: Network Discovery & Service Probes (nmap, ping, curl, nc, redis-cli)
  const networkTools = ['nmap', 'ping', 'curl', 'nc', 'netcat', 'telnet', 'redis-cli', 'dig', 'nslookup', 'host'];

  if (networkTools.includes(baseCmd)) {
    if (!engagement) {
      return {
        allowed: false,
        category: 'CONTROLLED',
        reason: 'DENY BY DEFAULT: No active client engagement selected. Select an authorized client engagement to establish Rules of Engagement.'
      };
    }

    const targets = extractTargetsFromCommand(trimmed);
    const authorizedSubnet = engagement.scope.authorizedSubnet;
    const authorizedDomains = engagement.scope.authorizedDomains.map(d => d.toLowerCase());
    const authorizedIps = engagement.scope.authorizedAssets.map(a => a.ip);

    // If no target was extracted (e.g. "nmap -h" or "curl --version"), allow as SAFE
    if (targets.length === 0) {
      return { allowed: true, category: 'SAFE' };
    }

    for (const target of targets) {
      // Check if target is explicitly prohibited
      const cleanTargetLower = target.toLowerCase();
      const isProhibited = engagement.scope.prohibitedTargets.some(p => {
        const pLower = p.toLowerCase();
        // Skip general descriptions like 'Any IP outside...'
        if (pLower.startsWith('any ip outside')) return false;

        const matchIp = pLower.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}(?:\/[0-9]{1,2})?/);
        if (matchIp) {
          return cleanTargetLower === matchIp[0] || (isIpInCidr(cleanTargetLower, matchIp[0]) && cleanTargetLower !== engagement.scope.authorizedSubnet);
        }
        return pLower.includes(cleanTargetLower);
      });
      if (isProhibited) {
        return {
          allowed: false,
          category: 'BLOCKED',
          reason: `ENGAGEMENT RULE VIOLATION: Target [${target}] is explicitly designated as a PROHIBITED TARGET in the client Rules of Engagement.`
        };
      }

      // Check loopback / localhost
      if (target === '127.0.0.1' || target === 'localhost' || target === '0.0.0.0') {
        continue;
      }

      // Check if IP is in authorized subnet
      const inSubnet = isIpInCidr(target, authorizedSubnet);
      const isKnownIp = authorizedIps.includes(target);
      const isKnownDomain = authorizedDomains.includes(target.toLowerCase());

      if (!inSubnet && !isKnownIp && !isKnownDomain) {
        return {
          allowed: false,
          category: 'BLOCKED',
          reason: `ACTION BLOCKED BY RULES OF ENGAGEMENT: Target [${target}] is OUT OF SCOPE. Authorized subnet is [${authorizedSubnet}]. Attacking or probing unauthorized infrastructure violates professional ethics and legal authorizations.`
        };
      }
    }

    return { allowed: true, category: 'CONTROLLED' };
  }

  // Fallback default: Allow general shell utilities if not blocked
  return { allowed: true, category: 'SAFE' };
}
