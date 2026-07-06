jest.mock('./storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

import { getOnboardingStepState } from './onboarding';

describe('getOnboardingStepState', () => {
  it('returns the first slide state correctly', () => {
    expect(getOnboardingStepState(0, 3)).toEqual({
      isLast: false,
      canGoBack: false,
      nextStep: 1,
    });
  });

  it('returns the middle slide state correctly', () => {
    expect(getOnboardingStepState(1, 3)).toEqual({
      isLast: false,
      canGoBack: true,
      nextStep: 2,
    });
  });

  it('returns the final slide state correctly', () => {
    expect(getOnboardingStepState(2, 3)).toEqual({
      isLast: true,
      canGoBack: true,
      nextStep: null,
    });
  });
});
