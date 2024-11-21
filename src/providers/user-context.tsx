'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, UserRole } from '@prisma/client';

interface UserContextType {
  profile: User | null;
  role: UserRole | null;
  isLoading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  profile: null,
  role: null,
  isLoading: true,
  error: null,
  updateProfile: async () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: clerkLoaded } = useUser();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!clerkLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${user.id}`);
        if (!response.ok) throw new Error('Failed to load profile');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [user, clerkLoaded]);

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        role: profile?.role ?? null,
        isLoading,
        error,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserProfile = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProvider');
  }
  return context;
};
