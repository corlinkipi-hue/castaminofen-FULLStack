import path from 'node:path';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: path.join('packages', 'database', 'prisma', 'schema.prisma'),
  migrations: {
    path: path.join('packages', 'database', 'prisma', 'migrations'),
  },
});
