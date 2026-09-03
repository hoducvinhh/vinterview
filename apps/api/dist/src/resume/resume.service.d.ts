import { PrismaService } from '../prisma/prisma.service';
import { InterviewService } from '../interview/interview.service';
export interface CvAnalysisResult {
    candidateName?: string;
    title?: string;
    detectedSkills: string[];
    experienceLevel: string;
    summary: string;
    matchedTechnologies: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    matchingQuestionCount: number;
    recommendedQuestionIds: string[];
}
export declare class ResumeService {
    private readonly prisma;
    private readonly interviewService;
    private readonly logger;
    private aiClient;
    constructor(prisma: PrismaService, interviewService: InterviewService);
    analyzeCv(fileBuffer: Buffer): Promise<CvAnalysisResult>;
}
