import * as storage from '@/lib/storage';

export const ONBOARDING_STORAGE_KEY = 'onboarding_v1_complete';

export const ONBOARDING_SLIDES = [
  {
    icon: 'compass-outline' as const,
    title: 'کاوش کنید',
    description: 'پادکست، کتاب صوتی و ویدیو را در یک جا پیدا کنید.',
  },
  {
    icon: 'play-circle-outline' as const,
    title: 'گوش دهید',
    description: 'با یک ضربه پخش کنید و از هر صفحه به پخش ادامه دهید.',
  },
  {
    icon: 'bookmark-outline' as const,
    title: 'ذخیره کنید',
    description: 'محتوای مورد علاقه را به کتابخانه اضافه کنید و از همان‌جا ادامه دهید.',
  },
] as const;

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await storage.getItem(ONBOARDING_STORAGE_KEY);
  return value === '1';
}

export async function markOnboardingComplete(): Promise<void> {
  await storage.setItem(ONBOARDING_STORAGE_KEY, '1');
}

export function getOnboardingStepState(step: number, totalSlides: number) {
  const clampedStep = Math.max(0, Math.min(step, Math.max(0, totalSlides - 1)));
  const isLast = clampedStep >= totalSlides - 1;
  return {
    isLast,
    canGoBack: clampedStep > 0,
    nextStep: isLast ? null : clampedStep + 1,
  };
}
