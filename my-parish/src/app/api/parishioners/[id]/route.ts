import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { TransactionClient } from "@/lib/prisma-types";

// Pobranie parafianina po ID
export async function GET(_request: NextRequest, context: { params: { id: string } }) {
  // Get the ID from context params
  const id = context.params.id;
  
  console.log("API GET request for parishioner with ID:", id);
  
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const parishioner = await prisma.parishioner.findUnique({
      where: { id },
      include: {
        address: true,
        sacraments: true,
        leadingGroups: true,
        memberGroups: {
          include: {
            group: true
          }
        }
      }
    });
    
    if (!parishioner) {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }
    
    return NextResponse.json(parishioner, { status: 200 });
  } catch (error) {
    console.error('Error fetching parishioner:', error);
    return NextResponse.json({ error: "Error fetching parishioner" }, { status: 500 });
  }
}

// Aktualizacja danych parafianina
export async function PUT(_request: NextRequest, { params }: { params: { id: string } }) {
  // Get the ID from context params
  const id = params.id;
  
  console.log("API PUT request for parishioner with ID:", id);
  
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const body = await _request.json();
    
    // Użyj transakcji Prisma do aktualizacji parafianina i jego danych
    const updatedParishioner = await prisma.$transaction(async (prismaTransaction: TransactionClient) => {
      // Aktualizuj adres jeśli podano
      if (body.address) {
        const currentParishioner = await prismaTransaction.parishioner.findUnique({
          where: { id },
          select: { addressId: true }
        });
        
        if (currentParishioner?.addressId) {
          // Aktualizuj istniejący adres
          await prismaTransaction.address.update({
            where: { id: currentParishioner.addressId },
            data: {
              street: body.address.street,
              houseNumber: body.address.houseNumber,
              postalCode: body.address.postalCode,
              city: body.address.city
            }
          });
        } else {
          // Utwórz nowy adres
          const address = await prismaTransaction.address.create({
            data: {
              street: body.address.street,
              houseNumber: body.address.houseNumber,
              postalCode: body.address.postalCode,
              city: body.address.city
            }
          });
          
          // Powiąż adres z parafianinem
          await prismaTransaction.parishioner.update({
            where: { id },
            data: { addressId: address.id }
          });
        }
      }
      
      // Aktualizuj podstawowe dane parafianina + opcjonalnie dane zgonu/pogrzebu
      const deceased = body.deceased || undefined;
      const funeral = body.funeral || undefined;

      await prismaTransaction.parishioner.update({
        where: { id },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
          phoneNumber: body.phoneNumber || undefined,
          email: body.email || undefined,
          notes: body.notes || undefined,

          // Update deceased data if provided (nested structure)
          isDeceased: typeof body.isDeceased === 'boolean' ? body.isDeceased : (deceased ? true : undefined),
          deceasedAt: deceased?.deceasedAt ? new Date(deceased.deceasedAt) : (body.deceasedAt ? new Date(body.deceasedAt) : undefined),
          placeOfDeath: deceased?.placeOfDeath ?? body.placeOfDeath ?? undefined,
          deathCertificateNumber: deceased?.deathCertificateNumber ?? body.deathCertificateNumber ?? undefined,
          deathCertificateIssuedBy: deceased?.deathCertificateIssuedBy ?? body.deathCertificateIssuedBy ?? undefined,
          deathReporterName: deceased?.deathReporterName ?? body.deathReporterName ?? undefined,
          deathReporterRelation: deceased?.deathReporterRelation ?? body.deathReporterRelation ?? undefined,
          deathReporterPhone: deceased?.deathReporterPhone ?? body.deathReporterPhone ?? undefined,
          deathNotes: deceased?.deathNotes ?? body.deathNotes ?? undefined,

          // Update funeral data if provided (nested structure)
          funeralDate: funeral?.funeralDate ? new Date(funeral.funeralDate) : (body.funeralDate ? new Date(body.funeralDate) : undefined),
          funeralLocation: funeral?.funeralLocation ?? body.funeralLocation ?? undefined,
          cemeteryName: funeral?.cemeteryName ?? body.cemeteryName ?? undefined,
          cremation: typeof (funeral?.cremation) === 'boolean' ? funeral?.cremation : (typeof body.cremation === 'boolean' ? body.cremation : undefined),
          officiant: funeral?.officiant ?? body.officiant ?? undefined,
          funeralNotes: funeral?.funeralNotes ?? body.funeralNotes ?? undefined,
        }
      });
      
      // Aktualizuj sakramenty jeśli podano
      if (body.sacraments && Array.isArray(body.sacraments)) {
        // Usuń istniejące sakramenty
        await prismaTransaction.sacrament.deleteMany({
          where: { parishionerId: id }
        });
        
        // Utwórz nowe sakramenty
        if (body.sacraments.length > 0) {
          await Promise.all(body.sacraments.map((sacrament: { type: string; date: string }) => {
            return prismaTransaction.sacrament.create({
              data: {
                type: sacrament.type,
                date: new Date(sacrament.date),
                parishionerId: id
              }
            });
          }));
        }
      }
      
      // Pobierz zaktualizowanego parafianina wraz z danymi
      return prismaTransaction.parishioner.findUnique({
        where: { id },
        include: {
          address: true,
          sacraments: true,
          leadingGroups: true,
          memberGroups: {
            include: {
              group: true
            }
          }
        }
      });
    });
    
    if (!updatedParishioner) {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Parishioner updated successfully", parishioner: updatedParishioner }, { status: 200 });
  } catch (error) {
    console.error('Error updating parishioner:', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Error updating parishioner" }, { status: 500 });
  }
}

// Usunięcie parafianina
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  // Get the ID from context params
  const id = params.id;
  
  console.log("API DELETE request for parishioner with ID:", id);
  
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    // Najpierw sprawdź, czy parafianin należy do jakiejś grupy
    const parishionerWithGroups = await prisma.parishioner.findUnique({
      where: { id },
      include: {
        memberGroups: {
          include: {
            group: true
          }
        },
        leadingGroups: true
      }
    });
    
    if (!parishionerWithGroups) {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }
    
    // Sprawdź, czy parafianin jest członkiem jakiejś grupy
    if (parishionerWithGroups.memberGroups.length > 0) {
      const groupName = parishionerWithGroups.memberGroups[0].group.name;
      return NextResponse.json({ 
        error: "Parishioner belongs to a group", 
        groupName: groupName 
      }, { status: 400 });
    }
    
    // Sprawdź, czy parafianin jest liderem jakiejś grupy
    if (parishionerWithGroups.leadingGroups.length > 0) {
      // Pobierz pełne dane grupy, aby mieć dostęp do nazwy
      const leaderGroup = await prisma.group.findUnique({
        where: { id: parishionerWithGroups.leadingGroups[0].id }
      });
      
      const groupName = leaderGroup?.name || "Nieznana grupa";
      return NextResponse.json({ 
        error: "Parishioner is a leader of a group", 
        groupName: groupName 
      }, { status: 400 });
    }
    
    // Użyj transakcji Prisma do usunięcia parafianina i powiązanych danych
    await prisma.$transaction(async (prismaTransaction: TransactionClient) => {
      // Usuń sakramenty parafianina
      await prismaTransaction.sacrament.deleteMany({
        where: { parishionerId: id }
      });
      
      // Usuń parafianina
      await prismaTransaction.parishioner.delete({
        where: { id }
      });
      
      // Usuń adres jeśli istnieje
      if (parishionerWithGroups.addressId) {
        await prismaTransaction.address.delete({
          where: { id: parishionerWithGroups.addressId }
        });
      }
    });
    
    return NextResponse.json({ message: "Parishioner deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting parishioner:', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Error deleting parishioner" }, { status: 500 });
  }
}
