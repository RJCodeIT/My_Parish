import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Mark parishioner as deceased with death and optional funeral data
export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  try {
    const body = await _request.json();

    const deceased = body.deceased || {};
    const funeral = body.funeral || {};

    if (!deceased.deceasedAt) {
      return NextResponse.json({ error: "deceased.deceasedAt is required" }, { status: 400 });
    }

    const updated = await prisma.parishioner.update({
      where: { id },
      data: {
        isDeceased: true,
        deceasedAt: deceased.deceasedAt ? new Date(deceased.deceasedAt) : undefined,
        placeOfDeath: deceased.placeOfDeath || undefined,
        deathCertificateNumber: deceased.deathCertificateNumber || undefined,
        deathCertificateIssuedBy: deceased.deathCertificateIssuedBy || undefined,
        deathReporterName: deceased.deathReporterName || undefined,
        deathReporterRelation: deceased.deathReporterRelation || undefined,
        deathReporterPhone: deceased.deathReporterPhone || undefined,
        deathNotes: deceased.deathNotes || undefined,

        funeralDate: funeral.funeralDate ? new Date(funeral.funeralDate) : undefined,
        funeralLocation: funeral.funeralLocation || undefined,
        cemeteryName: funeral.cemeteryName || undefined,
        cremation: typeof funeral.cremation === 'boolean' ? funeral.cremation : undefined,
        officiant: funeral.officiant || undefined,
        funeralNotes: funeral.funeralNotes || undefined,
      },
      include: {
        address: true,
        sacraments: true,
      }
    });

    return NextResponse.json({ message: "Parishioner marked as deceased", parishioner: updated }, { status: 200 });
  } catch (error) {
    console.error('Error marking parishioner as deceased:', error);
    return NextResponse.json({ error: "Error marking parishioner as deceased" }, { status: 500 });
  }
}
