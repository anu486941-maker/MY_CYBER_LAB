/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Phase 2 QA Suite: AttackBox Operating Environment & Penetration Testing Tools Emulation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AttackBoxShell } from '../engine/attackbox/AttackBoxShell';
import { AttackBoxTabManager } from '../engine/attackbox/AttackBoxTabManager';
import { MachineRegistry } from '../engine/machines/MachineRegistry';
import { RulesOfEngagement } from '../engine/types';

describe('MY CYBER LAB — Phase 2 QA Suite: AttackBox Engine', () => {
  let shell: AttackBoxShell;
  let roe: RulesOfEngagement;

  beforeEach(() => {
    shell = new AttackBoxShell('/root');
    roe = {
      engagementId: 'roe-test-01',
      clientName: 'Test Corp',
      authorizedScope: ['10.20.0.0/24', '10.30.0.0/24', '10.40.0.0/24', '*.mycyberlab.local'],
      prohibitedScope: ['192.168.0.0/16', '10.50.0.0/24'],
      rules: ['Authorized testing'],
      authorizedTools: ['nmap', 'gobuster', 'hydra', 'curl'],
      timeLimitMinutes: 60,
      testingWindow: '24/7 Authorized Lab',
      emergencyContact: 'secops@mycyberlab.local'
    };
  });

  describe('1. Virtual Bash Environment & File System (VFS) Core', () => {
    it('should initialize with root prompt and default environment variables', () => {
      expect(shell.getCwd()).toBe('/root');
      expect(shell.getPrompt()).toBe('root@attackbox:~#');
      expect(shell.getEnv('IP')).toBe('10.10.14.5');
    });

    it('should support navigating directories with cd and pwd', () => {
      shell.execute('cd /home/kali', roe);
      expect(shell.getCwd()).toBe('/home/kali');
      expect(shell.getPrompt()).toBe('root@attackbox:/home/kali#');

      const pwdOut = shell.execute('pwd', roe);
      expect(pwdOut[1].text).toBe('/home/kali');
    });

    it('should support creating, reading, and searching virtual files via echo, cat, and grep', () => {
      shell.execute('echo "KEY=MY_SECRET_TOKEN_8891" > /root/secret.env', roe);
      const catOut = shell.execute('cat /root/secret.env', roe);
      expect(catOut[1].text).toBe('KEY=MY_SECRET_TOKEN_8891');

      const grepOut = shell.execute('grep MY_SECRET /root/secret.env', roe);
      expect(grepOut[1].text).toBe('KEY=MY_SECRET_TOKEN_8891');
    });

    it('should support base64 encoding and decoding', () => {
      const encOut = shell.execute('echo "FLAG{TEST}" > /root/flag.txt', roe);
      expect(encOut[0].type).toBe('input');

      const base64Dec = shell.execute('base64 -d RkxBR3tURVNUfQ==', roe);
      expect(base64Dec[1].text).toBe('FLAG{TEST}');
    });
  });

  describe('2. Scope Policy Guard Integration in AttackBox', () => {
    it('should block execution of prohibited destructive system commands', () => {
      const res = shell.execute('rm -rf /', roe);
      expect(res.some(l => l.text.includes('REFUSAL'))).toBe(true);
      expect(res.some(l => l.text.includes('SECURITY POLICY VIOLATION'))).toBe(true);
    });

    it('should block network scans against out-of-scope unauthorized target IPs', () => {
      const res = shell.execute('nmap -sV 192.168.1.99', roe);
      expect(res.some(l => l.text.includes('REFUSAL'))).toBe(true);
      expect(res.some(l => l.text.includes('RULES OF ENGAGEMENT VIOLATION') || l.text.includes('OUT OF SCOPE'))).toBe(true);
    });

    it('should allow authorized network scans against targets within the authorized subnet', () => {
      const res = shell.execute('nmap -sV 10.20.0.10', roe);
      expect(res.some(l => l.text.includes('Nmap scan report for webforge.internal'))).toBe(true);
      expect(res.some(l => l.text.includes('80/tcp'))).toBe(true);
    });
  });

  describe('3. Penetration Testing Tool Suite Emulation', () => {
    it('should emulate nmap service scanning and OS identification', () => {
      const res = shell.execute('nmap -sV -sC -O 10.20.0.10', roe);
      expect(res.some(l => l.text.includes('Apache httpd'))).toBe(true);
      expect(res.some(l => l.text.includes('Ubuntu 22.04 LTS'))).toBe(true);
    });

    it('should emulate gobuster directory enumeration and uncover hidden endpoints', () => {
      const res = shell.execute('gobuster dir -u http://10.20.0.10/ -w /usr/share/wordlists/common.txt', roe);
      expect(res.some(l => l.text.includes('/backup/db_config.php.bak'))).toBe(true);
      expect(res.some(l => l.text.includes('EXPOSED CREDENTIALS'))).toBe(true);
    });

    it('should emulate hydra SSH password brute-forcing with matching wordlist', () => {
      const res = shell.execute('hydra -l developer -P /usr/share/wordlists/rockyou.txt 10.20.0.10 ssh', roe);
      expect(res.some(l => l.text.includes('login: developer   password: devpass_2026!'))).toBe(true);
    });

    it('should emulate curl HTTP header and body inspection', () => {
      const res = shell.execute('curl -v http://10.20.0.10/backup/db_config.php.bak', roe);
      expect(res.some(l => l.text.includes('HTTP/1.1 200 OK'))).toBe(true);
      expect(res.some(l => l.text.includes('$DB_PASS = "devpass_2026!"'))).toBe(true);
    });

    it('should download remote files to VFS using wget', () => {
      const res = shell.execute('wget http://10.20.0.10/user.txt', roe);
      expect(res.some(l => l.text.includes('saved'))).toBe(true);

      const catOut = shell.execute('cat user.txt', roe);
      expect(catOut[1].text.includes('FLAG{WEBFORGE_INITIAL_ACCESS_DEV_8821}')).toBe(true);
    });
  });

  describe('4. AttackBox Multi-Terminal Tab Manager', () => {
    let tabMgr: AttackBoxTabManager;

    beforeEach(() => {
      tabMgr = new AttackBoxTabManager();
    });

    it('should initialize with default Terminal 1 tab', () => {
      expect(tabMgr.getTabs().length).toBe(1);
      expect(tabMgr.getActiveTab()?.title).toBe('Terminal 1 (Recon)');
    });

    it('should support creating multiple tabs and switching active focus', () => {
      const t2 = tabMgr.createTab('Terminal 2 (Exploit)');
      expect(tabMgr.getTabs().length).toBe(2);
      expect(tabMgr.getActiveTabId()).toBe(t2.id);

      tabMgr.executeInActiveTab('cd /tmp', roe);
      expect(tabMgr.getActiveTab()?.shell.getCwd()).toBe('/tmp');

      // Switch back to tab 1
      const t1Id = tabMgr.getTabs()[0].id;
      tabMgr.setActiveTab(t1Id);
      expect(tabMgr.getActiveTab()?.shell.getCwd()).toBe('/root');
    });

    it('should prevent closing the last remaining tab', () => {
      const t1Id = tabMgr.getTabs()[0].id;
      tabMgr.closeTab(t1Id);
      expect(tabMgr.getTabs().length).toBe(1);
    });
  });
});
