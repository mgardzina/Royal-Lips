import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";

// POST - zapisz nowy formularz (publiczny)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Znajdź lub utwórz klientkę po imieniu i nazwisku
    const client = await prisma.client.upsert({
      where: { imieNazwisko: body.imieNazwisko },
      update: {
        telefon: body.telefon, // Aktualizuj telefon przy każdej wizycie
      },
      create: {
        imieNazwisko: body.imieNazwisko,
        telefon: body.telefon,
      },
    });

    const consentForm = await prisma.consentForm.create({
      data: {
        imieNazwisko: body.imieNazwisko,
        adres: body.adres || null,
        dataUrodzenia: body.dataUrodzenia || null,
        telefon: body.telefon,
        miejscowoscData: body.miejscowoscData,
        nazwaProduktu: body.nazwaProduktu || null,
        obszarZabiegu: body.obszarZabiegu || null,
        celEfektu: body.celEfektu || null,
        przeciwwskazania: body.przeciwwskazania,
        zgodaPrzetwarzanieDanych: body.zgodaPrzetwarzanieDanych,
        zgodaMarketing: body.zgodaMarketing,
        zgodaFotografie: body.zgodaFotografie,
        miejscaPublikacjiFotografii: body.miejscaPublikacjiFotografii || null,
        podpisDane: body.podpisDane || null,
        podpisMarketing: body.podpisMarketing || null,
        podpisFotografie: body.podpisFotografie || null,
        podpisRodo: body.podpisRodo || null,
        clientId: client.id, // Powiązanie z klientką
      },
    });

    return NextResponse.json({
      success: true,
      id: consentForm.id,
    });
  } catch (error) {
    console.error("Błąd zapisu formularza:", error);
    return NextResponse.json(
      { success: false, error: "Błąd zapisu formularza" },
      { status: 500 }
    );
  }
}

// GET - pobierz listę formularzy (tylko dla zalogowanych)
export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const forms = await prisma.consentForm.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        createdAt: true,
        imieNazwisko: true,
        telefon: true,
        miejscowoscData: true,
        zgodaPrzetwarzanieDanych: true,
        zgodaMarketing: true,
        zgodaFotografie: true,
      },
    });

    return NextResponse.json({ success: true, forms });
  } catch (error) {
    console.error("Błąd pobierania formularzy:", error);
    return NextResponse.json(
      { success: false, error: "Błąd pobierania formularzy" },
      { status: 500 }
    );
  }
}
