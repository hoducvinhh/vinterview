import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
export declare class ProgressController {
    private readonly progressService;
    constructor(progressService: ProgressService);
    updateProgress(questionId: string, dto: UpdateProgressDto, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.ProgressStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            questionId: string;
            notes: string | null;
        };
    }>;
    getUserProgress(userId: string): Promise<{
        success: boolean;
        data: {
            stats: {
                totalQuestions: number;
                completedQuestions: number;
                inProgressQuestions: number;
                completionPercentage: number;
            };
            recentlyCompleted: {
                completedAt: Date;
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
            }[];
        };
    }>;
    getUserProgressMap(userId: string): Promise<{
        success: boolean;
        data: Record<string, import("@prisma/client").$Enums.ProgressStatus>;
    }>;
}
