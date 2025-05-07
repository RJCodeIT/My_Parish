import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "../../../../generated/prisma";

const prisma = new PrismaClient();

// Pobranie parafianina po ID
export async function GET(request: Request) {
  // Get the URL from the request
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
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
export async function PUT(request: Request) {
  // Get the URL from the request
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  console.log("API PUT request for parishioner with ID:", id);
  
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    
    // Użyj transakcji Prisma do aktualizacji parafianina i jego danych
    const updatedParishioner = await prisma.$transaction(async (prismaTransaction) => {
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
      
      // Aktualizuj podstawowe dane parafianina
      await prismaTransaction.parishioner.update({
        where: { id },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
          phoneNumber: body.phoneNumber || undefined,
          email: body.email || undefined,
          notes: body.notes || undefined
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
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Error updating parishioner" }, { status: 500 });
  }
}

// Usunięcie parafianina
export async function DELETE(request: Request) {
  // Get the URL from the request
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const id = pathParts[pathParts.length - 1];
  
  console.log("API DELETE request for parishioner with ID:", id);
  
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    // Użyj transakcji Prisma do usunięcia parafianina i powiązanych danych
    await prisma.$transaction(async (prismaTransaction) => {
      // Pobierz parafianina z ID adresu
      const parishioner = await prismaTransaction.parishioner.findUnique({
        where: { id },
        select: { addressId: true }
      });
      
      // Usuń członkostwa w grupach
      await prismaTransaction.groupMember.deleteMany({
        where: { parishionerId: id }
      });
      
      // Usuń parafianina
      await prismaTransaction.parishioner.delete({
        where: { id }
      });
      
      // Usuń adres jeśli istnieje
      if (parishioner?.addressId) {
        await prismaTransaction.address.delete({
          where: { id: parishioner.addressId }
        });
      }
    });
    
    return NextResponse.json({ message: "Parishioner deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting parishioner:', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Error deleting parishioner" }, { status: 500 });
  }
}
