import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  
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
    
    // Transform the data for frontend compatibility with the weekly format
    const intentionDate = new Date(intention.date);
    
    // Calculate week start and end dates
    const dayOfWeek = intentionDate.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday as first day
    
    const weekStart = new Date(intentionDate);
    weekStart.setDate(intentionDate.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    // Format the title to extract the main part if it contains a day name
    let title = intention.title;
    if (title.includes('-') && (title.includes('poniedziałek') || title.includes('wtorek') || 
        title.includes('środa') || title.includes('czwartek') || title.includes('piątek') || 
        title.includes('sobota') || title.includes('niedziela'))) {
      const titleParts = title.split('-');
      if (titleParts.length > 1) {
        title = titleParts[0].trim();
      }
    }
    
    const transformedIntention = {
      ...intention,
      _id: intention.id, // Add _id field for frontend compatibility
      title: title, // Use the extracted title
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      days: [
        {
          date: intention.date,
          masses: intention.masses.map(mass => ({
            time: mass.time,
            intentions: [{ intention: mass.intention }]
          }))
        }
      ]
    };
    
    console.log('Transformed single intention for frontend:', transformedIntention);
    return NextResponse.json(transformedIntention, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnej" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const body = await request.json();
    console.log('Received update data:', body);
    
    // Pobierz aktualną intencję, aby sprawdzić, czy istnieje
    const existingIntention = await prisma.intention.findUnique({
      where: { id: params.id },
      include: { masses: true }
    });
    
    if (!existingIntention) {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    // Przygotuj dane do aktualizacji
    let updateDate = existingIntention.date;
    const updateTitle = body.title || existingIntention.title;
    
    // Jeśli otrzymaliśmy dane w formacie tygodniowym, użyj daty z pierwszego dnia
    if (body.days && Array.isArray(body.days) && body.days.length > 0) {
      // Użyj daty z pierwszego dnia, jeśli jest dostępna
      if (body.days[0].date) {
        updateDate = new Date(body.days[0].date);
      }
    }
    
    // Use Prisma transaction to update intention and masses
    const updatedIntention = await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
      // Update intention basic data
      await prismaTransaction.intention.update({
        where: { id: params.id },
        data: {
          title: updateTitle,
          date: updateDate,
          imageUrl: body.imageUrl || existingIntention.imageUrl
        }
      });
      
      // Usuń istniejące msze
      await prismaTransaction.mass.deleteMany({
        where: { intentionId: params.id }
      });
      
      // Dodaj nowe msze
      if (body.days && Array.isArray(body.days)) {
        // Obsługa nowego formatu z dniami i intencjami
        for (const day of body.days) {
          if (day.masses && Array.isArray(day.masses)) {
            for (const mass of day.masses) {
              if (!mass.time) continue;
              
              // Jeśli mamy nowy format z tablicą intencji
              if (mass.intentions && Array.isArray(mass.intentions) && mass.intentions.length > 0) {
                // Połącz wszystkie intencje w jeden tekst
                const intentionText = mass.intentions
                  .map((i: { intention: string }) => i.intention)
                  .filter((text: string) => text.trim())
                  .join('; ');
                
                if (intentionText) {
                  await prismaTransaction.mass.create({
                    data: {
                      time: mass.time,
                      intention: intentionText,
                      intentionId: params.id
                    }
                  });
                }
              } 
              // Jeśli mamy stary format z pojedynczą intencją
              else if (mass.intention) {
                await prismaTransaction.mass.create({
                  data: {
                    time: mass.time,
                    intention: mass.intention,
                    intentionId: params.id
                  }
                });
              }
            }
          }
        }
      } 
      // Obsługa starego formatu z tablicą masses
      else if (body.masses && Array.isArray(body.masses) && body.masses.length > 0) {
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
    
    // Transformuj odpowiedź do formatu tygodniowego dla kompatybilności z frontendem
    const intentionDate = new Date(updatedIntention.date);
    
    // Oblicz daty początku i końca tygodnia
    const dayOfWeek = intentionDate.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    const weekStart = new Date(intentionDate);
    weekStart.setDate(intentionDate.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    const transformedResponse = {
      ...updatedIntention,
      _id: updatedIntention.id,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      days: [
        {
          date: updatedIntention.date,
          masses: updatedIntention.masses.map(mass => ({
            time: mass.time,
            intentions: [{ intention: mass.intention }]
          }))
        }
      ]
    };
    
    return NextResponse.json(transformedResponse, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas edycji intencji mszalnej', error);
    
    // Check if error is about non-existing record
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas edycji intencji mszalnej" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    // Use Prisma transaction to delete intention and masses
    await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
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
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas usuwania intencji mszalnej" }, { status: 500 });
  }
}
