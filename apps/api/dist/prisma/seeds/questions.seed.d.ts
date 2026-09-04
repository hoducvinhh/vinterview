import { PrismaClient } from '@prisma/client';
export declare const questionsData: ({
    title: string;
    slug: string;
    difficulty: "MEDIUM";
    categorySlug: string;
    techSlug: string;
    content: string;
    answer: {
        content: string;
        codeSnippet: string;
        explanation: string;
    };
} | {
    title: string;
    slug: string;
    difficulty: "EASY";
    categorySlug: string;
    techSlug: string;
    content: string;
    answer: {
        content: string;
        codeSnippet: string;
        explanation: string;
    };
} | {
    title: string;
    slug: string;
    difficulty: "HARD";
    categorySlug: string;
    techSlug: string;
    content: string;
    answer: {
        content: string;
        codeSnippet: string;
        explanation: string;
    };
})[];
export declare function seedQuestions(prisma: PrismaClient, categoryMap: Map<string, string>, techMap: Map<string, string>): Promise<void>;
