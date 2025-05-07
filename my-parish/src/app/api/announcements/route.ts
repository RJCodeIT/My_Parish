import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        content: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Transform the data for frontend compatibility
    const transformedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      _id: announcement.id // Add _id field for frontend compatibility
    }));
    
    console.log('Transformed announcements for frontend:', transformedAnnouncements);
    return NextResponse.json(transformedAnnouncements, { status: 200 });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: "Error fetching announcements" }, { status: 500 });
  }
}

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const extraInfo = formData.get('extraInfo') as string;
    const contentArray = JSON.parse(formData.get('content') as string);
    const image = formData.get('image') as File;
    
    // Użyj transakcji Prisma do utworzenia ogłoszenia i jego zawartości
    const newAnnouncement = await prisma.$transaction(async (prismaTransaction) => {
      // Utwórz ogłoszenie
      const announcement = await prismaTransaction.announcement.create({
        data: {
          title,
          date: new Date(date),
          extraInfo: extraInfo || undefined,
          imageUrl: image ? image.name : undefined,
        }
      });

      // Utwórz zawartość ogłoszenia
      await Promise.all(contentArray.map((item: { order: number; text: string }) => {
        return prismaTransaction.announcementContent.create({
          data: {
            order: item.order,
            text: item.text,
            announcementId: announcement.id
          }
        });
      }));

      // Pobierz utworzone ogłoszenie wraz z zawartością
      return prismaTransaction.announcement.findUnique({
        where: { id: announcement.id },
        include: {
          content: {
            orderBy: {
              order: 'asc'
            }
          }
        }
      });
    });
    
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: "Error creating announcement" }, { status: 500 });
  }
}
