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
        } & {
            id: string;
            createdAt: Date;
            questionId: string;
            userId: string;
        };
    }>;
    removeBookmark(questionId: string, userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserBookmarks(userId: string): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    getUserBookmarkIds(userId: string): Promise<{
        success: boolean;
        data: string[];
    }>;
}
