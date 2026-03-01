import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateConsentFormPdf } from "@/lib/pdfGenerator";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const form = await prisma.consentForm.findUnique({
      where: { id },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Formularz nie znaleziony" },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateConsentFormPdf({
      ...form,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: form.type as any,
      przeciwwskazania: form.przeciwwskazania as Record<string, boolean | string | null>,
      createdAt: form.createdAt,
      signatureStatus: form.signatureStatus || undefined,
      signatureVerifiedAt: form.signatureVerifiedAt,
      ulica: form.ulica || "",
      kodPocztowy: form.kodPocztowy || "",
      miasto: form.miasto || "",
      dataUrodzenia: form.dataUrodzenia || "",
      nazwaProduktu: form.nazwaProduktu || "",
      obszarZabiegu: form.obszarZabiegu || "",
      celEfektu: form.celEfektu || "",
      zgodaPrzetwarzanieDanych: form.zgodaPrzetwarzanieDanych,
      zgodaMarketing: form.zgodaMarketing,
      zgodaFotografie: form.zgodaFotografie,
      zgodaPomocPrawna: form.zgodaPomocPrawna,
      miejscaPublikacjiFotografii: form.miejscaPublikacjiFotografii || "",
      podpisDane: form.podpisDane || "",
      podpisMarketing: form.podpisMarketing || "",
      podpisFotografie: form.podpisFotografie || "",
      podpisRodo: form.podpisRodo || null,
      podpisRodo2: form.podpisRodo2 || null,
    });

    const date = new Date(form.createdAt).toLocaleDateString("pl-PL").replace(/\./g, "-");
    const filename = `Karta_zgody_${form.imieNazwisko.replace(/\s+/g, "_")}_${date}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      },
    });
  } catch (error) {
    console.error("[PDF Download] Error:", error);
    return NextResponse.json(
      { error: "Błąd generowania PDF", details: String(error) },
      { status: 500 }
    );
  }
}
