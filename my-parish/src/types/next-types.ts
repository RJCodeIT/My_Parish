// Typy dla Next.js API Routes
import { NextRequest } from 'next/server';

export interface RouteParams {
  params: {
    id: string;
    [key: string]: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export type RouteHandler = (
  req: NextRequest | Request,
  context: RouteParams
) => Promise<Response>;
