import { PrismaService } from '../prisma/prisma.service';
import { StartInterviewDto } from './dto/start-interview.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
export declare class InterviewService {
    private readonly prisma;
    private sessions;
    constructor(prisma: PrismaService);
    startInterview(dto: StartInterviewDto, userId?: string): Promise<{
        success: boolean;
        data: {
            sessionId: `${string}-${string}-${string}-${string}-${string}`;
            totalQuestions: number;
            currentIndex: number;
            question: {
                id: string;
                title: string;
                slug: string;
                content: string;
                difficulty: import("@prisma/client").$Enums.Difficulty;
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
            };
        };
    }>;
    submitAnswer(sessionId: string, dto: SubmitAnswerDto): Promise<{
        success: boolean;
        data: {
            expectedAnswer: any;
            isComplete: boolean;
            currentIndex: number;
            totalQuestions: number;
            nextQuestion: {
                id: any;
                title: any;
                slug: any;
                content: any;
                difficulty: any;
                category: any;
                technology: any;
            } | null;
        };
    }>;
    getResult(sessionId: string): Promise<{
        success: boolean;
        data: {
            sessionId: string;
            totalQuestions: number;
            totalScore: number;
            maxScore: number;
            scorePercentage: number;
            readinessGrade: string;
            questionsSummary: {
                id: any;
                title: any;
                difficulty: any;
                category: any;
                technology: any;
                userAnswer: string;
                rating: number;
                expectedAnswer: any;
            }[];
        };
    }>;
}
