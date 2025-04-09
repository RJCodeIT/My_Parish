import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const announcement = await prisma.announcement.findUnique({
      where: { id: params.id },
      include: {
        content: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
    
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
  try {
    const body = await req.json();
    
    // Użyj transakcji Prisma do aktualizacji ogłoszenia i jego zawartości
    const updatedAnnouncement = await prisma.$transaction(async (prismaTransaction) => {
      // Aktualizuj podstawowe dane ogłoszenia
      await prismaTransaction.announcement.update({
        where: { id: params.id },
        data: {
          title: body.title,
          date: new Date(body.date),
          extraInfo: body.extraInfo || undefined,
          imageUrl: body.imageUrl || undefined,
        }
      });

      // Jeśli przesłano nową zawartość, usuń starą i dodaj nową
      if (body.content && Array.isArray(body.content)) {
        // Usuń istniejącą zawartość
        await prismaTransaction.announcementContent.deleteMany({
          where: { announcementId: params.id }
        });

        // Dodaj nową zawartość
        await Promise.all(body.content.map((item: { order: number; text: string }) => {
          return prismaTransaction.announcementContent.create({
            data: {
              order: item.order,
              text: item.text,
              announcementId: params.id
            }
          });
        }));
      }

      // Pobierz zaktualizowane ogłoszenie wraz z zawartością
      return prismaTransaction.announcement.findUnique({
        where: { id: params.id },
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

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Użyj transakcji Prisma do usunięcia ogłoszenia i powiązanej zawartości
    await prisma.$transaction(async (prismaTransaction) => {
      // Usuń zawartość ogłoszenia
      await prismaTransaction.announcementContent.deleteMany({
        where: { announcementId: params.id }
      });

      // Usuń ogłoszenie
      await prismaTransaction.announcement.delete({
        where: { id: params.id }
      });
    });

    return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Error deleting announcement" }, { status: 500 });
  }
}
