import { PrismaClient } from '@prisma/client';

// Typy dla Prisma
export type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// Typy dla błędów Prisma
export interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

// Pomocnicza funkcja do sprawdzania błędów Prisma
export function isPrismaError(error: unknown): error is PrismaError {
  return error instanceof Error && 'code' in error;
}

// Typy dla transakcji Prisma
export type TransactionClient = PrismaTransaction;

// Klasa błędu Prisma
export class PrismaClientKnownRequestError extends Error {
  code: string;
  meta?: Record<string, unknown>;
  constructor(message: string, { code, meta }: { code: string; meta?: Record<string, unknown> }) {
    super(message);
    this.name = 'PrismaClientKnownRequestError';
    this.code = code;
    this.meta = meta;
  }
}
