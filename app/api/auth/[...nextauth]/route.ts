
import NextAuth from "next-auth";
import { authOptions } from "../../../../libs/auth"; // Import your authOptions configuration

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
