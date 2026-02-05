
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const email = "admin@royal-lips.pl";
    const password = "admin1220@#"; 
    const name = "Administrator";
    
    const hashedPassword = await hash(password, 12);
    
    const user = await prisma.adminUser.upsert({
      where: { email },
      update: {
        passwordHash: hashedPassword,
        name
      },
      create: {
        email,
        passwordHash: hashedPassword,
        name
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: `Admin account setup successfully for ${email}. You can now log in.`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
