import { NextResponse } from "next/server";
import { generateConsentFormPdf } from "@/lib/pdfGenerator";

// GET: Generate a test PDF (dev only)
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const testForm = {
      id: "test-1234-5678",
      type: "LIP_AUGMENTATION" as const,
      createdAt: new Date(),
      imieNazwisko: "Anna Kowalska",
      email: "anna@example.com",
      ulica: "ul. Testowa 15",
      kodPocztowy: "38-400",
      miasto: "Krosno",
      dataUrodzenia: "15.03.1990",
      telefon: "500 100 200",
      miejscowoscData: `Krosno, ${new Date().toLocaleDateString("pl-PL")}`,
      osobaPrzeprowadzajacaZabieg: "Joanna Wielgos",
      nazwaProduktu: "Juvederm Volift",
      obszarZabiegu: "lips,nasolabial_folds",
      celEfektu: "Powiększenie i modelowanie ust",
      numerZabiegu: "Zabieg pierwszy",
      przeciwwskazania: {
        ciazaLaktacja: false,
        zapalenieZakazenieSkory: false,
        chemioterapiaRadioterapia: false,
        nowotwor: false,
        hivZoltaczka: false,
        luszczycaAktywna: false,
        epilepsja: false,
        problemyGojenieRan: false,
        alergiaSkładnikiPreparatu: false,
        alergiaZnieczulenie: false,
        chorobyImmunologiczne: false,
        bielactwo: false,
        porfiriaSkorna: false,
        podatnoscBlizny: false,
        alkoholNarkotyki: false,
        leczenieIzotretinina: false,
        lekiPrzeciwbolowe: true,
        utrataSwiadomosci: false,
        uczulenieSrodkiZnieczulajace: false,
        problemyKrazeniem: false,
        chorobyAutoimmunologiczne: false,
        antykoagulantyLekiRozrzedzajace: false,
        szczepienieWzw: true,
        lekIglyKrew: false,
        leczenieStomatologiczne: false,
        wypelniaczeSkorneKwasHialuronowy: "Juvederm Ultra 3, 6 miesięcy temu",
        zastrzykiBotoks: false,
        zabiegiChirurgiczneTwarz: false,
        antybiotykoterapia: false,
        lekiRozrzedzajaceKrew: false,
        lekiMiejscowe: false,
        temperaturaPrzeziebienie: false,
        sklonnosciSinceKrwawienie: false,
        tatuaze: false,
        makijazPermanentny: "Brwi, ombre, 2 lata temu",
        inneSchorzenia: false,
      },
      zgodaPrzetwarzanieDanych: true,
      zgodaMarketing: true,
      zgodaFotografie: true,
      zgodaPomocPrawna: false,
      miejscaPublikacjiFotografii: "Instagram, strona www salonu",
      podpisDane: "",
      podpisMarketing: "",
      podpisFotografie: "",
      podpisRodo: null,
      podpisRodo2: null,
      informacjaDodatkowa: "Klientka regularnie stosuje krem z retinolem — poinformowana o konieczności wstrzymania na 7 dni.",
      zastrzeniaKlienta: "",
      signatureStatus: "PENDING",
      signatureVerifiedAt: null,
      planowanaIloscZabiegow: undefined,
      odstepMiedzyZabiegami: undefined,
      kolejneZabiegiOdstepy: undefined,
      iloscProduktu: "1 ml",
    };

    const pdfBuffer = await generateConsentFormPdf(testForm);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="debug-consent-form.pdf"',
      },
    });
  } catch (error) {
    console.error("[Debug PDF] Error:", error);
    return NextResponse.json(
      { error: "Błąd generowania PDF", details: String(error) },
      { status: 500 }
    );
  }
}
