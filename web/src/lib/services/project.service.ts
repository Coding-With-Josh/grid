import { prisma } from '../db';
import { Project, Category, Status } from '@prisma/client';

export interface CreateProjectData {
  title: string;
  description: string;
  creatorId: string;
  category?: Category;
  tags?: string[];
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  category?: Category;
  status?: Status;
  tags?: string[];
}

export class ProjectService {
  static async createProject(data: CreateProjectData): Promise<Project> {
    return prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        creatorId: data.creatorId,
        category: data.category || Category.OTHER,
        tags: data.tags || [],
      },
    });
  }

  static async updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  static async getProjectById(projectId: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: true,
      },
    });
  }

  static async getProjectsByCreator(creatorId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: { creatorId },
      include: {
        creator: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getProjects(params: {
    category?: Category;
    status?: Status;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ projects: Project[]; total: number }> {
    const where = {
      ...(params.category && { category: params.category }),
      ...(params.status && { status: params.status }),
      ...(params.tags?.length && {
        tags: {
          hasSome: params.tags,
        },
      }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          creator: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: params.limit || 10,
        skip: params.offset || 0,
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  }
}
