import { PrismaService } from '../prisma/prisma.service';
import { QueryQuestionsDto } from './dto/query-questions.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private slugify;
    findAll(query: QueryQuestionsDto): Promise<{
        success: boolean;
        data: ({
            category: {
                name: string;
                id: string;
                slug: string;
            };
            technology: {
                name: string;
                id: string;
                slug: string;
                icon: string | null;
            };
            answer: {
                id: string;
                content: string;
                codeSnippet: string | null;
                explanation: string | null;
            } | null;
        } & {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            slug: string;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slugOrId: string): Promise<{
        success: boolean;
        data: {
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
            technology: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                icon: string | null;
            };
            answer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                codeSnippet: string | null;
                explanation: string | null;
                questionId: string;
            } | null;
        } & {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            slug: string;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        };
    }>;
    create(createQuestionDto: CreateQuestionDto): Promise<{
        success: boolean;
        data: {
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
            technology: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                icon: string | null;
            };
            answer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                codeSnippet: string | null;
                explanation: string | null;
                questionId: string;
            } | null;
        } & {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            slug: string;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        };
    }>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
        success: boolean;
        data: {
            category: {
                description: string | null;
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
            };
            technology: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                icon: string | null;
            };
            answer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                content: string;
                codeSnippet: string | null;
                explanation: string | null;
                questionId: string;
            } | null;
        } & {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            slug: string;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
