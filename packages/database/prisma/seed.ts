import { PrismaClient } from '../generated/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      email: 'demo@castaminofen.local',
      displayName: 'Demo User',
      passwordHash: 'demo-hash',
      role: 'USER',
      subscription: { create: { plan: 'FREE', status: 'ACTIVE' } },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
