import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id: params.id }
    });
    
    if (!newsItem) {
      return NextResponse.json({ error: "Aktualność nie została znaleziona" }, { status: 404 });
    }
    
    // Transform the data for frontend compatibility
    const transformedNewsItem = {
      ...newsItem,
      _id: newsItem.id // Add _id field for frontend compatibility
    };
    
    console.log('Transformed single news item for frontend:', transformedNewsItem);
    return NextResponse.json(transformedNewsItem, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania aktualności:', error);
    return NextResponse.json({ error: "Błąd podczas pobierania aktualności" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const body = await request.json();
    
    const updatedNews = await prisma.news.update({
      where: { id: params.id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        imageUrl: body.imageUrl || undefined,
        date: body.date ? new Date(body.date) : undefined
      }
    });

    return NextResponse.json(updatedNews, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas edycji aktualności:', error);
    
    // Check if error is about non-existing record
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Aktualność nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas edycji aktualności" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    await prisma.news.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: "Aktualność została usunięta" }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania aktualności:', error);
    
    // Check if error is about non-existing record
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Aktualność nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas usuwania aktualności" }, { status: 500 });
  }
}
