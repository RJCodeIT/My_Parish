import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Announcement from "@/models/Announcement";

export const GET = async () => {
  await connectToDatabase();

  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: "Error fetching announcements" }, { status: 500 });
  }
}

export const POST = async (req: Request) => {
  await connectToDatabase();

  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const extraInfo = formData.get('extraInfo') as string;
    const content = JSON.parse(formData.get('content') as string);
    const image = formData.get('image') as File;
    const announcementData = {
      title,
      date,
      extraInfo,
      content,
      image: image ? image.name : null,
    };

    const newAnnouncement = new Announcement(announcementData);
    await newAnnouncement.save();
    
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: "Error creating announcement" }, { status: 500 });
  }
}
