import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../models/user";
import connectMongoDB from "../libs/mongodb";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };

        await connectMongoDB();
        const user = await User.findOne({ email });

        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          organization: user.organization,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.organization = user.organization;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.organization = token.organization as string;
      session.user.role = token.role as "employee" | "lecturer" | "student";
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};
