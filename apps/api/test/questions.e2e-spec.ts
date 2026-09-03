import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('QuestionsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let userToken: string;

  const adminUserId = 'e2e-admin-user-id';
  const regularUserId = 'e2e-regular-user-id';

  let testCategoryId: string;
  let testTechnologyId: string;
  let createdQuestionId: string;
  let createdQuestionSlug: string;

  beforeAll(async () => {
    jest.setTimeout(30000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Upsert real test users into DB for JwtStrategy validation
    await prisma.user.upsert({
      where: { id: adminUserId },
      update: {},
      create: {
        id: adminUserId,
        email: 'e2e-admin@vinterview.dev',
        password: 'hashedpassword123',
        name: 'E2E Admin',
        role: 'ADMIN',
      },
    });

    await prisma.user.upsert({
      where: { id: regularUserId },
      update: {},
      create: {
        id: regularUserId,
        email: 'e2e-user@vinterview.dev',
        password: 'hashedpassword123',
        name: 'E2E Regular User',
        role: 'USER',
      },
    });

    // Get or seed test category & technology
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: { name: 'E2E Category', slug: 'e2e-category' },
      });
    }
    testCategoryId = category.id;

    let technology = await prisma.technology.findFirst();
    if (!technology) {
      technology = await prisma.technology.create({
        data: { name: 'E2E Tech', slug: 'e2e-tech' },
      });
    }
    testTechnologyId = technology.id;

    // Create valid JWT tokens pointing to created DB users
    adminToken = jwtService.sign({ sub: adminUserId, email: 'e2e-admin@vinterview.dev', role: 'ADMIN' });
    userToken = jwtService.sign({ sub: regularUserId, email: 'e2e-user@vinterview.dev', role: 'USER' });
  }, 30000);

  afterAll(async () => {
    // Cleanup created test question if any remains
    if (createdQuestionId) {
      await prisma.question.deleteMany({ where: { id: createdQuestionId } });
    }
    await app.close();
  });

  describe('GET /api/questions', () => {
    it('should return 200 OK and paginated questions array', () => {
      return request(app.getHttpServer())
        .get('/api/questions?page=1&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.meta).toBeDefined();
          expect(res.body.meta.page).toBe(1);
          expect(res.body.meta.limit).toBe(5);
        });
    });

    it('should support search and difficulty filters', () => {
      return request(app.getHttpServer())
        .get('/api/questions?search=event&difficulty=MEDIUM')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });
  });

  describe('POST /api/questions (Auth & Validation)', () => {
    it('should return 401 Unauthorized if no Bearer token is provided', () => {
      return request(app.getHttpServer())
        .post('/api/questions')
        .send({
          title: 'Unauthenticated Question Title',
          content: 'Test content statement...',
          difficulty: 'EASY',
          categoryId: testCategoryId,
          technologyId: testTechnologyId,
        })
        .expect(401);
    });

    it('should return 403 Forbidden if regular USER role token is provided', () => {
      return request(app.getHttpServer())
        .post('/api/questions')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          title: 'Forbidden User Question Title',
          content: 'Test content statement...',
          difficulty: 'EASY',
          categoryId: testCategoryId,
          technologyId: testTechnologyId,
        })
        .expect(403);
    });

    it('should return 400 Bad Request if ADMIN passes invalid DTO body', () => {
      return request(app.getHttpServer())
        .post('/api/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: '', // Empty title fails @IsNotEmpty
          difficulty: 'SUPER_HARD', // Invalid enum fails @IsEnum
        })
        .expect(400);
    });

    it('should return 201 Created and create question when ADMIN provides valid DTO', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/questions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'Unique E2E Test Question Title Statement',
          content: 'Detailed E2E test question problem statement...',
          difficulty: 'MEDIUM',
          categoryId: testCategoryId,
          technologyId: testTechnologyId,
          answer: {
            content: 'Detailed solution content for E2E testing...',
            codeSnippet: 'console.log("E2E Test Passed");',
          },
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.slug).toBe('unique-e2e-test-question-title-statement');

      createdQuestionId = response.body.data.id;
      createdQuestionSlug = response.body.data.slug;
    });
  });

  describe('GET /api/questions/:slug', () => {
    it('should return 200 OK and question details for valid slug', () => {
      return request(app.getHttpServer())
        .get(`/api/questions/${createdQuestionSlug}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBe(createdQuestionId);
          expect(res.body.data.category.id).toBe(testCategoryId);
          expect(res.body.data.answer.content).toBeDefined();
        });
    });

    it('should return 404 Not Found for non-existent slug', () => {
      return request(app.getHttpServer())
        .get('/api/questions/completely-non-existent-e2e-slug')
        .expect(404);
    });
  });

  describe('PATCH /api/questions/:id', () => {
    it('should return 200 OK and update question when ADMIN modifies attributes', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/questions/${createdQuestionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          difficulty: 'HARD',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.difficulty).toBe('HARD');
    });
  });

  describe('DELETE /api/questions/:id', () => {
    it('should return 200 OK and delete question when ADMIN requests deletion', async () => {
      await request(app.getHttpServer())
        .delete(`/api/questions/${createdQuestionId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify it is gone
      await request(app.getHttpServer())
        .get(`/api/questions/${createdQuestionId}`)
        .expect(404);

      createdQuestionId = '';
    });
  });
});
