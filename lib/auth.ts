import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { normalizePhoneNumber } from "./smsapi";
import { SALON_CONFIG } from "@/app/config/salon";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    maxAge: 3 * 60 * 60, // 3 hours
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        phone: { label: "Telefon", type: "text" },
        code: { label: "Kod SMS", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          return null;
        }

        const phone = credentials.phone as string;
        const code = credentials.code as string;
        const normalizedPhone = normalizePhoneNumber(phone);

        if (!normalizedPhone) {
            return null;
        }

        // 1. Check if it's an allowed admin phone in DB
        const admin = await prisma.adminUser.findFirst({
          where: { phoneNumber: normalizedPhone },
        });

        if (!admin) {
          return null;
        }

        // 2. Verify OTP from DB
        const verification = await prisma.otpVerification.findFirst({
          where: {
            phoneNumber: normalizedPhone,
            code: code,
            verified: false,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!verification) {
          return null;
        }

        // 3. Mark as verified
        await prisma.otpVerification.update({
          where: { id: verification.id },
          data: { verified: true },
        });

        // 4. Return admin session
        return {
          id: admin.id,
          email: admin.email, // Keep email for compatibility
          name: admin.name,
          image: admin.phoneNumber, // storing phone in image field or custom field if possible, strictly following User type
        };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});

