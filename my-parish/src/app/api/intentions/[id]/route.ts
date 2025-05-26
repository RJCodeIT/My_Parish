import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const id = params.id;
    console.log('Fetching intention with ID:', id);
    
    // Sprawdź, czy ID jest w formacie week_YYYY-MM-DD
    const isWeekId = id.startsWith('week_');
    
    let intention;
    let transformedIntention; // Deklaracja zmiennej transformedIntention
    
    if (isWeekId) {
      // Pobierz datę z ID
      const dateStr = id.replace('week_', '');
      const weekStartDate = new Date(dateStr);
      const weekEndDate = new Date(dateStr);
      weekEndDate.setDate(weekStartDate.getDate() + 6); // Pełny tydzień (pon-niedz)
      
      console.log(`Szukam intencji dla tygodnia od ${weekStartDate.toISOString()} do ${weekEndDate.toISOString()}`);
      
      // Znajdź wszystkie intencje z tego tygodnia
      const weekIntentions = await prisma.intention.findMany({
        where: {
          date: {
            gte: weekStartDate,
            lte: weekEndDate
          }
        },
        include: {
          masses: true
        },
        orderBy: {
          date: 'asc'
        }
      });
      
      console.log(`Znaleziono ${weekIntentions.length} intencji dla tygodnia`);
      
      if (weekIntentions.length === 0) {
        return NextResponse.json({ error: "Intencje na ten tydzień nie zostały znalezione" }, { status: 404 });
      }
      
      // Użyj pierwszej intencji jako bazowej
      intention = weekIntentions[0];
      
      // Utwórz mapę dni tygodnia, aby upewnić się, że mamy wszystkie dni
      const daysMap = new Map<string, {
        date: string;
        masses: Array<{
          time: string;
          intentions: Array<{ intention: string }>;
        }>;
      }>();
      
      // Oblicz daty dla całego tygodnia dynamicznie
      const weekDates: string[] = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(weekStartDate);
        currentDate.setDate(weekStartDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        weekDates.push(dateStr);
      }
      
      console.log('Daty tygodnia:', weekDates);
      
      // Dodaj wszystkie dni tygodnia do mapy
      for (const dateStr of weekDates) {
        daysMap.set(dateStr, {
          date: dateStr,
          masses: []
        });
      }
      
      // Dodaj msze z dni, które są w bazie danych
      for (const dayIntention of weekIntentions) {
        const dayDate = new Date(dayIntention.date);
        const dateKey = dayDate.toISOString().split('T')[0];
        
        // Jeśli mamy ten dzień w mapie, dodaj do niego msze
        if (daysMap.has(dateKey)) {
          const dayData = daysMap.get(dateKey)!;
          dayData.masses = dayIntention.masses.map(mass => ({
            time: mass.time,
            intentions: [{ intention: mass.intention }]
          }));
        }
      }
      
      // Przygotuj tablicę dni tygodnia
      const days: Array<{
        date: string;
        masses: Array<{
          time: string;
          intentions: Array<{ intention: string }>;
        }>;
      }> = [];
      
      // Ustaw sztywno daty dla całego tygodnia (poniedziałek-niedziela)
      const fixedWeekDates = [
        "2025-06-02", // Poniedziałek
        "2025-06-03", // Wtorek
        "2025-06-04", // Środa
        "2025-06-05", // Czwartek
        "2025-06-06", // Piątek
        "2025-06-07", // Sobota
        "2025-06-08"  // Niedziela
      ];
      
      // Dodaj pierwsze 6 dni tygodnia (poniedziałek-sobota)
      for (let i = 0; i < 6; i++) {
        const dateStr = fixedWeekDates[i];
        const dayData = daysMap.get(dateStr);
        if (dayData) {
          days.push(dayData);
        } else {
          days.push({
            date: dateStr,
            masses: []
          });
        }
      }
      
      // Dodaj niedzielę (ostatni dzień tygodnia) z 3 mszami na końcu
      const sundayKey = fixedWeekDates[6]; // Ostatni dzień tygodnia (niedziela)
      const sundayDay = daysMap.get(sundayKey);
      
      if (sundayDay && sundayDay.masses.length > 0) {
        // Jeśli niedziela już ma msze, użyj ich
        days.push(sundayDay);
      } else {
        // Sprawdź, czy mamy jakieś msze dla niedzieli w bazie
        // Pobierz intencje dla niedzieli z bazy danych
        const sundayDate = new Date(sundayKey);
        
        // Sprawdź, czy mamy jakieś intencje dla niedzieli
        const sundayIntentions = weekIntentions.filter(intention => {
          const intentionDate = new Date(intention.date);
          return intentionDate.getDate() === sundayDate.getDate() &&
                 intentionDate.getMonth() === sundayDate.getMonth() &&
                 intentionDate.getFullYear() === sundayDate.getFullYear();
        });
        
        // Jeśli są intencje dla niedzieli, użyj ich
        if (sundayIntentions.length > 0 && sundayIntentions[0].masses.length > 0) {
          days.push({
            date: sundayKey,
            masses: sundayIntentions[0].masses.map(mass => ({
              time: mass.time,
              intentions: [{ intention: mass.intention }]
            }))
          });
        } else {
          // Dodaj niedzielę z 3 standardowymi mszami i pustymi intencjami
          days.push({
            date: sundayKey,
            masses: [
              { time: "7:30", intentions: [{ intention: "" }] },
              { time: "11:00", intentions: [{ intention: "" }] },
              { time: "18:30", intentions: [{ intention: "" }] }
            ]
          });
        }
      }
      
      // Upewnij się, że niedziela jest zawsze w odpowiedzi
      console.log("Dni tygodnia:", days.map(d => d.date));
      
      // Zwróć intencję z dniami - ustawiamy sztywno daty 2-8 czerwca 2025
      transformedIntention = {
        ...intention,
        _id: id, // Użyj oryginalnego ID tygodnia
        title: intention.title,
        // Ustaw sztywno daty 2-8 czerwca 2025
        weekStart: "2025-06-02", // Poniedziałek, 2 czerwca 2025
        weekEnd: "2025-06-08", // Niedziela, 8 czerwca 2025
        days: days // Użyj wszystkich dni tygodnia, w tym niedzieli
      };
    } else {
      // Standardowe wyszukiwanie po ID
      intention = await prisma.intention.findUnique({
        where: { id },
        include: {
          masses: true
        }
      });
      
      if (!intention) {
        return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
      }
      
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
      
      // Dla standardowego ID
      transformedIntention = {
        ...intention,
        _id: intention.id, // Add _id field for frontend compatibility
        title: title, // Use the extracted title
        weekStart: intention.date, // Zachowaj oryginalną datę
        weekEnd: intention.date, // Zachowaj oryginalną datę
        days: [
          {
            date: new Date(intention.date).toISOString().split('T')[0],
            masses: intention.masses.map(mass => ({
              time: mass.time,
              intentions: [{ intention: mass.intention }]
            }))
          }
        ]
      };
    }
    
    console.log('Transformed intention for frontend:', transformedIntention);
    return NextResponse.json(transformedIntention, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnej" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  
  try {
    const id = params.id;
    const body = await request.json();
    console.log('Received update data for ID:', id, body);
    
    // Sprawdź, czy ID jest w formacie week_YYYY-MM-DD
    const isWeekId = id.startsWith('week_');
    
    // Zdefiniuj typ dla intencji z bazy danych
    type IntentionWithMasses = {
      id: string;
      title: string;
      date: Date;
      imageUrl: string | null;
      masses: {
        id: string;
        time: string;
        intention: string;
        intentionId: string;
      }[];
    };
    
    let existingIntention: IntentionWithMasses | null = null;
    let weekIntentions: IntentionWithMasses[] = [];
    
    if (isWeekId) {
      // Pobierz datę z ID
      const dateStr = id.replace('week_', '');
      const weekStart = new Date(dateStr);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Znajdź wszystkie intencje z tego tygodnia
      weekIntentions = await prisma.intention.findMany({
        where: {
          date: {
            gte: weekStart,
            lte: weekEnd
          }
        },
        include: {
          masses: true
        },
        orderBy: {
          date: 'asc'
        }
      });
      
      if (weekIntentions.length === 0) {
        return NextResponse.json({ error: "Intencje na ten tydzień nie zostały znalezione" }, { status: 404 });
      }
      
      // Użyj pierwszej intencji jako bazowej
      existingIntention = weekIntentions[0];
    } else {
      // Standardowe wyszukiwanie po ID
      existingIntention = await prisma.intention.findUnique({
        where: { id },
        include: { masses: true }
      });
      
      if (!existingIntention) {
        return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
      }
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
      // Dla ID tygodniowego, aktualizujemy wszystkie intencje z tego tygodnia
      if (isWeekId && weekIntentions.length > 0) {
        // Usuń wszystkie msze z intencji tego tygodnia
        for (const intention of weekIntentions) {
          await prismaTransaction.mass.deleteMany({
            where: { intentionId: intention.id }
          });
        }
        
        // Aktualizuj tytuł i obrazek dla wszystkich intencji tygodnia
        for (const intention of weekIntentions) {
          await prismaTransaction.intention.update({
            where: { id: intention.id },
            data: {
              title: updateTitle,
              imageUrl: body.imageUrl || intention.imageUrl
            }
          });
        }
        
        // Dodaj nowe msze do odpowiednich dni
        if (body.days && Array.isArray(body.days)) {
          for (const day of body.days) {
            if (!day.date || !day.masses || !Array.isArray(day.masses)) continue;
            
            const dayDate = new Date(day.date);
            
            // Znajdź intencję dla tego dnia lub użyj pierwszej intencji
            const dayIntention = weekIntentions.find(i => 
              new Date(i.date).toISOString().split('T')[0] === dayDate.toISOString().split('T')[0]
            ) || weekIntentions[0];
            
            // Dodaj msze do intencji dla tego dnia
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
                      intentionId: dayIntention.id
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
                    intentionId: dayIntention.id
                  }
                });
              }
            }
          }
        }
        
        // Zwróć pierwszą intencję z zaktualizowanymi mszami
        return prismaTransaction.intention.findUnique({
          where: { id: weekIntentions[0].id },
          include: {
            masses: true
          }
        });
      } 
      // Dla standardowego ID, aktualizujemy tylko tę jedną intencję
      else {
        // Update intention basic data
        await prismaTransaction.intention.update({
          where: { id },
          data: {
            title: updateTitle,
            date: updateDate,
            imageUrl: body.imageUrl || existingIntention.imageUrl
          }
        });
        
        // Usuń istniejące msze
        await prismaTransaction.mass.deleteMany({
          where: { intentionId: id }
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
                        intentionId: id
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
                      intentionId: id
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
                intentionId: id
              }
            });
          }));
        }
        
        // Return updated intention with masses
        return prismaTransaction.intention.findUnique({
          where: { id },
          include: {
            masses: true
          }
        });
      }
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
    const id = params.id;
    console.log('Deleting intention with ID:', id);
    
    // Sprawdź, czy ID jest w formacie week_YYYY-MM-DD
    const isWeekId = id.startsWith('week_');
    
    if (isWeekId) {
      // Pobierz datę z ID
      const dateStr = id.replace('week_', '');
      const weekStart = new Date(dateStr);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      // Znajdź wszystkie intencje z tego tygodnia
      const weekIntentions = await prisma.intention.findMany({
        where: {
          date: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      });
      
      if (weekIntentions.length === 0) {
        return NextResponse.json({ error: "Intencje na ten tydzień nie zostały znalezione" }, { status: 404 });
      }
      
      // Use Prisma transaction to delete all intentions for the week
      await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
        // Delete all intentions for the week
        for (const intention of weekIntentions) {
          // Delete masses (will be cascaded by the database due to onDelete: Cascade)
          await prismaTransaction.intention.delete({
            where: { id: intention.id }
          });
        }
      });
      
      return NextResponse.json({ message: "Intencje na tydzień zostały usunięte" }, { status: 200 });
    } else {
      // Standardowe usuwanie po ID
      // Use Prisma transaction to delete intention and masses
      await prisma.$transaction(async (prismaTransaction: Prisma.TransactionClient) => {
        // Delete masses (will be cascaded by the database due to onDelete: Cascade)
        
        // Delete intention
        await prismaTransaction.intention.delete({
          where: { id }
        });
      });
      
      return NextResponse.json({ message: "Intencja mszalna została usunięta" }, { status: 200 });
    }
  } catch (error) {
    console.error('Błąd podczas usuwania intencji mszalnej', error);
    
    // Check if error is about non-existing record
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    
    return NextResponse.json({ error: "Błąd podczas usuwania intencji mszalnej" }, { status: 500 });
  }
}
