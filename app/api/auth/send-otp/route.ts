
import { NextResponse } from "next/server";
import { normalizePhoneNumber, generateOTPCode, sendSMS, createOTPMessage } from "@/lib/smsapi";
import { prisma } from "@/lib/prisma";
import { SALON_CONFIG } from "@/app/config/salon";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { error: "Numer telefonu jest wymagany" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(phone);

    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Nieprawidłowy format numeru telefonu" },
        { status: 400 }
      );
    }

    // Check if phone exists in AdminUser table
    const admin = await prisma.adminUser.findFirst({
      where: { phoneNumber: normalizedPhone },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Ten numer nie ma uprawnień administratora" },
        { status: 403 }
      );
    }

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
