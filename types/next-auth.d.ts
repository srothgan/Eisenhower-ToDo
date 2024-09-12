import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    organization: string;
    role: 'employee' | 'lecturer' | 'student';
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      organization: string;
      role: 'employee' | 'lecturer' | 'student';
    };
  }

  interface JWT {
    id: string;
    name: string;
    email: string;
    organization: string;
    role: 'employee' | 'lecturer' | 'student';
  }
}
