import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch intentions with their complete hierarchy
    const intentions = await prisma.intention.findMany({
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
      },
      orderBy: {
        weekStart: 'desc'
      }
    });
    
    // Format intentions for the frontend
    const formattedIntentions = intentions.map(intention => {
      // Format days with masses and their intentions
      const formattedDays = intention.days.map(day => {
        // Format masses with their intentions
        const formattedMasses = day.masses.map(mass => {
          return {
            id: mass.id,
            time: mass.time,
            intentions: mass.intentions.map(massIntention => ({
              id: massIntention.id,
              intention: massIntention.intention
            }))
          };
        });
        
        return {
          id: day.id,
          date: day.date.toISOString(),
          liturgicalName: (day as any).liturgicalName ?? null,
          headerColor: (day as any).headerColor ?? null,
          masses: formattedMasses
        };
      });
      
      // Sort days by date
      formattedDays.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      return {
        _id: intention.id,
        title: intention.title,
        weekStart: intention.weekStart.toISOString(),
        weekEnd: intention.weekEnd ? intention.weekEnd.toISOString() : null,
        imageUrl: intention.imageUrl,
        days: formattedDays
      };
    });
    
    return NextResponse.json(formattedIntentions, { status: 200 });
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
    const imageUrl = image ? image.name : null;
    
    // Create the weekly intention
    const intention = await prisma.intention.create({
      data: {
        title,
        weekStart: new Date(weekStart),
        weekEnd: new Date(weekEnd),
        imageUrl
      }
    });

    // Process and create each day
    for (const dayData of daysData) {
      if (!dayData.date) continue;
      
      // Create the day
      const day = await prisma.day.create({
        data: {
          date: new Date(dayData.date),
          intentionId: intention.id,
          liturgicalName: (dayData as any).liturgicalName ?? null,
          headerColor: (dayData as any).headerColor ?? null
        }
      });
      
      // Process each mass and its intentions for this day
      for (const massData of dayData.masses || []) {
        if (!massData.time) continue;
        
        // Create the mass
        const mass = await prisma.mass.create({
          data: {
            time: massData.time,
            dayId: day.id
          }
        });
        
        // Process each intention for this mass
        for (const intentionItem of massData.intentions || []) {
          if (!intentionItem.intention || !intentionItem.intention.trim()) continue;
          
          // Create the mass intention
          await prisma.massIntention.create({
            data: {
              intention: intentionItem.intention,
              massId: mass.id
            }
          });
        }
      }
    }
    
    // Fetch the created intention with its complete hierarchy for the response
    const createdIntention = await prisma.intention.findUnique({
      where: {
        id: intention.id
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
    });
    
    // Format the response
    if (!createdIntention) {
      return NextResponse.json({ error: "Failed to create intention" }, { status: 500 });
    }
    
    const formattedDays = createdIntention.days.map(day => {
      const formattedMasses = day.masses.map(mass => {
        return {
          id: mass.id,
          time: mass.time,
          intentions: mass.intentions.map(massIntention => ({
            id: massIntention.id,
            intention: massIntention.intention
          }))
        };
      });
      
      return {
        id: day.id,
        date: day.date.toISOString(),
        liturgicalName: (day as any).liturgicalName ?? null,
        headerColor: (day as any).headerColor ?? null,
        masses: formattedMasses
      };
    });
    
    // Sort days by date
    formattedDays.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const responseData = {
      _id: intention.id,
      title: intention.title,
      weekStart: intention.weekStart.toISOString(),
      weekEnd: intention.weekEnd ? intention.weekEnd.toISOString() : null,
      imageUrl: intention.imageUrl,
      days: formattedDays
    };
    
    return NextResponse.json({
      message: "Intencje na tydzień dodane pomyślnie",
      intention: responseData
    }, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas dodawania intencji mszalnych', error);
    return NextResponse.json({ error: "Błąd podczas dodawania intencji mszalnych" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "Nie podano identyfikatora intencji" }, { status: 400 });
    }
    
    // Check if the intention exists
    const existingIntention = await prisma.intention.findUnique({
      where: { id }
    });
    
    if (!existingIntention) {
      return NextResponse.json({ error: "Intencja nie istnieje" }, { status: 404 });
    }
    
    // Delete the intention (cascade deletion will handle days, masses, and massIntentions)
    await prisma.intention.delete({
      where: { id }
    });
    
    return NextResponse.json({ message: "Intencja usunięta pomyślnie" }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania intencji', error);
    return NextResponse.json({ error: "Błąd podczas usuwania intencji" }, { status: 500 });
  }
}
