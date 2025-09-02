import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import path from "path";
import { readFile } from "fs/promises";

// Helper: safe date formatting
function fmtDate(d?: Date | string | null): string {
  if (!d) return "—";
  try {
    const date = typeof d === "string" ? new Date(d) : d;
    if (!date || isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("pl-PL");
  } catch {
    return "—";
  }
}

// Helper: escape HTML
function esc(s: unknown): string {
  if (s == null) return "—";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type CertificateType = "baptism" | "confirmation" | "marriage";
interface CertBody {
  type: CertificateType;
  details?: Record<string, unknown>;
}

function isCertBody(raw: unknown): raw is CertBody | (CertBody & { details?: Record<string, unknown> }) {
  return (
    !!raw &&
    typeof raw === "object" &&
    "type" in raw &&
    typeof (raw as { type: unknown }).type === "string"
  );
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  let body: CertBody;
  try {
    const raw = (await req.json()) as unknown;
    if (!isCertBody(raw)) {
      return NextResponse.json({ error: "Missing certificate type" }, { status: 400 });
    }
    body = {
      type: raw.type as CertificateType,
      details: (raw as { details?: Record<string, unknown> }).details,
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const type = body.type; // "baptism" | "confirmation" | "marriage"
  const details = body.details ?? {};
  if (!type) {
    return NextResponse.json({ error: "Missing certificate type" }, { status: 400 });
  }

  try {
    const parishioner = await prisma.parishioner.findUnique({
      where: { id },
      include: {
        address: true,
        sacraments: true,
      },
    });

    if (!parishioner) {
      return NextResponse.json({ error: "Parishioner not found" }, { status: 404 });
    }

    // Extract common info
    const fullName = `${parishioner.firstName} ${parishioner.lastName}`.trim();
    const dateOfBirth = fmtDate(parishioner.dateOfBirth as unknown as Date);
    const placeOfBirth = esc(details.placeOfBirth || "—"); // not stored; optional from UI

    const baptism = parishioner.sacraments.find((s) => s.type === "baptism");
    const confirmation = parishioner.sacraments.find((s) => s.type === "confirmation");
    const marriage = parishioner.sacraments.find((s) => s.type === "marriage");

    // From details or fallback
    const baptismDate = fmtDate(baptism?.date as unknown as Date);
    const baptismParish = esc(details.baptismParish || details.baptismPlace || "—");

    const confirmationDate = fmtDate(confirmation?.date as unknown as Date);
    const confirmationParish = esc(details.confirmationParish || details.confirmationPlace || "—");

    const marriageDate = fmtDate(marriage?.date as unknown as Date);
    const marriageParish = esc(details.marriageParish || details.marriagePlace || "—");

    const father = esc(details.fatherName || "—");
    const mother = esc(details.motherName || "—");
    const godfather = esc(details.godfatherName || "—");
    const godmother = esc(details.godmotherName || "—");
    const witnesses = esc(details.witnesses || "—"); // e.g. "Jan Kowalski, Anna Nowak"

    const parishFooterName = esc((details as { footerParishName?: string }).footerParishName || "Parafia");
    const parishFooterAddress = esc((details as { footerParishAddress?: string }).footerParishAddress || "Adres parafii");
    const issuedAtInput = (details as { issuedAt?: string | number | Date }).issuedAt;
    const issuedAt = fmtDate(issuedAtInput ? new Date(issuedAtInput) : new Date());

    let title = "";

    if (type === "baptism") {
      title = "ZAŚWIADCZENIE O CHRZCIE ŚWIĘTYM";
    } else if (type === "confirmation") {
      title = "ZAŚWIADCZENIE O BIERZMOWANIU";
    } else if (type === "marriage") {
      title = "ZAŚWIADCZENIE O ZAWARCIU MAŁŻEŃSTWA";
    } else {
      return NextResponse.json({ error: "Unsupported certificate type" }, { status: 400 });
    }

    // Build safe ASCII filename + RFC 5987 filename* for PDF
    const origFilename = `zaswiadczenie-${type}-${parishioner.lastName || "parafianin"}.pdf`;
    const asciiFilename = origFilename
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // strip diacritics
      .replace(/[^\x20-\x7E]/g, "_")   // non-ASCII to _
      .replace(/\s+/g, "_");
    const filenameStar = encodeURIComponent(origFilename);

    // Use pdf-lib (embed Unicode fonts to support Polish characters)
    const { PDFDocument, rgb } = await import("pdf-lib");
    const fontkit = (await import("@pdf-lib/fontkit")).default;
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 in points
    const margin = 50;
    const { width, height } = page.getSize();
    const maxWidth = width - margin * 2;

    // Load Unicode-capable fonts (Noto Sans) from local public/fonts
    const regularPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Regular.ttf");
    const boldPath = path.join(process.cwd(), "public", "fonts", "NotoSans-Bold.ttf");
    let fontRegular, fontBold;
    try {
      const [regularBytes, boldBytes] = await Promise.all([
        readFile(regularPath),
        readFile(boldPath),
      ]);
      fontRegular = await pdfDoc.embedFont(regularBytes);
      fontBold = await pdfDoc.embedFont(boldBytes);
    } catch (e) {
      console.error("Brak plików czcionek w public/fonts/. Dodaj NotoSans-Regular.ttf i NotoSans-Bold.ttf", e);
      return NextResponse.json({
        error: "Brak czcionek do PDF. Dodaj NotoSans-Regular.ttf i NotoSans-Bold.ttf do katalogu public/fonts/.",
      }, { status: 500 });
    }

    let y = height - margin;
    const drawText = (text: string, options?: { bold?: boolean; size?: number; color?: { r: number; g: number; b: number } }) => {
      const size = options?.size ?? 12;
      const font = options?.bold ? fontBold : fontRegular;
      const color = options?.color ? rgb(options.color.r, options.color.g, options.color.b) : rgb(0, 0, 0);
      const textWidth = font.widthOfTextAtSize(text, size);
      const lines: string[] = [];
      if (textWidth <= maxWidth) {
        lines.push(text);
      } else {
        // naive wrap by words
        const words = text.split(" ");
        let line = "";
        for (const w of words) {
          const next = line ? line + " " + w : w;
          if (font.widthOfTextAtSize(next, size) <= maxWidth) {
            line = next;
          } else {
            if (line) lines.push(line);
            line = w;
          }
        }
        if (line) lines.push(line);
      }
      for (const ln of lines) {
        y -= size + 4;
        page.drawText(ln, { x: margin, y, size, font, color });
      }
    };

    // Title (center)
    const titleSize = 16;
    const titleWidth = fontBold.widthOfTextAtSize(title, titleSize);
    y -= titleSize + 4;
    page.drawText(title, { x: (width - titleWidth) / 2, y, size: titleSize, font: fontBold, color: rgb(0, 0, 0) });
    y -= 20;

    // Body
    if (type === "baptism") {
      drawText(`Zaświadcza się, że ${fullName}, urodzony/a dnia ${dateOfBirth} w ${placeOfBirth}.`);
      drawText(`Został/a ochrzczony/a dnia ${baptismDate} w parafii ${baptismParish}.`);
      drawText(`Rodzice: ${father}, ${mother}`);
      drawText(`Chrzestni: ${godfather}, ${godmother}`);
    } else if (type === "confirmation") {
      drawText(`Zaświadcza się, że ${fullName}, urodzony/a dnia ${dateOfBirth} w ${placeOfBirth}.`);
      drawText(`Przyjął/przyjęła sakrament bierzmowania dnia ${confirmationDate} w parafii ${confirmationParish}.`);
      drawText(`Parafia chrztu: ${baptismParish}`);
    } else {
      drawText(`Zaświadcza się, że dnia ${marriageDate} w parafii ${marriageParish}`);
      drawText(`zawarli sakramentalny związek małżeński:`);
      drawText(`${details.spouse1 || fullName}`);
      drawText(`${details.spouse2 || "—"}`);
      drawText(`Świadkowie: ${witnesses}`);
    }

    y -= 16;
    page.drawText(`Wystawiono dnia ${issuedAt} w parafii ${parishFooterName}, ${parishFooterAddress}.`, {
      x: margin,
      y: (y -= 14),
      size: 10,
      font: fontRegular,
      color: rgb(0.22, 0.25, 0.32),
      maxWidth,
    });

    // Signature line
    const dots = ".........................................................";
    const dotsWidth = fontRegular.widthOfTextAtSize(dots, 10);
    page.drawText(dots, { x: (width - dotsWidth) / 2, y: (y -= 40), size: 10, font: fontRegular, color: rgb(0.42, 0.45, 0.5) });
    const sign = "(podpis i pieczęć proboszcza)";
    const signWidth = fontRegular.widthOfTextAtSize(sign, 10);
    page.drawText(sign, { x: (width - signWidth) / 2, y: (y -= 14), size: 10, font: fontRegular, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${asciiFilename}"; filename*=UTF-8''${filenameStar}`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (e) {
    console.error("Error generating certificate:", e);
    return NextResponse.json({ error: "Error generating certificate" }, { status: 500 });
  }
}
