import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Group from "@/models/Group";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const group = await Group.findById(params.id).populate("leaderId").populate("members");
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching group", error }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedGroup = await Group.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedGroup) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating group", error }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const deletedGroup = await Group.findByIdAndDelete(params.id);
    if (!deletedGroup) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Group deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting group", error }, { status: 500 });
  }
}
