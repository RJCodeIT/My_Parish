import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import News from "@/models/News";

export async function GET() {
  await connectToDatabase();

  try {
    const news = await News.find().sort({ date: -1 });
    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas pobierania aktualności:", error);
    return NextResponse.json(
      { error: "Błąd podczas pobierania aktualności" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const newNews = new News(body);
    await newNews.save();
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas dodawania aktualności:", error);
    return NextResponse.json(
      { error: "Błąd podczas dodawania aktualności" },
      { status: 500 }
    );
  }
}
