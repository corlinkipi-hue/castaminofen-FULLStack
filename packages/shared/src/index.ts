export const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export const SLEEP_TIMER_OPTIONS = [5, 10, 15, 20, 30, 45, 60] as const;

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  displayName?: string | null;
  role?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code?: string;
    message?: string;
  };
  meta?: PaginationMeta;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
}

export interface StreamUrlResponse {
  streamUrl: string;
}

export const API_PREFIX = '/api/v1';

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}

export const SUBSCRIPTION_PLANS = {
  BASIC: { id: 'basic', name: 'Basic', price: 0, interval: 'month' },
  PREMIUM: { id: 'premium', name: 'Premium', price: 19900, interval: 'month' },
} as const;
