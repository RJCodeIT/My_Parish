import { PrismaClient } from '@prisma/client';

const { DB_USER, DB_PASSWORD, DB_SERVER, DB_DATABASE, DB_PORT, DB_ENCRYPT, DB_TRUST_CERT } = process.env;

const databaseUrl = `sqlserver://${DB_USER}:${encodeURIComponent(DB_PASSWORD!)}@${DB_SERVER}:${DB_PORT};database=${DB_DATABASE};encrypt=${DB_ENCRYPT};trustServerCertificate=${DB_TRUST_CERT}`;

process.env.DATABASE_COMPILED_URL = databaseUrl;

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;