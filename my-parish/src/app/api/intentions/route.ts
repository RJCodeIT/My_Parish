import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Use the current schema structure
    const intentions = await prisma.intention.findMany({
      include: {
        masses: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Define the weekly intention type
    interface WeeklyIntention {
      _id: string;
      title: string;
      date: string;
      weekStart: string;
      weekEnd: string;
      imageUrl?: string;
      masses: { time: string; intention: string }[];
      days: Record<string, { time: string; intention: string }[]>;
    }
    
    // Group intentions by week
    const weeklyIntentions: Record<string, WeeklyIntention> = {};
    
    intentions.forEach(intention => {
      // Get the week start date (Monday) for the intention date
      const intentionDate = new Date(intention.date);
      const dayOfWeek = intentionDate.getDay(); // 0 = Sunday, 1 = Monday, ...
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust for Monday as first day
      
      const weekStart = new Date(intentionDate);
      weekStart.setDate(intentionDate.getDate() - diff);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      // Create a key for the week
      const weekKey = weekStart.toISOString().split('T')[0];
      
      // Initialize the week if it doesn't exist
      if (!weeklyIntentions[weekKey]) {
        // Użyj oryginalnego tytułu intencji, jeśli istnieje i nie zawiera daty
        // W przeciwnym razie wygeneruj standardowy tytuł tygodnia
        let weekTitle = intention.title;
        
        // Jeśli tytuł zawiera datę (prawdopodobnie automatycznie wygenerowany), użyj standardowego formatu
        if (weekTitle.includes('-') && (weekTitle.includes('poniedziałek') || weekTitle.includes('wtorek') || 
            weekTitle.includes('środa') || weekTitle.includes('czwartek') || weekTitle.includes('piątek') || 
            weekTitle.includes('sobota') || weekTitle.includes('niedziela'))) {
          // Wyciągnij główny tytuł (część przed myślnikiem i dniem tygodnia)
          const titleParts = weekTitle.split('-');
          if (titleParts.length > 1) {
            weekTitle = titleParts[0].trim();
          } else {
            weekTitle = `Intencje na tydzień ${weekStart.toLocaleDateString('pl-PL')} - ${weekEnd.toLocaleDateString('pl-PL')}`;
          }
        }
        
        weeklyIntentions[weekKey] = {
          _id: `week_${weekKey}`,
          title: `${weekTitle} ${weekStart.toLocaleDateString('pl-PL')} - ${weekEnd.toLocaleDateString('pl-PL')}`,
          date: weekStart.toISOString(),
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          masses: [],
          days: {}
        };
      }
      
      // Add the intention's masses to the week
      intention.masses.forEach(mass => {
        // Format the date as YYYY-MM-DD
        const dateKey = intentionDate.toISOString().split('T')[0];
        
        // Initialize the day if it doesn't exist
        if (!weeklyIntentions[weekKey].days[dateKey]) {
          weeklyIntentions[weekKey].days[dateKey] = [];
        }
        
        // Add the mass to the day
        weeklyIntentions[weekKey].days[dateKey].push({
          time: mass.time,
          intention: mass.intention
        });
        
        // Also add to the flat masses array for backward compatibility
        weeklyIntentions[weekKey].masses.push({
          time: mass.time,
          intention: mass.intention
        });
      });
    });
    
    // Define the day type for the result
    interface DayWithMasses {
      date: string;
      masses: { time: string; intention: string }[];
    }
    
    // Define the result type
    interface WeeklyIntentionResult {
      _id: string;
      title: string;
      date: string;
      weekStart: string;
      weekEnd: string;
      imageUrl?: string;
      masses: { time: string; intention: string }[];
      days: DayWithMasses[];
    }
    
    // Convert the days object to an array for each week
    const result = Object.values(weeklyIntentions).map((week) => {
      // Convert days object to array
      const daysArray: DayWithMasses[] = Object.entries(week.days).map(([dateStr, masses]) => ({
        date: dateStr,
        masses: masses
      }));
      
      // Sort days by date
      daysArray.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return {
        ...week,
        days: daysArray
      } as WeeklyIntentionResult;
    });
    
    console.log('Weekly intentions for frontend:', result);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnych', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnych" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const weekStart = formData.get('weekStart') as string;
    const weekEnd = formData.get('weekEnd') as string;
    const daysData = JSON.parse(formData.get('days') as string);
    const image = formData.get('image') as File | null;

    // Group all masses by day for better organization in the database
    // This will help us maintain the weekly structure while using the current schema
    const groupedByDay: Record<string, { date: Date; masses: { time: string; intention: string }[] }> = {};
    
    // Process each day and its masses
    for (const day of daysData) {
      if (!day.date) continue;
      
      const dateKey = new Date(day.date).toISOString().split('T')[0];
      
      if (!groupedByDay[dateKey]) {
        groupedByDay[dateKey] = {
          date: new Date(day.date),
          masses: []
        };
      }
      
      // Process each mass and its intentions
      for (const mass of day.masses) {
        if (!mass.time || !mass.intentions || mass.intentions.length === 0) continue;
        
        // Combine all intentions for this mass
        const intentionsText = mass.intentions
          .map((i: { intention: string }) => i.intention)
          .filter((text: string) => text.trim())
          .join('; ');
        
        if (!intentionsText) continue;
        
        // Add to the day's masses
        groupedByDay[dateKey].masses.push({
          time: mass.time,
          intention: intentionsText
        });
      }
    }
    
    // Zdefiniuj typ dla intencji zwracanych z bazy danych
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
    
    // Create a single intention record for each day
    const createdIntentions: IntentionWithMasses[] = [];
    const weekTitle = title;
    
    for (const [, dayData] of Object.entries(groupedByDay)) {
      if (dayData.masses.length === 0) continue;
      
      // Format the day name for the title
      const dayName = dayData.date.toLocaleDateString('pl-PL', { weekday: 'long' });
      // Użyj tytułu tygodnia jako podstawy do tytułu dnia
      const dayTitle = `${weekTitle} - ${dayName}`;
      
      // Create the intention for this day
      const newIntention = await prisma.intention.create({
        data: {
          title: dayTitle,
          date: dayData.date,
          imageUrl: image ? image.name : undefined,
          // Create all masses for this day
          masses: {
            create: dayData.masses
          }
        },
        include: {
          masses: true
        }
      });
      
      // Dodaj utworzoną intencję do tablicy z jawnym rzutowaniem typu
      createdIntentions.push(newIntention as IntentionWithMasses);
    }
    
    // Group the created intentions by week for the response
    // This helps maintain the weekly view in the UI
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekEnd);
    
    const weeklyIntention = {
      _id: `week_${weekStartDate.toISOString().split('T')[0]}`,
      title: `${weekTitle} ${weekStartDate.toLocaleDateString('pl-PL')} - ${weekEndDate.toLocaleDateString('pl-PL')}`,
      date: weekStartDate.toISOString(),
      weekStart: weekStartDate.toISOString(),
      weekEnd: weekEndDate.toISOString(),
      days: Object.entries(groupedByDay).map(([dateStr, dayData]) => ({
        date: dateStr,
        masses: dayData.masses
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
    
    // Return the created weekly intention
    return NextResponse.json({ 
      message: "Intencje na tydzień dodane pomyślnie", 
      count: createdIntentions.length,
      weeklyIntention
    }, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas dodawania intencji mszalnych', error);
    return NextResponse.json({ error: "Błąd podczas dodawania intencji mszalnych" }, { status: 500 });
  }
}
