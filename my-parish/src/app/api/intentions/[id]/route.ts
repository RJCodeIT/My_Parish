import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const intention = await prisma.intention.findUnique({
      where: { id: params.id },
      include: {
        masses: true
      }
    });
    
    if (!intention) {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json(intention, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnej" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    // Use Prisma transaction to update intention and masses
    const updatedIntention = await prisma.$transaction(async (prismaTransaction) => {
      // Update intention basic data
      await prismaTransaction.intention.update({
        where: { id: params.id },
        data: {
          title: body.title,
          date: body.date ? new Date(body.date) : undefined,
          imageUrl: body.imageUrl || undefined
        }
      });
      
      // Update masses if provided
      if (body.masses && Array.isArray(body.masses)) {
        // Delete existing masses
        await prismaTransaction.mass.deleteMany({
          where: { intentionId: params.id }
        });
        
        // Create new masses
        if (body.masses.length > 0) {
          await Promise.all(body.masses.map((mass: { time: string; intention: string }) => {
            return prismaTransaction.mass.create({
              data: {
                time: mass.time,
                intention: mass.intention,
                intentionId: params.id
              }
            });
          }));
        }
      }
      
      // Return updated intention with masses
      return prismaTransaction.intention.findUnique({
        where: { id: params.id },
        include: {
          masses: true
        }
      });
    });
    
    if (!updatedIntention) {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json(updatedIntention, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas edycji intencji mszalnej', error);
    
    // Check if error is about non-existing record
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas edycji intencji mszalnej" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Use Prisma transaction to delete intention and masses
    await prisma.$transaction(async (prismaTransaction) => {
      // Delete masses (will be cascaded by the database due to onDelete: Cascade)
      
      // Delete intention
      await prismaTransaction.intention.delete({
        where: { id: params.id }
      });
    });
    
    return NextResponse.json({ message: "Intencja mszalna została usunięta" }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania intencji mszalnej', error);
    
    // Check if error is about non-existing record
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas usuwania intencji mszalnej" }, { status: 500 });
  }
}
