import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryQuestionsDto } from './dto/query-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async findAll(query: QueryQuestionsDto) {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      technology,
      difficulty,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Build dynamic Prisma filter
    const where: Prisma.QuestionWhereInput = {};

    if (search?.trim()) {
      const term = search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
        { content: { contains: term, mode: 'insensitive' } },
        { category: { name: { contains: term, mode: 'insensitive' } } },
        { technology: { name: { contains: term, mode: 'insensitive' } } },
        { answer: { content: { contains: term, mode: 'insensitive' } } },
        { answer: { explanation: { contains: term, mode: 'insensitive' } } },
      ];
    }

    if (category) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
      if (isUuid) {
        where.categoryId = category;
      } else {
        where.category = { slug: category };
      }
    }

    if (technology) {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(technology);
      if (isUuid) {
        where.technologyId = technology;
      } else {
        where.technology = { slug: technology };
      }
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Run query and count in parallel
    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          technology: {
            select: { id: true, name: true, slug: true, icon: true },
          },
          answer: {
            select: { id: true, content: true, codeSnippet: true, explanation: true },
          },
        },
      }),
      this.prisma.question.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: questions,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findBySlug(slugOrId: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
    
    const question = await this.prisma.question.findUnique({
      where: isUuid ? { id: slugOrId } : { slug: slugOrId },
      include: {
        category: true,
        technology: true,
        answer: true,
      },
    });

    if (!question) {
      throw new NotFoundException(`Question with identifier "${slugOrId}" not found`);
    }

    return {
      success: true,
      data: question,
    };
  }

  async create(createQuestionDto: CreateQuestionDto) {
    const { title, slug: customSlug, content, difficulty, categoryId, technologyId, answer } = createQuestionDto;

    // Verify Category exists
    const categoryExists = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!categoryExists) {
      throw new NotFoundException(`Category with ID "${categoryId}" not found`);
    }

    // Verify Technology exists
    const techExists = await this.prisma.technology.findUnique({ where: { id: technologyId } });
    if (!techExists) {
      throw new NotFoundException(`Technology with ID "${technologyId}" not found`);
    }

    // Generate or format slug
    const slug = customSlug ? this.slugify(customSlug) : this.slugify(title);

    // Check slug collision
    const slugExists = await this.prisma.question.findUnique({ where: { slug } });
    if (slugExists) {
      throw new ConflictException(`Question with slug "${slug}" already exists`);
    }

    const newQuestion = await this.prisma.question.create({
      data: {
        title,
        slug,
        content,
        difficulty,
        categoryId,
        technologyId,
        ...(answer && {
          answer: {
            create: {
              content: answer.content,
              codeSnippet: answer.codeSnippet,
              explanation: answer.explanation,
            },
          },
        }),
      },
      include: {
        category: true,
        technology: true,
        answer: true,
      },
    });

    return {
      success: true,
      data: newQuestion,
    };
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const existing = await this.prisma.question.findUnique({
      where: { id },
      include: { answer: true },
    });

    if (!existing) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }

    const { categoryId, technologyId, answer, slug: newSlug, ...dataToUpdate } = updateQuestionDto;

    if (categoryId) {
      const categoryExists = await this.prisma.category.findUnique({ where: { id: categoryId } });
      if (!categoryExists) {
        throw new NotFoundException(`Category with ID "${categoryId}" not found`);
      }
    }

    if (technologyId) {
      const techExists = await this.prisma.technology.findUnique({ where: { id: technologyId } });
      if (!techExists) {
        throw new NotFoundException(`Technology with ID "${technologyId}" not found`);
      }
    }

    let finalSlug: string | undefined = undefined;
    if (newSlug) {
      finalSlug = this.slugify(newSlug);
      if (finalSlug !== existing.slug) {
        const slugExists = await this.prisma.question.findUnique({ where: { slug: finalSlug } });
        if (slugExists) {
          throw new ConflictException(`Question with slug "${finalSlug}" already exists`);
        }
      }
    }

    const updated = await this.prisma.question.update({
      where: { id },
      data: {
        ...dataToUpdate,
        ...(finalSlug && { slug: finalSlug }),
        ...(categoryId && { categoryId }),
        ...(technologyId && { technologyId }),
        ...(answer && {
          answer: {
            upsert: {
              create: {
                content: answer.content,
                codeSnippet: answer.codeSnippet,
                explanation: answer.explanation,
              },
              update: {
                content: answer.content,
                codeSnippet: answer.codeSnippet,
                explanation: answer.explanation,
              },
            },
          },
        }),
      },
      include: {
        category: true,
        technology: true,
        answer: true,
      },
    });

    return {
      success: true,
      data: updated,
    };
  }

  async remove(id: string) {
    const existing = await this.prisma.question.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Question with ID "${id}" not found`);
    }

    await this.prisma.question.delete({ where: { id } });

    return {
      success: true,
      message: `Question with ID "${id}" deleted successfully`,
    };
  }
}
