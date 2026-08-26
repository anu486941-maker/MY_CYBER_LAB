export type SecurityAuditEventType =
  | 'ENGAGEMENT_STARTED'
  | 'SCOPE_VERIFIED'
  | 'COMMAND_ATTEMPTED'
  | 'COMMAND_BLOCKED'
  | 'EVIDENCE_PRESERVED'
  | 'FINDING_CREATED'
  | 'FINDING_UPDATED'
  | 'RETEST_EXECUTED'
  | 'RETEST_PASSED'
  | 'RETEST_FAILED'
  | 'REPORT_PUBLISHED'
  | 'POLICY_VIOLATION';

export interface SecurityAuditLogEntry {
  id: string;
  timestamp: string;
  eventType: SecurityAuditEventType;
  actor: string;
  engagementId?: string;
  details: string;
  metadata?: Record<string, any>;
  severity: 'INFO' | 'WARN' | 'CRITICAL';
}

const AUDIT_STORAGE_KEY = 'mcl_security_audit_trail';

class SecurityAuditLogger {
  private inMemoryLogs: SecurityAuditLogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const saved = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (saved) {
        this.inMemoryLogs = JSON.parse(saved);
      }
    } catch {
      this.inMemoryLogs = [];
    }
  }

  private persistLogs() {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.inMemoryLogs.slice(0, 200)));
    } catch (e) {
      console.warn('Unable to persist security audit log:', e);
    }
  }

  public logEvent(
    eventType: SecurityAuditEventType,
    details: string,
    options: {
      actor?: string;
      engagementId?: string;
      metadata?: Record<string, any>;
      severity?: 'INFO' | 'WARN' | 'CRITICAL';
    } = {}
  ): SecurityAuditLogEntry {
    const entry: SecurityAuditLogEntry = {
      id: `AUDIT-${Date.now()}-${Math.random().toString(16).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      eventType,
      actor: options.actor || 'Learner Operator',
      engagementId: options.engagementId,
      details,
      metadata: options.metadata,
      severity: options.severity || (eventType.includes('BLOCKED') || eventType.includes('VIOLATION') ? 'WARN' : 'INFO')
    };

    this.inMemoryLogs.unshift(entry);
    if (this.inMemoryLogs.length > 200) {
      this.inMemoryLogs = this.inMemoryLogs.slice(0, 200);
    }
    this.persistLogs();
    return entry;
  }

  public getLogs(engagementId?: string): SecurityAuditLogEntry[] {
    if (engagementId) {
      return this.inMemoryLogs.filter(l => !l.engagementId || l.engagementId === engagementId);
    }
    return this.inMemoryLogs;
  }

  public clearLogs() {
    this.inMemoryLogs = [];
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }
}

export const securityAuditLogger = new SecurityAuditLogger();
