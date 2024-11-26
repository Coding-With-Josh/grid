import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    
    // If user is not authenticated, they'll be redirected to signin page by withAuth
    if (!token) {
      return null;
    }

    // Check if user needs to complete onboarding
    if (!token.hasCompletedOnboarding && req.nextUrl.pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }

    return NextResponse.next(); 
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*",
    "/api/user/:path*",
    "/onboarding",
  ],
};