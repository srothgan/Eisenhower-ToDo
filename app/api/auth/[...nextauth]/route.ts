import connectMongoDB from '../../../../libs/mongodb';
import User from '../../../../models/user';
import NextAuth, { type NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };  // Explicitly type credentials

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });

          if (!user) {
            return null; // No user found
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return null; // Password mismatch
          }

          // Return only the relevant user data, cast _id to string
          return {
            id: user._id.toString(), // Cast _id to string
            name: user.name,
            email: user.email,
            organization: user.organization,
            role: user.role,
          };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user details to the token (from authorize)
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
      // Add token information to session, so it can be used in the client
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.organization = token.organization as string;
        session.user.role = token.role as "employee" | "lecturer" | "student";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Use enum instead of string
    maxAge: 30 * 60, // 30 minutes session duration
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signin', // Custom sign-in page
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; // These remain unchanged
