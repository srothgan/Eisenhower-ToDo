import { withAuth } from 'next-auth/middleware';

// Use NextAuth middleware to protect all routes except the ones in the matcher (like the sign-in page)
export default withAuth({
  pages: {
    signIn: '/signin', // Redirect to the sign-in page if not authenticated
  },
});

// Configure matcher to apply middleware to specific routes
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect the dashboard and any subroutes
    '/',                 // Protect the home page
    '/profile/:path*',    // Protect other routes, like the profile page
  ],
};
