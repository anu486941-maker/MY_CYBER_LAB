/**
 * Progressive Hint System
 * Implements a 6-level hint ladder (Level 0 - Level 5) preferring Socratic guidance over immediate answer reveals.
 */

export interface ProgressiveHint {
  level: number;
  levelName: string;
  hintText: string;
  isSolution: boolean;
}

export function generateProgressiveHint(
  level: number,
  taskTopic: string,
  taskDescription: string,
  knownEvidence: string[] = []
): ProgressiveHint {
  const boundedLevel = Math.max(0, Math.min(5, level));

  switch (boundedLevel) {
    case 0:
      return {
        level: 0,
        levelName: 'Independent Reflection',
        hintText: `Take a moment to analyze the challenge goal for "${taskTopic}". What information do you currently have, and what tools or commands have you already run?`,
        isSolution: false
      };

    case 1:
      return {
        level: 1,
        levelName: 'Conceptual Guidance',
        hintText: `Consider the fundamental security mechanics of ${taskTopic}. Recall how inputs are parsed, how parameters are evaluated, or how network services communicate.`,
        isSolution: false
      };

    case 2:
      return {
        level: 2,
        levelName: 'Investigation Direction',
        hintText: `Focus your attention on the target response behavior. Check HTTP response codes, query outputs, or file system permissions in the lab environment.`,
        isSolution: false
      };

    case 3:
      return {
        level: 3,
        levelName: 'Specific Evidence & Tool Direction',
        hintText: `Try executing specific inspection tools (e.g., \`curl -v\`, \`nmap -sV\`, or SQL payloads like \`' UNION SELECT...\`). Examine captured artifacts in your Evidence Locker (${knownEvidence.length} items present).`,
        isSolution: false
      };

    case 4:
      return {
        level: 4,
        levelName: 'Guided Execution Step',
        hintText: `Step-by-step guidance: 1. Target the vulnerable parameter in the application. 2. Pass the payload crafted for ${taskTopic}. 3. Capture the output flag or hash in your locker.`,
        isSolution: false
      };

    case 5:
    default:
      return {
        level: 5,
        levelName: 'Complete Solution & Remediation Explanation',
        hintText: `Solution Breakdown: ${taskDescription}. Exploit sequence complete. To remediate, apply input validation, parameterized queries, and strict privilege separation.`,
        isSolution: true
      };
  }
}
