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
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ProgressStatus;
            questionId: string;
            userId: string;
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
            }[];
        };
    }>;
    getUserProgressMap(userId: string): Promise<{
        success: boolean;
        data: Record<string, import("@prisma/client").$Enums.ProgressStatus>;
    }>;
}
