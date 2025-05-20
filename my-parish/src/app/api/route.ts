import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_request: NextRequest, _context: { params: { id: string } }) {
  try {
    await prisma.$connect();
    return NextResponse.json({
      message:
        "Server is running and successfully connected to MS SQL Server BudgenixDB!",
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: "Failed to connect to the database",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}