import { Difficulty } from '@prisma/client';
export declare class QueryQuestionsDto {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    technology?: string;
    difficulty?: Difficulty;
    sortBy?: 'createdAt' | 'title' | 'difficulty';
    sortOrder?: 'asc' | 'desc';
}
