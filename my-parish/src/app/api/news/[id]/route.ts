import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import News from "@/models/News";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const newsItem = await News.findById(params.id);
    if (!newsItem) {
      return NextResponse.json({ error: "Aktualność nie została znaleziona" }, { status: 404 });
    }
    return NextResponse.json(newsItem, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania aktualności:', error);
    return NextResponse.json({ error: "Błąd podczas pobierania aktualności" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedNews = await News.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedNews) {
      return NextResponse.json({ error: "Aktualność nie została znaleziona" }, { status: 404 });
    }

    return NextResponse.json(updatedNews, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas edycji aktualności:', error);
    return NextResponse.json({ error: "Błąd podczas edycji aktualności" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const deletedNews = await News.findByIdAndDelete(params.id);
    if (!deletedNews) {
      return NextResponse.json({ error: "Aktualność nie została znaleziona" }, { status: 404 });
    }
    return NextResponse.json({ message: "Aktualność została usunięta" }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania aktualności:', error);
    return NextResponse.json({ error: "Błąd podczas usuwania aktualności" }, { status: 500 });
  }
}
