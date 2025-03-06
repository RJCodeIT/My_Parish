import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Intention from "@/models/Intention";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const intention = await Intention.findById(params.id);
    if (!intention) {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    return NextResponse.json(intention, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnej" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const updatedIntention = await Intention.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedIntention) {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }

    return NextResponse.json(updatedIntention, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas edycji intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas edycji intencji mszalnej" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  try {
    const deletedIntention = await Intention.findByIdAndDelete(params.id);
    if (!deletedIntention) {
      return NextResponse.json({ error: "Intencja mszalna nie została znaleziona" }, { status: 404 });
    }
    return NextResponse.json({ message: "Intencja mszalna została usunięta" }, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas usuwania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas usuwania intencji mszalnej" }, { status: 500 });
  }
}
