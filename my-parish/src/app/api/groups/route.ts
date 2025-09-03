import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async (request: Request) => {
  try {
    // Read optional memberId from query string
    const url = new URL(request.url);
    const memberId = url.searchParams.get("memberId");

    const groups = await prisma.group.findMany({
      where: memberId
        ? {
            OR: [
              // Is a member of the group
              {
                members: {
                  some: {
                    parishionerId: memberId,
                  },
                },
              },
              // Is the leader of the group
              {
                leaderId: memberId,
              },
            ],
          }
        : undefined,
      include: {
        leader: true,
        members: {
          include: {
            parishioner: true
          }
        }
      }
    });

    // Transform the data for frontend compatibility
    const transformedGroups = groups.map(group => ({
      ...group,
      _id: group.id, // Add _id for frontend compatibility
      // Transform leader data
      leaderId: {
        _id: group.leader.id,
        id: group.leader.id,
        firstName: group.leader.firstName,
        lastName: group.leader.lastName
      },
      // Transform members data
      members: group.members.map(member => ({
        _id: member.parishioner.id,
        id: member.parishioner.id,
        firstName: member.parishioner.firstName,
        lastName: member.parishioner.lastName
      }))
    }));

    console.log('Transformed groups for frontend:', transformedGroups);
    return NextResponse.json(transformedGroups, { status: 200 });
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
    
    console.log("Received group data:", body);
    
    // Handle the case where leaderId might be in MongoDB format (_id)
    const leaderIdToUse = body.leaderId;
    
    // Create group with Prisma
    const newGroup = await prisma.group.create({
      data: {
        name: body.name,
        description: body.description,
        meetingSchedule: body.meetingSchedule,
        leader: {
          connect: { id: leaderIdToUse }
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
