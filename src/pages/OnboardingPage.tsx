import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ExperienceLevel, CareerRoleId } from '../types';
import { speechEngine } from '../utils/speechEngine';
import { OnboardingStepWelcome } from '../components/onboarding/OnboardingStepWelcome';
import { OnboardingStepExperience } from '../components/onboarding/OnboardingStepExperience';
import { OnboardingStepGoals } from '../components/onboarding/OnboardingStepGoals';
import { OnboardingStepAssessment } from '../components/onboarding/OnboardingStepAssessment';
import { OnboardingStepPath } from '../components/onboarding/OnboardingStepPath';
import { OnboardingStepAmanIntro } from '../components/onboarding/OnboardingStepAmanIntro';
import { OnboardingStepFirstMission } from '../components/onboarding/OnboardingStepFirstMission';

export const OnboardingPage: React.FC = () => {
  const { profile, updateProfile, currentUser } = useApp();
  const navigate = useNavigate();

  // Recover state from local draft if user reloads during onboarding
  const getInitialDraft = () => {
    try {
      const saved = localStorage.getItem('mcl_onboarding_draft');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  };
  const draft = getInitialDraft();

  const [step, setStep] = useState<number>(() => {
    const savedStep = localStorage.getItem('mcl_onboarding_step');
    const parsed = savedStep ? parseInt(savedStep, 10) : (draft?.step ?? 0);
    return isNaN(parsed) || parsed < 0 || parsed > 6 ? 0 : parsed;
  });

  const [selectedExperience, setSelectedExperience] = useState<ExperienceLevel>(
    draft?.experience || profile?.experience || 'beginner'
  );
  const [selectedRole, setSelectedRole] = useState<CareerRoleId>(
    draft?.selectedRole || (profile?.selectedRole as CareerRoleId) || (profile?.targetRole as CareerRoleId) || 'soc-analyst'
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    draft?.learningGoals || profile?.learningGoals || ['goal-soc-blue-team']
  );
  const [assessmentScores, setAssessmentScores] = useState<Record<string, number>>(
    draft?.assessmentScores || profile?.assessmentScores || {}
  );
  const [assessmentCompleted, setAssessmentCompleted] = useState<boolean>(
    draft?.assessmentCompleted ?? profile?.assessmentCompleted ?? false
  );

  // Derive starting module index based on experience and assessment
  const getStartingModuleIndex = (): number => {
    if (selectedExperience === 'already_studying') return 3;
    if (selectedExperience === 'some_linux') return 2;
    if (selectedExperience === 'some_computer') return 1;
    return 0; // beginner / completely new
  };

  // Sync active step and selections to localStorage for persistent state recovery
  useEffect(() => {
    localStorage.setItem('mcl_onboarding_step', String(step));
    localStorage.setItem('mcl_onboarding_draft', JSON.stringify({
      step,
      experience: selectedExperience,
      selectedRole,
      learningGoals: selectedGoals,
      assessmentScores,
      assessmentCompleted
    }));
    window.dispatchEvent(new Event('storage'));
  }, [step, selectedExperience, selectedRole, selectedGoals, assessmentScores, assessmentCompleted]);

  // Voice announcement helper for key milestones
  useEffect(() => {
    if (step === 0) {
      speechEngine.speak(
        "Welcome to MY CYBER LAB. I am AMAN, your AI cybersecurity mentor. Let's personalize your learning journey."
      );
    }
  }, [step]);

  const handleToggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId) ? prev.filter(g => g !== goalId) : [...prev, goalId]
    );
  };

  const handleAssessmentComplete = (scores: Record<string, number>, skipped: boolean) => {
    setAssessmentScores(scores);
    setAssessmentCompleted(!skipped);
    setStep(4); // Move to Personalized Path
  };

  const handleFinalizeOnboarding = async () => {
    const recommendedModule = getStartingModuleIndex();
    
    await updateProfile({
      experience: selectedExperience,
      selectedRole: selectedRole,
      targetRole: selectedRole,
      learningGoals: selectedGoals,
      assessmentScores: assessmentScores,
      assessmentCompleted: assessmentCompleted,
      recommendedPath: [`Module ${recommendedModule + 1}`],
      onboardingCompleted: true,
      emailVerified: currentUser?.emailVerified ?? true
    });

    // Clear temporary onboarding drafts
    try {
      localStorage.removeItem('mcl_onboarding_draft');
      localStorage.removeItem('mcl_onboarding_step');
    } catch {}

    navigate('/dashboard');
  };

  return (
    <div className="w-full min-h-[85vh] flex items-center justify-center p-4 sm:p-6 my-auto">
      {step === 0 && (
        <OnboardingStepWelcome
          userName={currentUser?.displayName || profile?.codename || 'Operator'}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <OnboardingStepExperience
          selectedExperience={selectedExperience}
          onSelectExperience={setSelectedExperience}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <OnboardingStepGoals
          selectedRole={selectedRole}
          onSelectRole={setSelectedRole}
          selectedGoals={selectedGoals}
          onToggleGoal={handleToggleGoal}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <OnboardingStepAssessment
          onComplete={handleAssessmentComplete}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <OnboardingStepPath
          careerRole={selectedRole}
          startingModuleIndex={getStartingModuleIndex()}
          assessmentScores={assessmentScores}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <OnboardingStepAmanIntro
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}

      {step === 6 && (
        <OnboardingStepFirstMission
          onCompleteOnboarding={handleFinalizeOnboarding}
        />
      )}
    </div>
  );
};
