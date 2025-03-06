import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Parishioner from "@/models/Parishioner";

// Pobranie parafianina po ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  await connectToDatabase();
  try {
    const parishioner = await Parishioner.findById(id);
    if (!parishioner) {
      return NextResponse.json({ message: "Parishioner not found" }, { status: 404 });
    }
    return NextResponse.json(parishioner, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching parishioner", error }, { status: 500 });
  }
}

// Aktualizacja danych parafianina
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  await connectToDatabase();
  try {
    const body = await request.json();
    const updatedParishioner = await Parishioner.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedParishioner) {
      return NextResponse.json({ message: "Parishioner not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Parishioner updated successfully", parishioner: updatedParishioner }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating parishioner", error }, { status: 400 });
  }
}

// Usunięcie parafianina
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ message: "Missing ID" }, { status: 400 });
  }

  await connectToDatabase();
  try {
    const deletedParishioner = await Parishioner.findByIdAndDelete(id);
    if (!deletedParishioner) {
      return NextResponse.json({ message: "Parishioner not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Parishioner deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting parishioner", error }, { status: 500 });
  }
}
