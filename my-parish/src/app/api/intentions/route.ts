import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Intention from "@/models/Intention";

export async function GET() {
  await connectToDatabase();

  try {
    const intentions = await Intention.find().sort({ date: -1 });
    return NextResponse.json(intentions, { status: 200 });
  } catch (error) {
    console.error('Błąd podczas pobierania intencji mszalnych', error);
    return NextResponse.json({ error: "Błąd podczas pobierania intencji mszalnych" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const newIntention = new Intention(body);
    await newIntention.save();
    return NextResponse.json(newIntention, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas dodawania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas dodawania intencji mszalnej" }, { status: 500 });
  }
}
