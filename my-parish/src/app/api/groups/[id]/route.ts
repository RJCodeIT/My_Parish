import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "../../../../generated/prisma";

const prisma = new PrismaClient();

/**
 * Pobierz grupę o podanym ID.
 * 
 * @param req - Obiekt żądania.
 * @param params - Parametry ścieżki, zawierające ID grupy.
 * @returns Odpowiedź serwera z grupą lub błędem.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const group = await prisma.group.findUnique({
      where: { id: params.id },
      include: {
        leader: true,
        members: {
          include: {
            parishioner: true
          }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: "Grupa nie znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.error('Błąd pobierania grupy:', error);
    return NextResponse.json({ error: "Błąd pobierania grupy" }, { status: 500 });
  }
}

/**
 * Zaktualizuj grupę o podanym ID.
 * 
 * @param req - Obiekt żądania.
 * @param params - Parametry ścieżki, zawierające ID grupy.
 * @returns Odpowiedź serwera z zaktualizowaną grupą lub błędem.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.leaderId) {
      return NextResponse.json(
        { error: "Name and leader are required fields" },
        { status: 400 }
      );
    }
    
    // Użyj transakcji Prisma do aktualizacji grupy i jej członków
    const updatedGroup = await prisma.$transaction(async (prismaTransaction) => {
      // Aktualizuj podstawowe dane grupy
      await prismaTransaction.group.update({
        where: { id: params.id },
        data: {
          name: body.name,
          description: body.description,
          meetingSchedule: body.meetingSchedule || undefined,
          leader: {
            connect: { id: body.leaderId }
          }
        }
      });

      // Jeśli podano członków, zaktualizuj członków grupy
      if (body.members && Array.isArray(body.members)) {
        // Pobierz aktualnych członków
        const currentMembers = await prismaTransaction.groupMember.findMany({
          where: { groupId: params.id },
          select: { parishionerId: true }
        });
        
        const currentMemberIds = currentMembers.map(m => m.parishionerId);
        const newMemberIds = body.members;
        
        // Członkowie do usunięcia (są w aktualnych, ale nie ma ich w nowych)
        const membersToRemove = currentMemberIds.filter((id: string) => !newMemberIds.includes(id));
        
        // Członkowie do dodania (są w nowych, ale nie ma ich w aktualnych)
        const membersToAdd = newMemberIds.filter((id: string) => !currentMemberIds.includes(id));
        
        // Usuń członków
        if (membersToRemove.length > 0) {
          await prismaTransaction.groupMember.deleteMany({
            where: {
              groupId: params.id,
              parishionerId: { in: membersToRemove }
            }
          });
        }
        
        // Dodaj nowych członków
        if (membersToAdd.length > 0) {
          await Promise.all(membersToAdd.map((memberId: string) => {
            return prismaTransaction.groupMember.create({
              data: {
                groupId: params.id,
                parishionerId: memberId
              }
            });
          }));
        }
      }

      // Pobierz zaktualizowaną grupę ze wszystkimi relacjami
      return prismaTransaction.group.findUnique({
        where: { id: params.id },
        include: {
          leader: true,
          members: {
            include: {
              parishioner: true
            }
          }
        }
      });
    });

    if (!updatedGroup) {
      return NextResponse.json({ error: "Grupa nie znaleziona" }, { status: 404 });
    }

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.error('Błąd aktualizacji grupy:', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Grupa nie znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd aktualizacji grupy: " + error }, { status: 500 });
  }
}

/**
 * Usuń grupę o podanym ID.
 * 
 * @param req - Obiekt żądania.
 * @param params - Parametry ścieżki, zawierające ID grupy.
 * @returns Odpowiedź serwera z potwierdzeniem usunięcia lub błędem.
 */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Użyj transakcji Prisma do usunięcia grupy i jej członków
    await prisma.$transaction(async (prismaTransaction) => {
      // Usuń wszystkich członków grupy najpierw
      await prismaTransaction.groupMember.deleteMany({
        where: { groupId: params.id }
      });

      // Usuń grupę
      await prismaTransaction.group.delete({
        where: { id: params.id }
      });
    });

    return NextResponse.json({ message: "Grupa usunięta pomyślnie" }, { status: 200 });
  } catch (error) {
    console.error('Błąd usuwania grupy:', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Grupa nie znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd usuwania grupy" }, { status: 500 });
  }
}
