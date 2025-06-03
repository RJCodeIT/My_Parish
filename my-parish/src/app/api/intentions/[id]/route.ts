import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// Definicje typów używane w kodzie
interface IntentionWithDays {
  id: string;
  title: string;
  weekStart: Date;
  weekEnd: Date | null;
  imageUrl: string | null;
  days: Array<{
    id: string;
    date: Date;
    intentionId: string;
    masses: Array<{
      id: string;
      time: string;
      dayId: string;
      intentions: Array<{
        id: string;
        intention: string;
        massId: string;
      }>;
    }>;
  }>;
}

interface MassIntentionData {
  intention: string;
}

interface MassData {
  time: string;
  intentions: MassIntentionData[];
}

interface DayData {
  date: string;
  masses: MassData[];
}

interface WeekIntentionData {
  title?: string;
  weekStart: string;
  weekEnd?: string;
  imageUrl?: string | null;
  days: DayData[];
}

// GET - Pobieranie intencji po ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log('Pobieranie intencji z ID:', id);
    
    // Sprawdź czy ID jest w formacie 'week_YYYY-MM-DD'
    const isWeekId = id.startsWith('week_');
    
    if (isWeekId) {
      // Pobieranie intencji tygodniowej
      const dateStr = id.replace('week_', '');
      const weekStartDate = new Date(dateStr);
      const weekEndDate = new Date(dateStr);
      weekEndDate.setDate(weekStartDate.getDate() + 6); // Pełny tydzień (pon-niedz)
      
      // Znajdź intencję, która zawiera ten tydzień
      const weekIntention = await prisma.intention.findFirst({
        where: {
          weekStart: {
            lte: weekEndDate
          },
          OR: [
            { weekEnd: { equals: undefined } },
            { weekEnd: { gte: weekStartDate } }
          ]
        },
        include: {
          days: {
            include: {
              masses: {
                include: {
                  intentions: true
                }
              }
            },
            orderBy: {
              date: 'asc'
            }
          }
        }
      }) as IntentionWithDays | null;
      
      if (!weekIntention) {
        return NextResponse.json({ error: "Intencje na ten tydzień nie zostały znalezione" }, { status: 404 });
      }
      
      // Przygotuj odpowiedź w jednolitym formacie
      const response = {
        _id: `week_${weekStartDate.toISOString().split('T')[0]}`,
        title: weekIntention.title,
        weekStart: weekIntention.weekStart.toISOString(),
        weekEnd: weekIntention.weekEnd ? weekIntention.weekEnd.toISOString() : weekIntention.weekStart.toISOString(),
        imageUrl: weekIntention.imageUrl,
        days: weekIntention.days.map(day => ({
          date: day.date.toISOString().split('T')[0],
          masses: day.masses.map(mass => ({
            time: mass.time,
            intentions: mass.intentions.map(intention => ({
              intention: intention.intention
            }))
          }))
        }))
      };
      
      return NextResponse.json(response, { status: 200 });
    } else {
      // Pobierz pojedynczą intencję po ID
      const intention = await prisma.intention.findUnique({
        where: { id },
        include: {
          days: {
            include: {
              masses: {
                include: {
                  intentions: true
                }
              }
            }
          }
        }
      }) as IntentionWithDays | null;
      
      if (!intention) {
        return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
      }
      
      // Przekształć dane do formatu odpowiedzi
      const response = {
        _id: intention.id,
        title: intention.title,
        weekStart: intention.weekStart.toISOString(),
        weekEnd: intention.weekEnd ? intention.weekEnd.toISOString() : intention.weekStart.toISOString(),
        imageUrl: intention.imageUrl,
        days: intention.days.map(day => ({
          date: day.date.toISOString().split('T')[0],
          masses: day.masses.map(mass => ({
            time: mass.time,
            intentions: mass.intentions.map(intention => ({
              intention: intention.intention
            }))
          }))
        }))
      };
      
      return NextResponse.json(response, { status: 200 });
    }
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnej" }, { status: 500 });
  }
}

// PUT - Aktualizacja intencji
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await request.json();
    console.log('Otrzymano dane do aktualizacji dla ID:', id);
    
    // Sprawdź czy ID jest w formacie 'week_YYYY-MM-DD'
    const isWeekId = id.startsWith('week_');
    
    // Używamy interfejsu IntentionWithDays zdefiniowanego na dole pliku
    
    let existingIntention: IntentionWithDays | null = null;
    
    if (isWeekId) {
      // Pobieranie intencji tygodniowej
      const dateStr = id.replace('week_', '');
      const weekStartDate = new Date(dateStr);
      const weekEndDate = new Date(dateStr);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      
      // Znajdź intencję, która zawiera ten tydzień
      existingIntention = await prisma.intention.findFirst({
        where: {
          weekStart: {
            lte: weekEndDate
          },
          OR: [
            { weekEnd: { equals: undefined } },
            { weekEnd: { gte: weekStartDate } }
          ]
        },
        include: {
          days: {
            include: {
              masses: {
                include: {
                  intentions: true
                }
              }
            }
          }
        }
      }) as IntentionWithDays | null;
      
      if (!existingIntention) {
        // Jeśli nie ma intencji na dany tydzień, stwórz nowe intencje
        if (body.days && Array.isArray(body.days)) {
          // Stwórz intencje dla całego tygodnia z przesłanych danych
          const result = await createWeekIntentions(body);
          return NextResponse.json(result, { status: 201 });
        } else {
          return NextResponse.json({ error: "Brak intencji na ten tydzień i nie przesłano danych dla dni" }, { status: 400 });
        }
      }
    } else {
      // Standardowe wyszukiwanie po ID
      existingIntention = await prisma.intention.findUnique({
        where: { id },
        include: {
          days: {
            include: {
              masses: {
                include: {
                  intentions: true
                }
              }
            }
          }
        }
      });
      
      if (!existingIntention) {
        return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
      }
    }
    
    // Przygotuj dane do aktualizacji
    const updateTitle = body.title || existingIntention.title;
    const updateImageUrl = body.imageUrl || existingIntention.imageUrl;
    
    // Użyj transakcji Prisma do aktualizacji
    const updatedIntention = await prisma.$transaction(async (tx) => {
      // 1. Aktualizuj podstawowe dane intencji
      // Używamy typowania dla bezpieczeństwa podczas aktualizacji
      const updateData: { title: string; imageUrl: string | null } = {
        title: updateTitle,
        imageUrl: updateImageUrl || null
      };
      
      await tx.intention.update({
        where: { id: existingIntention!.id },
        data: updateData
      });
      
      // 2. Usuń wszystkie istniejące dni (kaskadowo usunie msze i intencje)
      await tx.day.deleteMany({
        where: { intentionId: existingIntention!.id }
      });
      
      // 3. Dodaj nowe dni, msze i intencje
      if (body.days && Array.isArray(body.days)) {
        for (const dayData of body.days) {
          if (!dayData.date || !dayData.masses || !Array.isArray(dayData.masses)) continue;
          
          // Stwórz nowy dzień
          const newDay = await tx.day.create({
            data: {
              date: new Date(dayData.date),
              intentionId: existingIntention!.id
            }
          });
          
          // Dodaj msze do dnia
          for (const massData of dayData.masses) {
            if (!massData.time) continue;
            
            // Stwórz nową mszę
            const newMass = await tx.mass.create({
              data: {
                time: massData.time,
                dayId: newDay.id
              }
            });
            
            // Dodaj intencje do mszy
            if (massData.intentions && Array.isArray(massData.intentions)) {
              for (const intentionItem of massData.intentions) {
                if (!intentionItem.intention || !intentionItem.intention.trim()) continue;
                
                await tx.massIntention.create({
                  data: {
                    intention: intentionItem.intention,
                    massId: newMass.id
                  }
                });
              }
            }
          }
        }
      }
      
      // 4. Zwróć zaktualizowaną intencję ze wszystkimi relacjami
      return tx.intention.findUnique({
        where: { id: existingIntention!.id },
        include: {
          days: {
            include: {
              masses: {
                include: {
                  intentions: true
                }
              }
            },
            orderBy: {
              date: 'asc'
            }
          }
        }
      });
    });
    
    if (!updatedIntention) {
      return NextResponse.json({ error: "Nie udało się zaktualizować intencji" }, { status: 500 });
    }
    
    // Przygotuj odpowiedź w jednolitym formacie
    const transformedResponse = {
      _id: updatedIntention.id,
      title: updatedIntention.title,
      weekStart: updatedIntention.weekStart.toISOString(),
      weekEnd: updatedIntention.weekEnd ? updatedIntention.weekEnd.toISOString() : updatedIntention.weekStart.toISOString(),
      imageUrl: updatedIntention.imageUrl,
      days: updatedIntention.days.map(day => ({
        date: day.date.toISOString().split('T')[0],
        masses: day.masses.map(mass => ({
          time: mass.time,
          intentions: mass.intentions.map(mi => ({ intention: mi.intention }))
        }))
      }))
    };
    
    return NextResponse.json(transformedResponse, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas aktualizacji intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas aktualizacji intencji mszalnej" }, { status: 500 });
  }
}

// DELETE - Usuwanie intencji
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    console.log('Usuwanie intencji z ID:', id);
    
    // Sprawdź czy ID jest w formacie 'week_YYYY-MM-DD'
    const isWeekId = id.startsWith('week_');
    
    if (isWeekId) {
      // Usuwanie intencji tygodniowej
      const dateStr = id.replace('week_', '');
      const weekStartDate = new Date(dateStr);
      const weekEndDate = new Date(dateStr);
      weekEndDate.setDate(weekStartDate.getDate() + 6);
      // Znajdź intencję, która zawiera ten tydzień
      const weekIntention = await prisma.intention.findFirst({
        where: {
          weekStart: {
            lte: weekEndDate
          },
          OR: [
            { weekEnd: null },
            { weekEnd: { gte: weekStartDate } }
          ]
        }
      });
      if (!weekIntention) {
        return NextResponse.json({ error: "Intencje na ten tydzień nie zostały znalezione" }, { status: 404 });
      }
      // Usuń intencję tygodniową (kaskadowo usunie dni, msze i intencje mszalne)
      await prisma.intention.delete({
        where: { id: weekIntention.id }
      });
      
      return NextResponse.json({ message: "Intencje na tydzień zostały usunięte" }, { status: 200 });
    } else {
      // Standardowe usuwanie po ID
      const intention = await prisma.intention.findUnique({
        where: { id }
      });
      
      if (!intention) {
        return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
      }
      
      // Usuń intencję (dni, msze i intencje mszalne zostaną usunięte automatycznie - cascade delete)
      await prisma.intention.delete({
        where: { id }
      });
      
      return NextResponse.json({ message: "Intencja mszalna została usunięta" }, { status: 200 });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania intencji mszalnej', error);
    
    // Sprawdź, czy błąd dotyczy nieistniejącego rekordu
    // Definiujemy typ dla błędów Prismy
    type PrismaError = Error & { code?: string };
    if (error instanceof Error && 'code' in error && (error as PrismaError).code === 'P2025') {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas usuwania intencji mszalnej" }, { status: 500 });
  }
}

// Funkcja pomocnicza do tworzenia intencji na cały tydzień
async function createWeekIntentions(data: WeekIntentionData) {
  // Stwórz nową intencję z podstawowymi danymi
  // Use type assertion to bypass strict typing - Prisma schema allows null for weekEnd
  const weekIntention = await prisma.intention.create({
    data: {
      title: data.title || "Intencje na tydzień",
      weekStart: new Date(data.weekStart),
      // Use null for weekEnd as it's optional in the Prisma schema
      // Force casting to handle null/undefined type issues with Prisma
      weekEnd: data.weekEnd ? new Date(data.weekEnd) : (null as unknown as Date),
      imageUrl: data.imageUrl || null
    }
  }) as unknown as IntentionWithDays;
  
  // Dla każdego dnia w danych wejściowych
  if (data.days && Array.isArray(data.days)) {
    await Promise.all(data.days.map(async (dayData) => {
      if (!dayData.date) return;
      
      // Stwórz rekord dnia
      const day = await prisma.day.create({
        data: {
          date: new Date(dayData.date),
          intentionId: weekIntention.id
        }
      });
      
      // Dla każdej mszy w danym dniu
      if (dayData.masses && Array.isArray(dayData.masses)) {
        await Promise.all(dayData.masses.map(async (massData) => {
          if (!massData.time) return;
          
          // Stwórz rekord mszy
          const mass = await prisma.mass.create({
            data: {
              time: massData.time,
              dayId: day.id
            }
          });
          
          // Dodaj intencje do mszy
          if (massData.intentions && Array.isArray(massData.intentions)) {
            await Promise.all(massData.intentions.map(async (intentionItem) => {
              if (!intentionItem.intention || !intentionItem.intention.trim()) return;
              
              await prisma.massIntention.create({
                data: {
                  intention: intentionItem.intention,
                  massId: mass.id
                }
              });
            }));
          }
        }));
      }
    }));
  }
  
  // Zwróć stworzoną intencję tygodniową z pełną strukturą
  return prisma.intention.findUnique({
    where: { id: weekIntention.id },
    include: {
      days: {
        include: {
          masses: {
            include: {
              intentions: true
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      }
    }
  });
}
