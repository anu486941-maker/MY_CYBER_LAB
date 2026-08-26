import { EvidenceItem, SecurityFinding, EngagementReport } from '../types';

export const INITIAL_EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    id: 'EVID-001',
    timestamp: '2026-08-24 10:14:22 UTC',
    engagementId: 'ace-northstar-01',
    assetId: 'asset-ns-03',
    assetIp: '10.50.0.25',
    type: 'COMMAND_OUTPUT',
    description: 'Unauthenticated Redis INFO output showing server configuration on port 6379',
    rawContent: `root@kali:~$ redis-cli -h 10.50.0.25 -p 6379 INFO
# Server
redis_version:6.2.6
redis_git_sha1:00000000
os:Linux 5.10.0-18-amd64 x86_64
process_id:741
run_id:54d89a6f1e29e920d3f6
tcp_port:6379
uptime_in_seconds:86400
# Clients
connected_clients:1
# Memory
used_memory_human:1.84M
# Keyspace
db0:keys=14,expires=0,avg_ttl=0`,
    analystNote: 'Confirmed Redis instance does not enforce requirepass and is accessible without credentials from 10.50.0.0/24 subnet.',
    verified: true
  },
  {
    id: 'EVID-002',
    timestamp: '2026-08-24 10:22:15 UTC',
    engagementId: 'ace-northstar-01',
    assetId: 'asset-ns-02',
    assetIp: '10.50.0.10',
    type: 'HTTP_RESPONSE',
    description: 'Exposed Swagger UI & unauthenticated telemetry endpoint on port 8080',
    rawContent: `GET /api-docs/swagger.json HTTP/1.1
Host: 10.50.0.10:8080
User-Agent: Mozilla/5.0 (Authorized Audit)

HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *

{
  "openapi": "3.0.0",
  "info": {
    "title": "Internal Analytics Diagnostics API",
    "version": "1.0-STAGING"
  },
  "paths": {
    "/metrics/env": {
      "get": {
        "summary": "Dump environment variables",
        "responses": { "200": { "description": "Returns raw process.env" } }
      }
    }
  }
}`,
    analystNote: 'Exposed staging Swagger API documentation leaks internal endpoints and debug flags to unauthorized network users.',
    verified: true
  }
];

export const INITIAL_SECURITY_FINDINGS: SecurityFinding[] = [
  {
    id: 'FIND-001',
    engagementId: 'ace-northstar-01',
    title: 'Unauthenticated Redis Key-Value Store Accessible on Staging Subnet',
    severity: 'HIGH',
    cvssScore: 7.5,
    cvssVector: 'CVSS:3.1/AV:A/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N',
    affectedAsset: 'ns-db-staging.internal (10.50.0.25)',
    affectedComponent: 'Redis Service (Port 6379/TCP)',
    cweId: 'CWE-306: Missing Authentication for Critical Function',
    owaspCategory: 'A01:2021-Broken Access Control',
    description: 'The staging database host runs a Redis key-value store bound to all network interfaces (0.0.0.0:6379) with authentication disabled (requirepass not set). Any system on the local training network can execute commands, inspect cached keys, and read sensitive telemetry.',
    evidenceIds: ['EVID-001'],
    impact: 'Unauthorized disclosure of in-memory caching data, session tokens, and potential remote key manipulation or cache poisoning.',
    likelihood: 'High',
    remediation: '1. Configure Redis to bind exclusively to loopback (bind 127.0.0.1 ::1) in /etc/redis/redis.conf.\n2. Set a high-entropy password in redis.conf via requirepass directive.\n3. Enforce firewall rules blocking external inbound traffic to port 6379.',
    references: [
      'https://redis.io/docs/management/security/',
      'CWE-306: Missing Authentication for Critical Function',
      'OWASP A01:2021 - Broken Access Control'
    ],
    retestStatus: 'PENDING_REMEDIATION',
    retestNotes: 'Awaiting simulated patch deployment on ns-db-staging.internal.',
    amanReviewFeedback: {
      isValid: true,
      score: 95,
      critique: 'Excellent finding structure. You clearly distinguished between an exposed port observation and proven unauthenticated data access via EVID-001. Remediation is defense-in-depth.',
      remediationAdvice: 'Remind the client to also verify protected-mode yes in redis.conf.'
    }
  }
];

export const INITIAL_ENGAGEMENT_REPORTS: EngagementReport[] = [
  {
    id: 'REP-NS-001',
    engagementId: 'ace-northstar-01',
    clientName: 'Northstar Technologies',
    leadAuditor: 'Senior Cyber Specialist',
    executiveSummary: 'During the authorized external penetration test of Northstar Technologies staging infrastructure (10.50.0.0/24), one HIGH severity finding and one MEDIUM finding were identified. The primary concern is an unauthenticated Redis key-value store accessible without credentials.',
    scopeSummary: 'Target Subnet: 10.50.0.0/24 | Assets: 10.50.0.1, 10.50.0.10, 10.50.0.25 | Time Window: 45 minutes',
    methodology: 'PTES (Penetration Testing Execution Standard) — Reconnaissance, Port Scanning, Service Identification, Vulnerability Analysis, Evidence Capture, and Remediation Validation.',
    findings: INITIAL_SECURITY_FINDINGS,
    riskMatrix: { critical: 0, high: 1, medium: 1, low: 0, info: 1 },
    overallPosture: 'MODERATE',
    remediationRoadmap: [
      {
        phase: 'Immediate (24-48 Hours)',
        actions: ['Bind Redis service to 127.0.0.1 and enforce requirepass', 'Restrict port 8080 Swagger UI to internal management VPN'],
        timeframe: '48 Hours'
      },
      {
        phase: 'Short Term (1-2 Weeks)',
        actions: ['Deploy network segmentation ACLs separating staging databases from general application tiers'],
        timeframe: '14 Days'
      }
    ],
    createdAt: '2026-08-24',
    score: 92,
    amanEvaluation: 'High-caliber assessment report demonstrating proper risk attribution, accurate CVSS calculations, and actionable remediation steps.'
  }
];
