import { INestApplication, ExecutionContext, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import * as request from 'supertest';
import { MediaController } from '../src/modules/media/media.controller';
import { MediaService } from '../src/modules/media/media.service';
import { PrismaService } from '../src/common/prisma/prisma.service';
import { RolesGuard } from '../src/common/guards/roles.guard';

const TEST_USER_ID = 'user-test';

const mockPrisma = {
  playbackState: {
    findMany: jest.fn(),
  },
};

const mockAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    req.user = { id: TEST_USER_ID, role: 'USER' };
    return true;
  },
};

describe('Media continue listening (integration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [MediaService, { provide: PrismaService, useValue: mockPrisma }],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /media/continue returns recent playback items', async () => {
    mockPrisma.playbackState.findMany.mockResolvedValue([
      {
        id: 'ps1',
        userId: TEST_USER_ID,
        episodeId: 'ep1',
        position: 120,
        duration: 1800,
        lastPlayedAt: new Date('2024-01-01T00:00:00.000Z'),
        episode: {
          id: 'ep1',
          title: 'Episode 1',
          content: {
            id: 'content-1',
            title: 'The Show',
            coverUrl: 'https://example.com/cover.jpg',
            type: 'PODCAST',
          },
        },
      },
    ]);

    const res = await request(app.getHttpServer()).get('/media/continue?limit=5').expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(mockPrisma.playbackState.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: TEST_USER_ID, isCompleted: false },
        take: 5,
      }),
    );
  });
});
