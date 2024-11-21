import { prisma } from '../db';
import { User, UserRole } from '@prisma/client';

export interface CreateUserData {
  clerkId: string;
  email: string;
  name?: string;
  role?: UserRole;
  walletAddress?: string;
}

export interface UpdateUserData {
  name?: string;
  role?: UserRole;
  bio?: string;
  skills?: string[];
  walletAddress?: string;
}

export class UserService {
  static async createUser(data: CreateUserData): Promise<User> {
    return prisma.user.create({
      data: {
        id: data.clerkId,
        email: data.email,
        name: data.name,
        role: data.role || UserRole.CREATOR,
        walletAddress: data.walletAddress,
      },
    });
  }

  static async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  static async getUserById(userId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async getUserByWallet(walletAddress: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { walletAddress },
    });
  }
}
