// Globalne deklaracje typów dla całego projektu
import { PrismaClient } from '@prisma/client';

// Rozszerzenie globalnego namespace
declare global {
  // Deklaracja dla transakcji Prisma
  type PrismaTransaction = Omit<
    PrismaClient,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >;

  // Namespace Prisma z potrzebnymi typami
  namespace Prisma {
    type TransactionClient = PrismaTransaction;
    
    interface PrismaError extends Error {
      code?: string;
      meta?: Record<string, unknown>;
    }
    
    class PrismaClientKnownRequestError extends Error {
      code: string;
      meta?: Record<string, unknown>;
      constructor(message: string, { code, meta }: { code: string; meta?: Record<string, unknown> }) {
        super(message);
        this.name = 'PrismaClientKnownRequestError';
        this.code = code;
        this.meta = meta;
      }
    }
  }
}

// Eksportuj pusty obiekt, aby TypeScript traktował ten plik jako moduł
export {};
