import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Parishioner from "@/models/Parishioner";

// Pobranie wszystkich parafian
export async function GET() {
  await connectToDatabase();
  try {
    const parishioners = await Parishioner.find();
    return NextResponse.json(parishioners, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching parishioners", error }, { status: 500 });
  }
}

// Dodanie nowego parafianina
export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const newParishioner = new Parishioner(body);
    await newParishioner.save();
    return NextResponse.json({ message: "Parishioner added successfully", parishioner: newParishioner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error adding parishioner", error }, { status: 400 });
  }
}
