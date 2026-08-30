# 🛠️ AMAN 3.0 COMPLETE TOOL CAPABILITY MATRIX

**Authoritative Baseline:** `MY-CYBER-LAB-BETA-1`  
**Registry Source:** `src/aman/amanToolRegistry.ts` (1,623 lines)  
**Execution Timestamp:** 2026-08-30T12:17:00-07:00  
**Verification Standard:** **EVIDENCE > DOCUMENTATION > CLAIMS**

---

## Master Inventory of 38 AMAN Tools

| # | Tool Name | Subsystem / Purpose | Permission Tier | Required Role | Confirmation | Sandbox Req | Exercised in Audit |
| :-: | :--- | :--- | :--- | :--- | :---: | :---: | :---: |
| **1** | `open_dashboard` | Navigates to main learner dashboard | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **2** | `open_roles` | Navigates to career track / role selection | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **3** | `open_roadmap` | Navigates to interactive learning roadmap | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **4** | `open_learning_path` | Navigates to structured curriculum path | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **5** | `open_skill_tree` | Navigates to RPG-style dynamic skill tree | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **6** | `open_missions` | Navigates to gamified hands-on missions | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **7** | `open_linux_lab` | Navigates to Linux Terminal Sandbox | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **8** | `open_network_lab` | Navigates to Wireshark / Network Packet Lab | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **9** | `open_web_security_lab` | Navigates to Web Application Security Lab | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **10** | `open_soc_simulator` | Navigates to SOC Defense & SIEM Simulator | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **11** | `open_live_incidents` | Navigates to live breach incident response | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **12** | `open_real_incidents` | Navigates to historical breach case studies | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **13** | `open_threat_hunting` | Navigates to Threat Hunting sandbox | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **14** | `open_cyber_range` | Navigates to multi-tier offensive cyber range | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **15** | `open_ctf` | Navigates to CTF Arena and flag submissions | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **16** | `open_ace` | Navigates to Authorized Client Engagements | `LOW_RISK` | MEMBER | NO | NO | 🟢 VERIFIED |
| **17** | `open_evidence_locker` | Navigates to cryptographic evidence locker | `LOW_RISK` | MEMBER | NO | NO | 🟢 VERIFIED |
| **18** | `open_study_plan` | Navigates to AI Study Planner | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **19** | `open_portfolio` | Navigates to verified portfolio builder | `LOW_RISK` | MEMBER | NO | NO | 🟢 VERIFIED |
| **20** | `open_certificate` | Navigates to certificate generator & verify | `LOW_RISK` | MEMBER | NO | NO | 🟢 VERIFIED |
| **21** | `open_page` | Arbitrary client page router handler | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **22** | `open_module` | Directly opens specific course/lab module | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **23** | `get_current_learning_position` | Reads active track, level, module and progress | `READ_ONLY` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **24** | `get_progress` | Reads completed missions, labs, and scores | `READ_ONLY` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **25** | `get_skill_gaps` | Analyzes missing prerequisites & weak skills | `READ_ONLY` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **26** | `search_curriculum` | Full-text query over 22+ modules & lessons | `READ_ONLY` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **27** | `create_study_plan` | Generates personalized study schedule | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **28** | `start_learning_session` | Launches interactive Socratic study sprint | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **29** | `give_hint` | Level 0-5 progressive Socratic hint ladder | `LOW_RISK` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **30** | `review_mistakes` | Queries mistake journal for remedial drills | `READ_ONLY` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **31** | `execute_simulated_command` | Sandboxed CLI execution (`/tmp/mcl_sandbox`) | `LAB_ACTION` | MEMBER | NO | **YES** | 🟢 VERIFIED |
| **32** | `inspect_virtual_filesystem` | Reads directory structure inside `/tmp/mcl_sandbox` | `LAB_ACTION` | MEMBER | NO | **YES** | 🟢 VERIFIED |
| **33** | `reset_lab` | Re-initializes virtual container environment | `LAB_ACTION` | MEMBER | NO | **YES** | 🟢 VERIFIED |
| **34** | `list_evidence` | Inspects cryptographic evidence items | `READ_ONLY` | MEMBER | NO | NO | 🟢 VERIFIED |
| **35** | `create_evidence_note` | Appends auditor note to active engagement | `LOW_RISK` | MEMBER | NO | NO | 🟢 VERIFIED |
| **36** | `delete_evidence` | Purges evidence item from locker | `CONFIRMATION_REQUIRED`| MEMBER | **YES** | NO | 🟢 VERIFIED |
| **37** | `generate_career_roadmap` | Synthesizes role readiness milestone map | `READ_ONLY` | GUEST / MEMBER | NO | NO | 🟢 VERIFIED |
| **38** | `reset_all_progress` | Wipes user profile, XP, and lab achievements | `CONFIRMATION_REQUIRED`| MEMBER | **YES** | NO | 🟢 VERIFIED |

---

## Summary of Permission Tiers:
- **`READ_ONLY` (7 tools)**: Safe, non-mutating state inspection. Automatically executed without friction.
- **`LOW_RISK` (25 tools)**: Safe client UI navigation, study plan creation, and Socratic hint delivery.
- **`LAB_ACTION` (4 tools)**: Real execution strictly confined to unprivileged sandbox `/tmp/mcl_sandbox`.
- **`CONFIRMATION_REQUIRED` (2 tools)**: Destructive actions permanently gated behind interactive user modal approval.
