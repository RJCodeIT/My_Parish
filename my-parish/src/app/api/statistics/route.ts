import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export const GET = async (request: Request) => {
  try {
    // Get the selected year from URL parameters (default to current year)
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    
    // Parse year parameter, default to current year if invalid
    const selectedYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();
    const currentYear = selectedYear;
    const previousYear = currentYear - 1;

    // Get total group count
    const groupCount = await prisma.group.count();

    // Get total group member count (unique parishioners in groups)
    const membersCount = await prisma.groupMember.count();

    // Get total parishioner count
    const parishionerCount = await prisma.parishioner.count();
    
    // Get previous year parishioner count (approximation based on creation date)
    const previousYearParishionerCount = await prisma.parishioner.count({
      where: {
        createdAt: {
          lt: new Date(`${currentYear}-01-01T00:00:00Z`)
        }
      }
    });

    // Calculate parishioner growth
    const parishionerGrowth = parishionerCount - previousYearParishionerCount;

    // Get baptism count for current year
    const baptismsCurrentYear = await prisma.sacrament.count({
      where: {
        type: "Chrzest",
        date: {
          gte: new Date(`${currentYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
        }
      }
    });

    // Get baptism count for previous year
    const baptismsPreviousYear = await prisma.sacrament.count({
      where: {
        type: "Chrzest",
        date: {
          gte: new Date(`${previousYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear}-01-01T00:00:00Z`)
        }
      }
    });

    // Get funeral count for current year
    const funeralsCurrentYear = await prisma.sacrament.count({
      where: {
        type: "Pogrzeb",
        date: {
          gte: new Date(`${currentYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
        }
      }
    });

    // Get funeral count for previous year
    const funeralsPreviousYear = await prisma.sacrament.count({
      where: {
        type: "Pogrzeb",
        date: {
          gte: new Date(`${previousYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear}-01-01T00:00:00Z`)
        }
      }
    });

    // Get weddings count for current year
    const weddingsCurrentYear = await prisma.sacrament.count({
      where: {
        type: "Ślub",
        date: {
          gte: new Date(`${currentYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
        }
      }
    });

    // Get weddings count for previous year
    const weddingsPreviousYear = await prisma.sacrament.count({
      where: {
        type: "Ślub",
        date: {
          gte: new Date(`${previousYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear}-01-01T00:00:00Z`)
        }
      }
    });

    // Get first communion count for current year
    const communionsCurrentYear = await prisma.sacrament.count({
      where: {
        type: "Pierwsza Komunia",
        date: {
          gte: new Date(`${currentYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`)
        }
      }
    });

    // Get first communion count for previous year
    const communionsPreviousYear = await prisma.sacrament.count({
      where: {
        type: "Pierwsza Komunia",
        date: {
          gte: new Date(`${previousYear}-01-01T00:00:00Z`),
          lt: new Date(`${currentYear}-01-01T00:00:00Z`)
        }
      }
    });

    // Compile statistics
    const statistics = {
      currentYear,
      previousYear,
      groups: {
        totalCount: groupCount,
        membersCount
      },
      parishioners: {
        totalCount: parishionerCount,
        previousYearCount: previousYearParishionerCount,
        growth: parishionerGrowth
      },
      sacraments: {
        baptisms: {
          currentYear: baptismsCurrentYear,
          previousYear: baptismsPreviousYear,
          change: baptismsCurrentYear - baptismsPreviousYear
        },
        funerals: {
          currentYear: funeralsCurrentYear,
          previousYear: funeralsPreviousYear,
          change: funeralsCurrentYear - funeralsPreviousYear
        },
        weddings: {
          currentYear: weddingsCurrentYear,
          previousYear: weddingsPreviousYear,
          change: weddingsCurrentYear - weddingsPreviousYear
        },
        communions: {
          currentYear: communionsCurrentYear,
          previousYear: communionsPreviousYear,
          change: communionsCurrentYear - communionsPreviousYear
        }
      }
    };

    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json({ error: "Error fetching statistics" }, { status: 500 });
  }
}
