import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const id = params.id;
    
    console.log('Fetching announcement with ID:', id);
    
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        content: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
    if (!announcement) {
      console.error('Announcement not found with ID:', id);
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    // Transform the data for frontend compatibility
    const transformedAnnouncement = {
      ...announcement,
      _id: announcement.id // Add _id field for frontend compatibility
    };
    
    console.log('Transformed single announcement for frontend:', transformedAnnouncement);
    return NextResponse.json(transformedAnnouncement, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return NextResponse.json({ error: "Error fetching announcement" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const id = params.id;
    
    console.log('Updating announcement with ID:', id);
    
    const body = await request.json();
    
    // Użyj transakcji Prisma do aktualizacji ogłoszenia i jego zawartości
    const updatedAnnouncement = await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
      // Aktualizuj podstawowe dane ogłoszenia
      await prismaTransaction.announcement.update({
        where: { id },
        data: {
          title: body.title,
          date: new Date(body.date),
          imageUrl: body.imageUrl,
          extraInfo: body.extraInfo
        }
      });

      // Usuń istniejącą zawartość
      await prismaTransaction.announcementContent.deleteMany({
        where: { announcementId: id }
      });

      // Dodaj nową zawartość
      const contentPromises = (body.content || []).map((item: { order: number; text: string }, index: number) =>
        prismaTransaction.announcementContent.create({
          data: {
            order: index,
            text: item.text,
            announcementId: id
          }
        })
      );

      await Promise.all(contentPromises);

      // Pobierz zaktualizowane ogłoszenie z zawartością
      return prismaTransaction.announcement.findUnique({
        where: { id },
        include: {
          content: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      });
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

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const id = params.id;
    
    console.log('Deleting announcement with ID:', id);
    
    // Find the announcement first to make sure it exists
    const announcement = await prisma.announcement.findUnique({
      where: { id }
    });
    
    if (!announcement) {
      console.error('Announcement not found with ID:', id);
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    // Użyj transakcji Prisma do usunięcia ogłoszenia i powiązanej zawartości
    await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
      // Usuń zawartość ogłoszenia
      await prismaTransaction.announcementContent.deleteMany({
        where: { announcementId: id }
      });

      // Usuń ogłoszenie
      await prismaTransaction.announcement.delete({
        where: { id }
      });
    });
    
    console.log('Successfully deleted announcement with ID:', id);

    return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Error deleting announcement" }, { status: 500 });
  }
}
