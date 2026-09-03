import { Injectable, NotFoundException } from '@nestjs/common';
import { ProgressStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProgress(userId: string, questionId: string, status: ProgressStatus) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID "${questionId}" not found.`);
    }

    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
      update: {
        status,
      },
      create: {
        userId,
        questionId,
        status,
      },
    });

    return {
      success: true,
      message: `Question progress set to ${status}`,
      data: progress,
    };
  }

  async getUserProgress(userId: string) {
    const [totalQuestions, completedQuestions, inProgressQuestions, recentlyCompleted] =
      await Promise.all([
        this.prisma.question.count(),
        this.prisma.userProgress.count({
          where: { userId, status: ProgressStatus.COMPLETED },
        }),
        this.prisma.userProgress.count({
          where: { userId, status: ProgressStatus.IN_PROGRESS },
        }),
        this.prisma.userProgress.findMany({
          where: { userId, status: ProgressStatus.COMPLETED },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          include: {
            question: {
              include: {
                category: true,
                technology: true,
              },
            },
          },
        }),
      ]);

    const completionPercentage =
      totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

    return {
      success: true,
      data: {
        stats: {
          totalQuestions,
          completedQuestions,
          inProgressQuestions,
          completionPercentage,
        },
        recentlyCompleted: recentlyCompleted.map((p) => ({
          ...p.question,
          completedAt: p.updatedAt,
        })),
      },
    };
  }

  async getUserProgressMap(userId: string): Promise<Record<string, ProgressStatus>> {
    const progressList = await this.prisma.userProgress.findMany({
      where: { userId },
      select: { questionId: true, status: true },
    });

    const map: Record<string, ProgressStatus> = {};
    for (const p of progressList) {
      map[p.questionId] = p.status;
    }
    return map;
  }
}
