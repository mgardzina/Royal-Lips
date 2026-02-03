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

    if (!date || !description) {
      return NextResponse.json(
        { error: "Date and description are required" },
        { status: 400 }
      );
    }

    // 1. Find the MOST RECENT form for this client to attach history to
    const latestForm = await prisma.consentForm.findFirst({
      where: { clientId: id },
      orderBy: { createdAt: "desc" }
    });

    if (!latestForm) {
      return NextResponse.json(
        { error: "Client has no forms. Cannot attach history." },
        { status: 404 }
      );
    }

    // 2. Create history entry attached to the latest form
    const newEntry = await prisma.treatmentHistory.create({
      data: {
        formId: latestForm.id,
        date: new Date(date),
        description,
      },
    });

    return NextResponse.json(newEntry);
  } catch (error) {
    console.error("Error creating client history:", error);
    return NextResponse.json(
      { error: "Failed to create client history" },
      { status: 500 }
    );
  }
}
