import { BookmarksService } from './bookmarks.service';
export declare class BookmarksController {
    private readonly bookmarksService;
    constructor(bookmarksService: BookmarksService);
    createBookmark(questionId: string, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            question: {
                category: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                };
                technology: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                    icon: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                slug: string;
                content: string;
                difficulty: import("@prisma/client").$Enums.Difficulty;
                categoryId: string;
                technologyId: string;
                authorId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            questionId: string;
        };
    } | {
        success: boolean;
        message: string;
        data?: undefined;
    }>;
    removeBookmark(questionId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserBookmarks(userId: string): Promise<{
        success: boolean;
        data: ({
            category: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
            };
            technology: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
            title: string;
            slug: string;
            content: string;
            difficulty: import("@prisma/client").$Enums.Difficulty;
            categoryId: string;
            technologyId: string;
            authorId: string | null;
        })[];
    }>;
    getUserBookmarkIds(userId: string): Promise<{
        success: boolean;
        data: string[];
    }>;
}
