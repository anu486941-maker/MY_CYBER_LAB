import { detectAmanIntent } from './amanActionDispatcher';

export interface LocalGuidanceResult {
  fullText: string;
  summary: string;
  isLocalGuidance: boolean;
  amanStatus: 'LOCAL_GUIDANCE';
}

export function generateLocalGuidanceResponse(
  userQuery: string,
  contextData: any,
  language: string = 'Auto',
  errorCode: string = 'MODEL_UNAVAILABLE'
): LocalGuidanceResult {
  const isHinglish =
    language === 'Hinglish' ||
    language === 'Hindi' ||
    (contextData && (contextData.language === 'Hinglish' || contextData.language === 'Hindi')) ||
    userQuery.toLowerCase().includes('hinglish') ||
    userQuery.toLowerCase().includes('sikhao') ||
    userQuery.toLowerCase().includes('sikhni');

  const course = contextData?.currentCourse || contextData?.careerPath || 'Networking Fundamentals';
  const topic = contextData?.currentLesson || contextData?.currentModule || 'Switches, Routers & Default Gateways';
  const level = contextData?.cyberLevel || contextData?.level || 1;
  const nextSkill = contextData?.nextRequiredSkill || 'Hands-on Lab Practice';

  const intentResult = detectAmanIntent(userQuery);

  let fullText = '';
  let summary = '';

  // 1. CAREER_LEARNING_INTENT ("I want to learn ethical hacking", "Mujhe ethical hacking sikhni hai")
  if (intentResult.intent === 'CAREER_LEARNING_INTENT') {
    if (isHinglish) {
      fullText = `Bilkul! Main aapko Ethical Hacking ki learning path par lead karunga.

Aap abhi **${course}** (Level ${level}) mein ho. Ethical Hacking master karne ke liye ye foundational steps complete karne honge:

1. **Networking Fundamentals**: TCP/IP, OSI model, ports, & subnetting.
2. **Linux Shell & Terminal**: Permissions, process management, & command lines.
3. **Port Scanning & Reconnaissance**: Target discovery with Nmap & Wireshark.
4. **Vulnerability Assessment**: Identifying misconfigurations and exploits.

Aapka learning progress aur XP completely safe hai!

[ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
      summary = `Main aapko Ethical Hacking path par guide kar raha hoon. [ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Certainly! I will guide you along the **Ethical Hacker** career path.

You are currently in **${course}** (Level ${level}). To master Ethical Hacking, you will complete these core competencies:

1. **Networking Fundamentals**: TCP/IP, OSI layers, ports, & subnetting.
2. **Linux Shell & Command Line**: File permissions, process controls, & automation scripts.
3. **Reconnaissance & Port Scanning**: Target discovery using Nmap & Wireshark.
4. **Vulnerability Assessment**: Scanning for misconfigurations and security flaws.

Your progress, XP, and state remain 100% saved locally.

[ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
      summary = `I am guiding you to the Ethical Hacker path. [ACTION:OPEN_LEARNING_PATH:ethical-hacker]`;
    }
  } 
  else if (intentResult.intent === 'CAREER_SWITCH') {
    fullText = isHinglish
      ? `Bilkul! Main aapko ${intentResult.canonicalRole === 'ETHICAL_HACKER' ? 'Ethical Hacker' : 'SOC Analyst'} track par switch karwa raha hoon. 🚀\n\n[ACTION:${intentResult.action?.type}:${intentResult.action?.parameter}]`
      : `Switching you to the ${intentResult.canonicalRole === 'ETHICAL_HACKER' ? 'Ethical Hacker' : 'SOC Analyst'} track now! 🚀\n\n[ACTION:${intentResult.action?.type}:${intentResult.action?.parameter}]`;
    summary = `Switching track...`;
  }
  // 2. LEARNING_QUERY ("What to learn next?", "Next lesson")
  else if (intentResult.intent === 'LEARNING_QUERY') {
    fullText = isHinglish
      ? `Aap abhi **${course}** (${topic}) par progress kar rahe ho. Chalo, next lesson start karte hain! 🚀\n\n[ACTION:START_NEXT]`
      : `You are progressing well in **${course}** (${topic}). Let's start the next lesson! 🚀\n\n[ACTION:START_NEXT]`;
    summary = `Resuming learning... [ACTION:START_NEXT]`;
  }
  // 3. CAREER_ROADMAP ("Show me roadmap", "Show ethical hacking roadmap")
  else if (intentResult.intent === 'CAREER_ROADMAP') {
    if (isHinglish) {
      fullText = `Bilkul! Main aapka Adaptive Roadmap open kar raha hoon.

Aap **${course}** par progress kar rahe ho. Complete roadmap dekhne ke liye button click karein.

[ACTION:OPEN_ROADMAP]`;
      summary = `Opening your career roadmap. [ACTION:OPEN_ROADMAP]`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Here is your adaptive cybersecurity roadmap. You are currently progressing through **${course}**.

[ACTION:OPEN_ROADMAP]`;
      summary = `Opening your career roadmap. [ACTION:OPEN_ROADMAP]`;
    }
  }
  // 3. RESUME_CAREER_PATH ("Continue karo", "Next lesson kholo", "Continue learning")
  else if (intentResult.intent === 'RESUME_CAREER_PATH') {
    if (isHinglish) {
      fullText = `Aapka active topic hai: **${course}** (${topic}).

Aapka next recommended move: **${nextSkill}**.

Chalo aage continue karte hain!

[ACTION:START_NEXT]`;
      summary = `Resuming your saved learning position in ${course}. [ACTION:START_NEXT]`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Your saved learning position: **${course}** (${topic}).
Next recommended activity: **${nextSkill}**.

Let's launch your next module!

[ACTION:START_NEXT]`;
      summary = `Resuming your saved position in ${course}. [ACTION:START_NEXT]`;
    }
  }
  // 4. MODULE_INTENT ("Open Linux Fundamentals", "Open module")
  else if (intentResult.intent === 'MODULE_INTENT') {
    const actionTag = intentResult.action ? `[ACTION:${intentResult.action.type}:${intentResult.action.targetRoute}]` : '[ACTION:OPEN_MODULE:/modules]';
    if (isHinglish) {
      fullText = `Aapke requested training module ko load kar raha hoon.

${actionTag}`;
      summary = `Opening requested module. ${actionTag}`;
    } else {
      fullText = `Gemini is temporarily busy, but I'm still here. I can continue helping you using Local Guidance Mode.

Opening your requested training module now.

${actionTag}`;
      summary = `Opening requested module. ${actionTag}`;
    }
  }
  // 5. CASUAL CONVERSATION ("Kya haal hai?", "Kaise ho?", "Hello", "How are you?", "Thanks")
  else if (intentResult.intent === 'CONVERSATION') {
    const qLower = userQuery.toLowerCase();
    if (qLower.includes('kya kar') || qLower.includes('what are you doing') || qLower.includes('what r u doing')) {
      fullText = isHinglish
        ? `Bas tumhare next step ke liye ready hoon 😄 Batao, aaj kya karna hai?`
        : `Just ready for your next move! 😄 What would you like to work on today?`;
      summary = isHinglish ? `Main ready hoon!` : `Ready when you are!`;
    } else if (qLower.includes('thanks') || qLower.includes('thank')) {
      fullText = isHinglish
        ? `Anytime! 😄 Cybersecurity learning mein koi bhi doubt ho, bina jhijhak poocho.`
        : `You're very welcome! 😄 Feel free to ask whenever you have questions.`;
      summary = `Anytime! 😄`;
    } else if (qLower.includes('bye') || qLower.includes('goodbye')) {
      fullText = isHinglish
        ? `Aapko phir milenge! Tab tak happy learning and stay secure! 🛡️`
        : `See you later! Keep practicing and stay secure! 🛡️`;
      summary = `Goodbye! 🛡️`;
    } else {
      fullText = isHinglish
        ? `Main bilkul badhiya hoon 😄 Tum batao, cybersecurity learning kaisi chal rahi hai?`
        : `I'm doing great! 😄 Ready to help whenever you are. How is your learning going today?`;
      summary = isHinglish ? `Main badhiya hoon 😄` : `I'm doing great! 😄`;
    }
  }
  // 6. ROOM / MODULE EXPLICIT QUERY
  else if (intentResult.intent === 'ROOM_QUERY') {
    if (isHinglish) {
      fullText = `Is room mein hum **${course}** (${topic}) sikh rahe hain.
      
Core concepts:
- **Switch**: Local network ke devices ko connect karta hai.
- **Router**: Networks ke beech traffic routing karta hai.
- **Default Gateway**: Network se bahar nikalne ka exit point.

Aapka status 100% saved hai!`;
      summary = `Is room mein hum ${course} sikh rahe hain.`;
    } else {
      fullText = `In this room, we are focusing on **${course}** (${topic}).

Core principles covered:
- **Switch**: Local area network connectivity.
- **Router**: Inter-network packet routing.
- **Default Gateway**: Exit gateway node for remote destination routing.

Your progress is safely recorded.`;
      summary = `Explaining current room: ${course}.`;
    }
  }
  // 7. GENERAL QUERY / FALLBACK
  else {
    let contextExplanation = '';
    if (intentResult.useRoomContext) {
      contextExplanation = isHinglish
        ? `Aap abhi **${course}** (${topic}) topic par ho.`
        : `You are currently studying **${course}** (${topic}).`;
    }

    if (isHinglish) {
      fullText = `${contextExplanation}
      
Chalo core concepts samjhte hain:
- **Switch**: Same local network ke devices ko connect karta hai.
- **Router**: Different networks ke beech traffic forward karta hai.
- **Default Gateway**: Device ka exit point.

Batao, kya help chahiye?`;
      summary = contextExplanation || `Batao, kya help chahiye?`;
    } else {
      fullText = `${contextExplanation}

Key concepts:
- **Switch**: Connects devices on the same subnet.
- **Router**: Routes traffic across networks.
- **Default Gateway**: Exit path for external traffic.

Let me know what you would like to explore next!`;
      summary = contextExplanation || `Let me know what you would like to explore next!`;
    }
  }

  return {
    fullText,
    summary,
    isLocalGuidance: true,
    amanStatus: 'LOCAL_GUIDANCE'
  };
}
