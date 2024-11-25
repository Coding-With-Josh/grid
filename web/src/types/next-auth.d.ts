import 'next-auth';
import { User } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      email: string;
      name: string | null;
      hasCompletedOnboarding: boolean;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name: string | null;
    hasCompletedOnboarding: boolean;
  }
}
