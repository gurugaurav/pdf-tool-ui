import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from '../../../components/lib/db'; // Adjust the path as necessary
import bcrypt from 'bcryptjs';

// Adjust this type definition as needed
interface UserType {
  id: string;
  name: string;
  email: string;
}

const nextAuthUrl = process.env.NEXTAUTH_URL;
console.log('NEXTAUTH_URL:', nextAuthUrl);

const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Autho.....')
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Find user by email
        const user = await User.findOne({ where: { email: credentials.email } });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Verify password
        const isMatch = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isMatch) {
          throw new Error('Invalid password');
        }

        // Return user object with string ID
        return { id: user.id.toString(), name: user.username, email: user.email } as UserType;
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
    error: '/login', // Redirect to the login page on error
  },
  session: {
    strategy: 'jwt', // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string, // Ensure this matches the type used in the `authorize` method
          email: token.email as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
};

// Uncomment this line to export NextAuth instance:
const handler =  NextAuth(authOptions);

export { handler as GET, handler as POST }

// Alternatively, export individual functions if needed:
// export const { auth, signIn, signOut } = NextAuth(authOptions);
