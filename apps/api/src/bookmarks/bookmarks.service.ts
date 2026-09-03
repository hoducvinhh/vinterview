import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async createBookmark(userId: string, questionId: string) {
    // Check if question exists
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException(`Question with ID "${questionId}" not found.`);
    }

    try {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          userId,
          questionId,
        },
        include: {
          question: {
            include: {
              category: true,
              technology: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Question bookmarked successfully',
        data: bookmark,
      };
    } catch (error: any) {
      // Prisma unique constraint violation code
      if (error.code === 'P2002') {
        throw new ConflictException('Question is already bookmarked.');
      }
      throw error;
    }
  }

  async removeBookmark(userId: string, questionId: string) {
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    if (!existingBookmark) {
      throw new NotFoundException('Bookmark not found for this question.');
    }

    await this.prisma.bookmark.delete({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    });

    return {
      success: true,
      message: 'Bookmark removed successfully',
    };
  }

  async getUserBookmarks(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        question: {
          include: {
            category: true,
            technology: true,
            answer: true,
          },
        },
      },
    });

    return {
      success: true,
      data: bookmarks.map((b) => b.question),
    };
  }

  async getUserBookmarkIds(userId: string): Promise<string[]> {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      select: { questionId: true },
    });
    return bookmarks.map((b) => b.questionId);
  }
}
