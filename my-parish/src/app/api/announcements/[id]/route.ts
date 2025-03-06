import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const announcement = await Announcement.findById(params.id);
    if (!announcement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    return NextResponse.json(announcement, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json({ error: "Error fetching announcement" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedAnnouncement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAnnouncement, { status: 200 });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: "Error updating announcement" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(params.id);
    if (!deletedAnnouncement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: "Error deleting announcement" }, { status: 500 });
  }
}
