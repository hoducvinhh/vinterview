import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';
import { Difficulty } from '@prisma/client';

describe('QuestionsService (Unit Tests)', () => {
  let service: QuestionsService;
  let prisma: any;

  const mockCategory = {
    id: 'cat-uuid-1',
    name: 'Frontend Development',
    slug: 'frontend-development',
  };

  const mockTechnology = {
    id: 'tech-uuid-1',
    name: 'JavaScript',
    slug: 'javascript',
  };

  const mockQuestion = {
    id: 'q-uuid-1',
    title: 'What is the Event Loop in JavaScript?',
    slug: 'javascript-event-loop-asynchronous-operations',
    content: 'Explain the Event Loop mechanics...',
    difficulty: Difficulty.MEDIUM,
    categoryId: 'cat-uuid-1',
    technologyId: 'tech-uuid-1',
    category: mockCategory,
    technology: mockTechnology,
    answer: {
      id: 'ans-uuid-1',
      content: 'JavaScript uses an event loop...',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    question: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
    },
    technology: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated questions with default parameters', async () => {
      mockPrismaService.question.findMany.mockResolvedValue([mockQuestion]);
      mockPrismaService.question.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.meta).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
          orderBy: { createdAt: 'desc' },
        }),
      );
    });

    it('should apply search, category, technology, and difficulty filters correctly', async () => {
      mockPrismaService.question.findMany.mockResolvedValue([mockQuestion]);
      mockPrismaService.question.count.mockResolvedValue(1);

      await service.findAll({
        page: 2,
        limit: 5,
        search: 'event',
        category: 'frontend-development',
        technology: 'javascript',
        difficulty: Difficulty.MEDIUM,
        sortBy: 'title',
        sortOrder: 'asc',
      });

      expect(mockPrismaService.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
          orderBy: { title: 'asc' },
          where: expect.objectContaining({
            difficulty: Difficulty.MEDIUM,
            category: { slug: 'frontend-development' },
            technology: { slug: 'javascript' },
          }),
        }),
      );
    });
  });

  describe('findBySlug', () => {
    it('should return question detail by slug', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion);

      const result = await service.findBySlug('javascript-event-loop-asynchronous-operations');

      expect(result.success).toBe(true);
      expect(result.data.title).toBe(mockQuestion.title);
      expect(mockPrismaService.question.findUnique).toHaveBeenCalledWith({
        where: { slug: 'javascript-event-loop-asynchronous-operations' },
        include: { category: true, technology: true, answer: true },
      });
    });

    it('should query by id when passed a valid UUID string', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion);

      await service.findBySlug('12345678-1234-1234-1234-123456789abc');

      expect(mockPrismaService.question.findUnique).toHaveBeenCalledWith({
        where: { id: '12345678-1234-1234-1234-123456789abc' },
        include: { category: true, technology: true, answer: true },
      });
    });

    it('should throw NotFoundException if question does not exist', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should auto-generate slug if omitted and create question', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.technology.findUnique.mockResolvedValue(mockTechnology);
      mockPrismaService.question.findUnique.mockResolvedValue(null); // No collision
      mockPrismaService.question.create.mockResolvedValue(mockQuestion);

      const createDto = {
        title: 'What is the Event Loop in JavaScript?',
        content: 'Explain the Event Loop...',
        difficulty: Difficulty.MEDIUM,
        categoryId: 'cat-uuid-1',
        technologyId: 'tech-uuid-1',
      };

      const result = await service.create(createDto);

      expect(result.success).toBe(true);
      expect(mockPrismaService.question.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'what-is-the-event-loop-in-javascript',
          }),
        }),
      );
    });

    it('should throw ConflictException if generated slug collides with existing question', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategory);
      mockPrismaService.technology.findUnique.mockResolvedValue(mockTechnology);
      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion); // Collides!

      const createDto = {
        title: 'What is the Event Loop in JavaScript?',
        slug: 'javascript-event-loop-asynchronous-operations',
        content: 'Explain the Event Loop...',
        difficulty: Difficulty.MEDIUM,
        categoryId: 'cat-uuid-1',
        technologyId: 'tech-uuid-1',
      };

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete question if it exists', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(mockQuestion);
      mockPrismaService.question.delete.mockResolvedValue(mockQuestion);

      const result = await service.remove('q-uuid-1');

      expect(result.success).toBe(true);
      expect(mockPrismaService.question.delete).toHaveBeenCalledWith({
        where: { id: 'q-uuid-1' },
      });
    });

    it('should throw NotFoundException if deleting non-existent question', async () => {
      mockPrismaService.question.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
