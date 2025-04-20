import { NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export const POST = async (req: Request) => {
  try {
    const { memberIds } = await req.json();
    
    if (!memberIds || !Array.isArray(memberIds)) {
      return NextResponse.json({ error: "Invalid member IDs" }, { status: 400 });
    }

    const members = await prisma.parishioner.findMany({
      where: {
        id: { in: memberIds }
      },
      include: {
        address: true,
        sacraments: true
      }
    });

    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: "Error fetching members" },
      { status: 500 }
    );
  }
}
