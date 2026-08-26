export interface AppTranslations {
  welcomeBack: string;
  selectRole: string;
  proveItTitle: string;
  nextStepTitle: string;
  whyThisMatters: string;
  mentorAdvice: string;
  mistakesLogged: string;
  skillTreeHeading: string;
  practiceHubHeading: string;
  examModeNotice: string;
  examModeStrict: string;
  mentorModeNotice: string;
  retentionRefresher: string;
}

export const TRANSLATIONS: Record<'English' | 'Hinglish' | 'Hindi', AppTranslations> = {
  English: {
    welcomeBack: 'Welcome back, Operator',
    selectRole: 'CHOOSE YOUR CYBER CAREER TRACK',
    proveItTitle: 'PROVE IT — SKILL MASTERY VERIFICATION',
    nextStepTitle: 'YOUR NEXT ACTION STEP',
    whyThisMatters: 'WHY THIS MATTERS IN REAL CYBER WORK',
    mentorAdvice: 'AI Mentor is observing your commands and will provide progressive hints if you get stuck.',
    mistakesLogged: 'Mistakes automatically analyzed. Complete targeted drills to clear your weaknesses.',
    skillTreeHeading: 'Interactive Cyber Capability Matrix',
    practiceHubHeading: 'Dedicated Hands-On Practice Simulator',
    examModeNotice: 'EXAM MODE ACTIVE: Timed environment. AI hints and solutions are strictly locked.',
    examModeStrict: 'Prove your independent operational capability without guidance.',
    mentorModeNotice: 'MENTOR MODE ACTIVE: Guided learning environment with progressive hint tiers and deep technical explanations.',
    retentionRefresher: 'Spaced review ready. Refresh your memory to keep skill mastery at 100%.'
  },
  Hinglish: {
    welcomeBack: 'Swagat hai wapas, Operator',
    selectRole: 'APNA CYBER CAREER TRACK SELECT KAREIN',
    proveItTitle: 'PROVE IT — SKILL MASTERY CHECK',
    nextStepTitle: 'AAPKA AGLA TARGET (NEXT STEP)',
    whyThisMatters: 'REAL CYBERSECURITY MEIN YEH KYUN ZAROORI HAI',
    mentorAdvice: 'AI Cyber Mentor aapki learning ko monitor kar raha hai. Agar phas gaye toh hint mil jayega.',
    mistakesLogged: 'Aapki galtiyan track ho gayi hain. Weak concepts ko resolve karne ke liye quick practice solve karein.',
    skillTreeHeading: 'Interactive Cyber Skills Aur Prerequisites Tree',
    practiceHubHeading: 'Hands-on Practice & Sandbox Terminal',
    examModeNotice: 'EXAM MODE ON: Time limit active hai. AI hints aur solutions bilkul band hain.',
    examModeStrict: 'Apni real technical ability prove karein bina kisi help ke.',
    mentorModeNotice: 'MENTOR MODE ON: Step-by-step guidance aur easy explanations available hain.',
    retentionRefresher: 'Spaced repetition review ready hai. Concepts ko fresh rakhne ke liye quick quiz dein.'
  },
  Hindi: {
    welcomeBack: 'पुनः स्वागत है, ऑपरेटर',
    selectRole: 'अपना साइबर सुरक्षा करियर ट्रैक चुनें',
    proveItTitle: 'प्रूव इट — कौशल दक्षता सत्यापन',
    nextStepTitle: 'आपका अगला कदम (अगला लक्ष्य)',
    whyThisMatters: 'वास्तविक साइबर सुरक्षा में इसका क्या महत्व है',
    mentorAdvice: 'एआई साइबर मेंटर आपके सीखने की प्रगति पर नज़र रख रहा है और आवश्यकता पड़ने पर मार्गदर्शन करेगा।',
    mistakesLogged: 'आपकी त्रुटियां दर्ज कर ली गई हैं। अपनी कमजोरियों को दूर करने के लिए लक्षित अभ्यास करें।',
    skillTreeHeading: 'इंटरएक्टिव साइबर कौशल और पूर्व-आवश्यकताएं',
    practiceHubHeading: 'व्यावहारिक अभ्यास और सिम्युलेटर',
    examModeNotice: 'परीक्षा मोड सक्रिय: समय सीमा जारी है। एआई संकेत और उत्तर लॉक हैं।',
    examModeStrict: 'बिना किसी बाहरी सहायता के अपनी वास्तविक क्षमता साबित करें।',
    mentorModeNotice: 'मेंटर मोड सक्रिय: प्रगतिशील संकेत और विस्तृत व्याख्याएं उपलब्ध हैं।',
    retentionRefresher: 'मेमोरी रिफ्रेशर तैयार है। कौशल को मजबूत बनाए रखने के लिए त्वरित समीक्षा करें।'
  }
};
