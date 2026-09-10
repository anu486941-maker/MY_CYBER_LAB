/**
 * MY CYBER LAB — REALISTIC ETHICAL HACKER OPERATIONS ENGINE v1.0
 * Module: /src/engine/attackbox/AttackBoxTabManager.ts
 * Purpose: Multi-Terminal Tab Session Manager for AttackBox Workstation
 */

import { AttackBoxShell, TerminalOutputLine } from './AttackBoxShell';
import { RulesOfEngagement } from '../types';

export interface TerminalTab {
  id: string;
  title: string;
  shell: AttackBoxShell;
  logs: TerminalOutputLine[];
  commandHistory: string[];
  historyIndex: number;
}

export class AttackBoxTabManager {
  private tabs: TerminalTab[] = [];
  private activeTabId: string = '';

  constructor() {
    this.createTab('Terminal 1 (Recon)');
  }

  public createTab(title?: string): TerminalTab {
    const newId = `tab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const tabTitle = title || `Terminal ${this.tabs.length + 1}`;
    const shell = new AttackBoxShell();

    const initialLogs: TerminalOutputLine[] = [
      { text: 'MY CYBER LAB Authorized AttackBox Workstation v4.2 [Kali Linux Subsystem]', type: 'banner' },
      { text: 'Type "help" for a list of security testing commands and tool syntaxes.', type: 'system' },
      { text: '──────────────────────────────────────────────────────────────────────────────', type: 'system' }
    ];

    const tab: TerminalTab = {
      id: newId,
      title: tabTitle,
      shell,
      logs: initialLogs,
      commandHistory: [],
      historyIndex: -1
    };

    this.tabs.push(tab);
    this.activeTabId = newId;
    return tab;
  }

  public closeTab(tabId: string): void {
    if (this.tabs.length <= 1) return; // Prevent closing the last tab

    const idx = this.tabs.findIndex(t => t.id === tabId);
    if (idx !== -1) {
      this.tabs.splice(idx, 1);
      if (this.activeTabId === tabId) {
        this.activeTabId = this.tabs[Math.max(0, idx - 1)].id;
      }
    }
  }

  public getTabs(): TerminalTab[] {
    return [...this.tabs];
  }

  public getActiveTabId(): string {
    return this.activeTabId;
  }

  public setActiveTab(tabId: string): void {
    if (this.tabs.some(t => t.id === tabId)) {
      this.activeTabId = tabId;
    }
  }

  public getActiveTab(): TerminalTab | undefined {
    return this.tabs.find(t => t.id === this.activeTabId);
  }

  public executeInActiveTab(commandStr: string, roe: RulesOfEngagement | null): TerminalOutputLine[] {
    const activeTab = this.getActiveTab();
    if (!activeTab) return [];

    if (commandStr.trim().toLowerCase() === 'clear') {
      activeTab.logs = [
        { text: `[Screen cleared by user]`, type: 'system' }
      ];
      return activeTab.logs;
    }

    const outputLines = activeTab.shell.execute(commandStr, roe);
    activeTab.logs.push(...outputLines);
    if (commandStr.trim()) {
      activeTab.commandHistory.push(commandStr.trim());
      activeTab.historyIndex = activeTab.commandHistory.length;
    }
    return outputLines;
  }

  public clearTabLogs(tabId: string): void {
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      tab.logs = [{ text: `[Screen cleared]`, type: 'system' }];
    }
  }
}
