import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    maxAge: 3 * 60 * 60, // 3 hours
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Hasło", type: "password" },
        code: { label: "Kod SMS", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.code) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const code = credentials.code as string;

        // 1. Check if it's an allowed admin email in DB
        const admin = await prisma.adminUser.findUnique({
          where: { email },
        });

        if (!admin) {
          return null;
        }

        // 2. Verify password
        const isPasswordValid = await compare(password, admin.passwordHash);
        if (!isPasswordValid) {
          return null;
        }

        // 3. Verify OTP from DB
        const verification = await prisma.otpVerification.findFirst({
          where: {
            phoneNumber: admin.phoneNumber,
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

