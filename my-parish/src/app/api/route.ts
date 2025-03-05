import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({
      message: "Server is running",
      db: "Connected to MongoDB",
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { message: "Server is running", db: "Failed to connect to MongoDB" },
      { status: 500 }
    );
  }
}
