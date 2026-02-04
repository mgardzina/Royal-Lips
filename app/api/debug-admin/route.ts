
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const count = await prisma.adminUser.count();
    let message = `Found ${count} admin users.`;
    let users: string[] = [];

    if (count === 0) {
      console.log('No admin user found. Creating default admin...');
      const hashedPassword = await hash('royal123', 12); // Default password
      const newUser = await prisma.adminUser.create({
        data: {
          email: 'admin@royal-lips.pl',
          passwordHash: hashedPassword,
          name: 'Admin',
        },
      });
      message += ` Created admin: admin@royal-lips.pl / royal123 (ID: ${newUser.id})`;
    } else {
      const existingUsers = await prisma.adminUser.findMany();
      users = existingUsers.map(u => u.email);
      
      // Force reset password for the first user to ensure access
      const firstUser = existingUsers[0];
      const hashedPassword = await hash('RoyalLips2026!', 12);
      await prisma.adminUser.update({
        where: { id: firstUser.id },
        data: { passwordHash: hashedPassword }
      });
      message += ` Reset password for ${firstUser.email} to 'RoyalLips2026!'`; // Stronger password
    }

    return NextResponse.json({ success: true, message, users });
  } catch (error) {
    console.error('Debug Admin Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
