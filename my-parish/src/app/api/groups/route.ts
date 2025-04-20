import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        leader: true,
        members: {
          include: {
            parishioner: true
          }
        }
      }
    });
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: "Error fetching groups" }, { status: 500 });
  }
}

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.name || !body.leaderId) {
      return NextResponse.json(
        { error: "Name and leader are required fields" },
        { status: 400 }
      );
    }
    
    // Create group with Prisma
    const newGroup = await prisma.group.create({
      data: {
        name: body.name,
        description: body.description,
        meetingSchedule: body.meetingSchedule,
        leader: {
          connect: { id: body.leaderId }
        }
      },
      include: {
        leader: true
      }
    });
    
    // If members are provided, create group members
    if (body.members && Array.isArray(body.members) && body.members.length > 0) {
      await Promise.all(body.members.map((memberId: string) => {
        return prisma.groupMember.create({
          data: {
            groupId: newGroup.id,
            parishionerId: memberId
          }
        });
      }));
      
      // Fetch the updated group with members
      const groupWithMembers = await prisma.group.findUnique({
        where: { id: newGroup.id },
        include: {
          leader: true,
          members: {
            include: {
              parishioner: true
            }
          }
        }
      });
      
      return NextResponse.json(
        { message: "Group created successfully", group: groupWithMembers },
        { status: 201 }
      );
    }
    
    return NextResponse.json(
      { message: "Group created successfully", group: newGroup },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: "Error creating group: " + error }, { status: 500 });
  }
}
