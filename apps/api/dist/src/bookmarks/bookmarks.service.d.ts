import { PrismaService } from '../prisma/prisma.service';
export declare class BookmarksService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createBookmark(userId: string, questionId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            question: {
                category: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                };
                technology: {
                    id: string;
                    name: string;
                    slug: string;
                    createdAt: Date;
                    updatedAt: Date;
                    icon: string | null;
                };
            } & {
                id: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                content: string;
                difficulty: import("@prisma/client").$Enums.Difficulty;
                categoryId: string;
                technologyId: string;
                authorId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            questionId: string;
            userId: string;
        };
    }>;
    removeBookmark(userId: string, questionId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserBookmarks(userId: string): Promise<{
        success: boolean;
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            technology: {
                id: string;
                name: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
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
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        })[];
    }>;
    getUserBookmarkIds(userId: string): Promise<string[]>;
}
