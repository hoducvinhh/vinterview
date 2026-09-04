import { Difficulty } from '@prisma/client';
export declare class CreateAnswerDto {
    content: string;
    codeSnippet?: string;
    explanation?: string;
}
export declare class CreateQuestionDto {
    title: string;
    slug?: string;
    content: string;
    difficulty: Difficulty;
    categoryId: string;
    technologyId: string;
    answer?: CreateAnswerDto;
}
