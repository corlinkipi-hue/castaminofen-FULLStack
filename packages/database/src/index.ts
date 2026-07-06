import { PrismaClient as PrismaClientGenerated } from '../generated/client';

export const PrismaClient = PrismaClientGenerated;
export type PrismaClient = PrismaClientGenerated;
export * from '../generated/client';

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
