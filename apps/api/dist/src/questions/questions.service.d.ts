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
                id: string;
                name: string;
                slug: string;
            };
            technology: {
                id: string;
                name: string;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            title: string;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
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
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
            };
            technology: {
                id: string;
                name: string;
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
                questionId: string;
                codeSnippet: string | null;
                explanation: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            title: string;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        };
    }>;
    create(createQuestionDto: CreateQuestionDto): Promise<{
        success: boolean;
        data: {
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
            };
            technology: {
                id: string;
                name: string;
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
                questionId: string;
                codeSnippet: string | null;
                explanation: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            title: string;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        };
    }>;
    update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<{
        success: boolean;
        data: {
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
            };
            technology: {
                id: string;
                name: string;
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
                questionId: string;
                codeSnippet: string | null;
                explanation: string | null;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            title: string;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
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
