import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Parishioner from "@/models/Parishioner";

export async function POST(request: NextRequest) {
  await connectToDatabase();
  try {
    const { memberIds } = await request.json();
    
    if (!memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json({ message: "Invalid member IDs" }, { status: 400 });
    }

    const members = await Parishioner.find({
      _id: { $in: memberIds }
    });

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching members", error },
      { status: 500 }
    );
  }
}
