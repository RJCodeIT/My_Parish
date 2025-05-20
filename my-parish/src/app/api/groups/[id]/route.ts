import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

/**
 * Pobierz grupę o podanym ID.
 * 
 * @param request - Obiekt żądania.
 * @param context - Kontekst zawierający parametry ścieżki.
 * @returns Odpowiedź serwera z grupą lub błędem.
 */

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    console.log("Fetching group with ID:", params.id);
    
    // Try to find the group using the provided ID
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
    
    // Transform the data to include both id and _id for compatibility
    const transformedGroup = {
      ...group,
      _id: group.id, // Add _id field for frontend compatibility
      // Transform leader data to match the expected format in the frontend
      leaderId: {
        ...group.leader,
        _id: group.leader.id, // Add _id to leader for compatibility
        id: group.leader.id
      },
      // Transform members data to be an array of parishioner objects
      members: group.members.map(member => ({
        ...member.parishioner,
        _id: member.parishioner.id, // Add _id to each parishioner
        id: member.parishioner.id
      }))
    };
    
    // Create a new object without the leader field to avoid confusion
    const finalGroup = {
      ...transformedGroup,
      leader: undefined
    };
    
    console.log("Returning transformed group:", finalGroup);
    return NextResponse.json(finalGroup, { status: 200 });
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
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const body = await request.json();
    console.log("Updating group with ID:", params.id, "with data:", body);
    
    // Validate required fields
    if (!body.name || !body.leaderId) {
      return NextResponse.json(
        { error: "Nazwa i lider są wymaganymi polami" },
        { status: 400 }
      );
    }
    
    // Make sure we're using the correct ID format for the leader
    const leaderIdToUse = body.leaderId;
    
    // Użyj transakcji Prisma do aktualizacji grupy i jej członków
    const updatedGroup = await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
      // Aktualizuj podstawowe dane grupy
      await prismaTransaction.group.update({
        where: { id: params.id },
        data: {
          name: body.name,
          description: body.description,
          meetingSchedule: body.meetingSchedule || undefined,
          leader: {
            connect: { id: leaderIdToUse }
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
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
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
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    // Użyj transakcji Prisma do usunięcia grupy i jej członków
    await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
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
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Grupa nie znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd usuwania grupy" }, { status: 500 });
  }
}
