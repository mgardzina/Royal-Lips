
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Delete all existing admin users
    const deleted = await prisma.adminUser.deleteMany({});
    console.log(`Deleted ${deleted.count} admin users`);

    // 2. Create the specific admin user
    const email = "admin@royal-lips.pl";
    const password = "admin1220@#";
    const hashedPassword = await hash(password, 12);

    const newUser = await prisma.adminUser.create({
      data: {
        email,
        passwordHash: hashedPassword,
        name: "Admin"
      }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${deleted.count} users. Recreated admin.`,
      user: { id: newUser.id, email: newUser.email }
    });
  } catch (error) {
    console.error("Nuke error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
