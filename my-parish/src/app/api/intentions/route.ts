import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const intentions = await prisma.intention.findMany({
      include: {
        masses: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Transform the data for frontend compatibility
    const transformedIntentions = intentions.map(intention => ({
      ...intention,
      _id: intention.id // Add _id field for frontend compatibility
    }));
    
    console.log('Transformed intentions for frontend:', transformedIntentions);
    return NextResponse.json(transformedIntentions, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnych', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnych" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const image = formData.get('image') as File | null;
    const masses = JSON.parse(formData.get('masses') as string);

    // Use Prisma transaction to create intention and masses
    const newIntention = await prisma.$transaction(async (prismaTransaction) => {
      // Create intention
      const intention = await prismaTransaction.intention.create({
        data: {
          title,
          date: new Date(date || new Date().toISOString()),
          imageUrl: image ? image.name : undefined
        }
      });

      // Create masses
      if (masses && Array.isArray(masses) && masses.length > 0) {
        await Promise.all(masses.map((mass: { time: string; intention: string }) => {
          return prismaTransaction.mass.create({
            data: {
              time: mass.time,
              intention: mass.intention,
              intentionId: intention.id
            }
          });
        }));
      }

      // Return complete intention with masses
      return prismaTransaction.intention.findUnique({
        where: { id: intention.id },
        include: {
          masses: true
        }
      });
    });
    
    return NextResponse.json(newIntention, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas dodawania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas dodawania intencji mszalnej" }, { status: 500 });
  }
}
