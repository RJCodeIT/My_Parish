import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import News, { INews } from "@/models/News";

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
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;

    const newsData: Pick<INews, 'title' | 'subtitle' | 'content' | 'date' | 'imageUrl'> = {
      title,
      subtitle,
      content,
      date: new Date()
    };

    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Here we would typically upload the image to a storage service
      // For now, we'll store it as a base64 string
      newsData.imageUrl = `data:${image.type};base64,${buffer.toString('base64')}`;
    }

    const newNews = new News(newsData);
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
