import { ResumeService } from './resume.service';
export declare class ResumeController {
    private readonly resumeService;
    constructor(resumeService: ResumeService);
    analyzeCv(file: {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
    }): Promise<{
        success: boolean;
        data: import("./resume.service").CvAnalysisResult;
    }>;
}
