import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    maxAge: 6 * 60 * 60, // 6 hours
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Hasło", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

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

