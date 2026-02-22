import { NextResponse } from "next/server";
import { normalizePhoneNumber, generateOTPCode, sendSMS, createOTPMessage } from "@/lib/smsapi";
import { prisma } from "@/lib/prisma";
import { SALON_CONFIG } from "@/app/config/salon";
import { compare } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email i hasło są wymagane" },
        { status: 400 }
      );
    }

    // Check if user exists in AdminUser table
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Nieprawidłowy email lub hasło" },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Nieprawidłowy email lub hasło" },
        { status: 403 }
      );
    }

    const normalizedPhone = admin.phoneNumber;

    // Generate OTP
    const code = generateOTPCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save to DB
    await prisma.otpVerification.create({
      data: {
        phoneNumber: normalizedPhone,
        code,
        expiresAt,
      },
    });

    // Send SMS
    const message = createOTPMessage(code);
    const result = await sendSMS(normalizedPhone, message);

    if (!result.success) {
      return NextResponse.json(
        { error: "Błąd wysyłania SMS: " + result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd serwera" },
      { status: 500 }
    );
  }
}
