import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import { prisma } from "@/lib/db";

export type UserRole = 'DEVELOPER' | 'DESIGNER' | 'CREATOR' | 'WRITER';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  hasCompletedOnboarding?: boolean;
  bio?: string;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: {
        params: {
          scope: 'read:user user:email repo',
        },
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          bio: profile.bio,
          role: 'DEVELOPER',
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'CREATOR',
        }
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID || "",
      clientSecret: process.env.TWITTER_CLIENT_SECRET || "",
      version: "2.0",
      profile(profile) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: profile.data.email,
          image: profile.data.profile_image_url,
          role: 'CREATOR',
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as UserRole;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding as boolean;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
      }
      
      // Fetch latest user data from database
      const dbUser = await prisma.user.findUnique({
        where: { id: token.sub as string },
        select: { hasCompletedOnboarding: true, role: true }
      });

      if (dbUser) {
        token.hasCompletedOnboarding = dbUser.hasCompletedOnboarding;
        token.role = dbUser.role;
      }
      
      if (account && account.provider === 'github') {
        token.accessToken = account.access_token;
      }
      
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
