import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Announcement from "@/models/Announcement";

export async function GET() {
  await connectToDatabase();

  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: "Error fetching announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const newAnnouncement = new Announcement(body);
    await newAnnouncement.save();
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: "Error creating announcement" }, { status: 500 });
  }
}
