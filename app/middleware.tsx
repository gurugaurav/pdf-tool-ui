import { withAuth } from 'next-auth/middleware';

// Protect specific routes by matching their paths
export default withAuth({
  pages: {
    signIn: '/login', // Redirect to login page if not authenticated
  },
});

// Limit the middleware to specific paths
export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*'], // Adjust these paths as needed
};