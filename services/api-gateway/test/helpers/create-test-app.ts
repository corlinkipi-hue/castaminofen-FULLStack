import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { API_PREFIX } from '@castaminofen/shared';

export async function createTestApp(moduleMetadata: Parameters<typeof Test.createTestingModule>[0]): Promise<{
  app: INestApplication;
  module: TestingModule;
}> {
  const module = await Test.createTestingModule(moduleMetadata).compile();
  const app = module.createNestApplication();
  app.setGlobalPrefix(API_PREFIX);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();
  return { app, module };
}

export const mockPrisma = {
  $queryRaw: jest.fn().mockResolvedValue([{ '?column?': 1 }]),
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  refreshToken: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  content: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  episode: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  creatorProfile: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  follow: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
  },
  libraryItem: {
    create: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
  },
  playlist: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  playlistItem: {
    count: jest.fn(),
    create: jest.fn(),
  },
  subscription: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
  },
  purchase: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
  },
  playbackState: {
    upsert: jest.fn(),
    findMany: jest.fn(),
  },
  download: {
    upsert: jest.fn(),
    findMany: jest.fn(),
  },
};

export const mockRedis = {
  getClient: jest.fn().mockReturnValue({
    ping: jest.fn().mockResolvedValue('PONG'),
  }),
};

export const mockStorage = {
  createUploadUrl: jest.fn(),
  buildMediaKey: jest.fn(),
  uploadObject: jest.fn(),
};
