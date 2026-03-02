"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnboardingStepData {
  // Step 1 — Brand
  websiteName?: string;
  logoUrl?: string;
  logoBase64?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Step 2 — Contact
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;

  // Step 3 — Property
  propertyTitle?: string;
  propertyType?: string;
  propertyPrice?: string;
  propertyCity?: string;
  propertyImageBase64?: string;

  // Step 4 — Integrations
  whatsappNumber?: string;
  whatsappConnected?: boolean;
  metaPixelId?: string;
  metaPixelConnected?: boolean;
}

export interface OnboardingStep {
  id: "brand" | "contact" | "property" | "integrations";
  title: string;
  subtitle: string;
  completed: boolean;
  skipped: boolean;
  data: OnboardingStepData;
}

interface OnboardingStore {
  isOpen: boolean;
  currentStep: number;
  hasSeenWelcome: boolean;
  allCompleted: boolean;
  steps: OnboardingStep[];

  // Computed
  completedCount: () => number;
  progressPercent: () => number;

  // Actions
  openOnboarding: () => void;
  closeOnboarding: () => void;
  goToStep: (index: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  markStepCompleted: (stepId: OnboardingStep["id"], data?: OnboardingStepData) => void;
  skipStep: (stepId: OnboardingStep["id"]) => void;
  markAllCompleted: () => void;
  setHasSeenWelcome: () => void;
  resetOnboarding: () => void;
}

const DEFAULT_STEPS: OnboardingStep[] = [
  {
    id: "brand",
    title: "هوية موقعك",
    subtitle: "اسم الموقع والشعار والألوان",
    completed: false,
    skipped: false,
    data: {
      primaryColor: "#1A3C34",
      secondaryColor: "#4CAF82",
      accentColor: "#5BC4C0",
    },
  },
  {
    id: "contact",
    title: "بيانات التواصل",
    subtitle: "الهاتف والبريد والعنوان",
    completed: false,
    skipped: false,
    data: {},
  },
  {
    id: "property",
    title: "أول عقار",
    subtitle: "أضف أول عقار لموقعك",
    completed: false,
    skipped: false,
    data: {},
  },
  {
    id: "integrations",
    title: "الربط والتكامل",
    subtitle: "واتساب وميتا بيكسل",
    completed: false,
    skipped: false,
    data: {},
  },
];

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      currentStep: 0,
      hasSeenWelcome: false,
      allCompleted: false,
      steps: DEFAULT_STEPS,

      completedCount: () =>
        get().steps.filter((s) => s.completed).length,

      progressPercent: () => {
        const completed = get().steps.filter((s) => s.completed || s.skipped).length;
        return Math.round((completed / get().steps.length) * 100);
      },

      openOnboarding: () => set({ isOpen: true }),
      closeOnboarding: () => set({ isOpen: false }),

      goToStep: (index) =>
        set({ currentStep: Math.max(0, Math.min(index, DEFAULT_STEPS.length - 1)) }),

      nextStep: () => {
        const { currentStep, steps } = get();
        if (currentStep < steps.length - 1) {
          set({ currentStep: currentStep + 1 });
        }
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      markStepCompleted: (stepId, data = {}) =>
        set((state) => {
          const updatedSteps = state.steps.map((step) =>
            step.id === stepId
              ? { ...step, completed: true, skipped: false, data: { ...step.data, ...data } }
              : step
          );
          const allDone = updatedSteps.every((s) => s.completed || s.skipped);
          return { steps: updatedSteps, allCompleted: allDone };
        }),

      skipStep: (stepId) =>
        set((state) => {
          const updatedSteps = state.steps.map((step) =>
            step.id === stepId ? { ...step, skipped: true } : step
          );
          const allDone = updatedSteps.every((s) => s.completed || s.skipped);
          return { steps: updatedSteps, allCompleted: allDone };
        }),

      markAllCompleted: () =>
        set((state) => ({
          steps: state.steps.map((s) => ({ ...s, completed: true })),
          allCompleted: true,
        })),

      setHasSeenWelcome: () => set({ hasSeenWelcome: true }),

      resetOnboarding: () =>
        set({
          isOpen: false,
          currentStep: 0,
          hasSeenWelcome: false,
          allCompleted: false,
          steps: DEFAULT_STEPS,
        }),
    }),
    {
      name: "onboarding-store",
      partialize: (state) => ({
        currentStep: state.currentStep,
        hasSeenWelcome: state.hasSeenWelcome,
        allCompleted: state.allCompleted,
        steps: state.steps,
      }),
    }
  )
);
