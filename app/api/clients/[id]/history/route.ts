import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Find all forms for this Client
    const forms = await prisma.consentForm.findMany({
      where: { clientId: id },
      select: { id: true }
    });

    const formIds = forms.map(f => f.id);

    if (formIds.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Fetch history for all these forms
    const history = await prisma.treatmentHistory.findMany({
      where: { formId: { in: formIds } },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching client history:", error);
    return NextResponse.json(
      { error: "Failed to fetch client history" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const { date, description } = body;
    
    console.log("[API] Add visit request:", { clientId: id, date, description });

    if (!date || !description) {
      return NextResponse.json(
        { error: "Date and description are required" },
        { status: 400 }
      );
    }

    // Parse manual date format: DD.MM.YYYY HH:MM
    let parsedDate: Date;
    try {
      console.log("[API] Parsing date:", date);
      // Try parsing DD.MM.YYYY HH:MM format
      const match = date.match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/);
      if (match) {
        const [, day, month, year, hour, minute] = match;
        parsedDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute)
        );
        console.log("[API] Date parsed successfully:", parsedDate);
      } else {
        // Fallback to ISO format
        console.log("[API] Using ISO fallback");
        parsedDate = new Date(date);
      }
      
      if (isNaN(parsedDate.getTime())) {
        console.log("[API] Invalid date after parsing");
        return NextResponse.json(
          { error: "Invalid date format. Use DD.MM.YYYY HH:MM" },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error("[API] Date parsing error:", err);
      return NextResponse.json(
        { error: "Invalid date format. Use DD.MM.YYYY HH:MM" },
        { status: 400 }
      );
    }

    console.log("[API] Finding latest form for client:", id);
    // 1. Find the MOST RECENT form for this client to attach history to
    const latestForm = await prisma.consentForm.findFirst({
      where: { clientId: id },
      orderBy: { createdAt: "desc" }
    });

    if (!latestForm) {
      console.log("[API] No forms found for client");
      return NextResponse.json(
        { error: "Client has no forms. Cannot attach history." },
        { status: 404 }
      );
    }
    
    console.log("[API] Found form:", latestForm.id);
    console.log("[API] Creating history entry...");

    // 2. Create history entry attached to the latest form
    const newEntry = await prisma.treatmentHistory.create({
      data: {
        formId: latestForm.id,
        date: parsedDate,
        description,
      },
    });
    
    console.log("[API] History entry created successfully:", newEntry.id);

    return NextResponse.json(newEntry);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("[API] Error creating client history:", {
      error: errorMessage,
      stack: errorStack,
      clientId: id,
    });
    
    return NextResponse.json(
      { 
        error: "Failed to create client history",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
