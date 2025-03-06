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
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const date = formData.get('date') as string;
    const image = formData.get('image') as File | null;
    const masses = JSON.parse(formData.get('masses') as string);

    const intentionData = {
      title,
      date: date || new Date().toISOString(),
      masses,
      image: image ? await image.arrayBuffer() : undefined
    };

    const newIntention = new Intention(intentionData);
    await newIntention.save();
    
    return NextResponse.json(newIntention, { status: 201 });
  } catch (error) {
    console.error('Błąd podczas dodawania intencji mszalnej', error);
    return NextResponse.json({ error: "Błąd podczas dodawania intencji mszalnej" }, { status: 500 });
  }
}
