import { Difficulty } from '@prisma/client';
export declare class StartInterviewDto {
    technology?: string;
    category?: string;
    difficulty?: Difficulty;
    questionCount?: number;
}
