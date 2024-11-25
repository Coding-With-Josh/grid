import { UserRole } from "@/app/api/auth/[...nextauth]/route";
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: UserRole;
      hasCompletedOnboarding?: boolean;
      bio?: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: UserRole;
    hasCompletedOnboarding?: boolean;
    bio?: string;
  }
}
