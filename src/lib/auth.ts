import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './mongodb';
import User from '@/models/User';

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          return null;
        }

        // In a real app, you would verify the password hash here
        // For now, we'll just check if the password matches
        if (user.password !== credentials.password) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}; 