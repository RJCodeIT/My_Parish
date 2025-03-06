import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";

export async function GET() {
  await connectToDatabase();

  try {
    const groups = await Group.find().populate("leaderId").populate("members");
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching groups", error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const newGroup = new Group(body);
    await newGroup.save();
    
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating group", error }, { status: 500 });
  }
}
