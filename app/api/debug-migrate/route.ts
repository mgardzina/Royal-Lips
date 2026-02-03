import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Starting migration...");
    
    // 1. Create Table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "TreatmentHistory" (
        "id" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "date" TIMESTAMP(3) NOT NULL,
        "description" TEXT NOT NULL,
        "formId" TEXT NOT NULL,

        CONSTRAINT "TreatmentHistory_pkey" PRIMARY KEY ("id")
      );
    `);
    console.log("Table TreatmentHistory created or already exists");

    // 2. Add Foreign Key (check if exists first optionally, or just try-catch)
    try {
        await prisma.$executeRawUnsafe(`
        ALTER TABLE "TreatmentHistory" 
        ADD CONSTRAINT "TreatmentHistory_formId_fkey" 
        FOREIGN KEY ("formId") REFERENCES "ConsentForm"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `);
        console.log("Foreign key constraint added");
    } catch (e) {
        console.log("Foreign key might already exist:", e);
    }

    return NextResponse.json({ success: true, message: "Migration completed" });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      { error: String(error), details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
