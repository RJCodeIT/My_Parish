import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        date: 'desc'
      }
    });
    
    // Transform the data for frontend compatibility
    const transformedNews = news.map(item => ({
      ...item,
      _id: item.id // Add _id field for frontend compatibility
    }));
    
    console.log('Transformed news for frontend:', transformedNews);
    return NextResponse.json(transformedNews, { status: 200 });
  } catch (error) {
    console.error("Błąd podczas pobierania aktualności:", error);
    return NextResponse.json(
      { error: "Błąd podczas pobierania aktualności" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;

    let imageUrl: string | undefined = undefined;
    
    if (image) {
      // Here we would typically upload the image to a storage service
      // For now, we'll just store the image name
      imageUrl = image.name;
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        subtitle,
        content,
        imageUrl,
        date: new Date()
      }
    });
    
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("Błąd podczas dodawania aktualności:", error);
    return NextResponse.json(
      { error: "Błąd podczas dodawania aktualności" },
      { status: 500 }
    );
  }
}
