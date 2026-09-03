"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ResumeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const interview_service_1 = require("../interview/interview.service");
const genai_1 = require("@google/genai");
const pdfParse = require('pdf-parse');
let ResumeService = ResumeService_1 = class ResumeService {
    prisma;
    interviewService;
    logger = new common_1.Logger(ResumeService_1.name);
    constructor(prisma, interviewService) {
        this.prisma = prisma;
        this.interviewService = interviewService;
    }
    getAiClient() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey)
            return null;
        return new genai_1.GoogleGenAI({ apiKey });
    }
    async parsePdfText(fileBuffer) {
        try {
            if (typeof pdfParse === 'function') {
                const data = await pdfParse(fileBuffer);
                if (data && data.text)
                    return data.text;
            }
            if (pdfParse && typeof pdfParse.PDFParse === 'function') {
                const parser = new pdfParse.PDFParse({ data: fileBuffer });
                await parser.load();
                const textResult = await parser.getText();
                if (typeof textResult === 'string')
                    return textResult;
                if (textResult && textResult.text)
                    return textResult.text;
                if (textResult && Array.isArray(textResult.pages)) {
                    return textResult.pages.map((p) => p.text || '').join('\n');
                }
            }
            if (pdfParse && pdfParse.default && typeof pdfParse.default === 'function') {
                const data = await pdfParse.default(fileBuffer);
                if (data && data.text)
                    return data.text;
            }
        }
        catch (e) {
            this.logger.warn(`Primary PDF parser warning: ${e?.message}`);
        }
        const rawText = fileBuffer.toString('utf-8');
        const cleanText = rawText.replace(/[^\x20-\x7E\s\u00C0-\u1EF9]/g, ' ');
        return cleanText.trim();
    }
    async analyzeCv(fileBuffer) {
        if (!fileBuffer || fileBuffer.length === 0) {
            throw new common_1.BadRequestException('File PDF CV không hợp lệ hoặc bị rỗng.');
        }
        let extractedText = '';
        try {
            extractedText = await this.parsePdfText(fileBuffer);
        }
        catch (err) {
            this.logger.error(`Lỗi trích xuất chữ từ PDF: ${err.message}`);
            throw new common_1.BadRequestException('Không thể đọc nội dung file PDF CV. Vui lòng đảm bảo file không bị khóa hoặc bị hỏng.');
        }
        if (!extractedText.trim()) {
            throw new common_1.BadRequestException('File PDF CV không chứa nội dung văn bản có thể trích xuất.');
        }
        let aiParsedData = {};
        const aiClient = this.getAiClient();
        if (aiClient) {
            try {
                const prompt = `
Bạn là một HR Tech Lead / Technical Recruiter chuyên nghiệp.
Hãy phân tích nội dung CV cá nhân dưới đây và trích xuất danh sách các công nghệ kỹ thuật, ngôn ngữ lập trình, framework, cơ sở dữ liệu và cấp độ kỹ năng của ứng viên.

[NỘI DUNG CV]:
${extractedText.slice(0, 8000)}

YÊU CẦU:
Trả về JSON duy nhất với cấu trúc sau (không kèm markdown ngoài JSON):
{
  "candidateName": "<họ tên ứng viên nếu tìm thấy, hoặc 'Ứng Viên'>",
  "title": "<vị trí chuyên môn chính, ví dụ: 'Fullstack Developer', 'Frontend Engineer'>",
  "detectedSkills": [<danh sách tên công nghệ kỹ thuật trích xuất được, ví dụ: "React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Python", "NestJS">],
  "experienceLevel": "<Junior / Mid-Level / Senior>",
  "summary": "<nhận xét tóm tắt ngắn gọn 2 câu về năng lực ứng viên bằng tiếng Việt>"
}
`;
                const response = await aiClient.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: 'application/json',
                        temperature: 0.1,
                    },
                });
                if (response.text) {
                    aiParsedData = JSON.parse(response.text);
                }
            }
            catch (err) {
                this.logger.error(`Gemini CV Analysis error: ${err.message}`);
            }
        }
        const detectedSkills = aiParsedData.detectedSkills || [];
        const candidateName = aiParsedData.candidateName || 'Ứng Viên';
        const title = aiParsedData.title || 'Developer';
        const experienceLevel = aiParsedData.experienceLevel || 'Mid-Level';
        const summary = aiParsedData.summary || 'Đã phân tích thông tin từ CV cá nhân.';
        const allTechnologies = await this.prisma.technology.findMany({
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });
        const matchedTechs = allTechnologies.filter((tech) => {
            const techName = tech.name.toLowerCase();
            const techSlug = tech.slug.toLowerCase();
            return detectedSkills.some((skill) => skill.toLowerCase().includes(techName) ||
                techName.includes(skill.toLowerCase()) ||
                skill.toLowerCase() === techSlug);
        });
        const techIds = matchedTechs.map((t) => t.id);
        const questions = await this.prisma.question.findMany({
            where: techIds.length > 0 ? { technologyId: { in: techIds } } : {},
            take: 10,
            select: { id: true },
        });
        return {
            candidateName,
            title,
            detectedSkills,
            experienceLevel,
            summary,
            matchedTechnologies: (matchedTechs.length > 0 ? matchedTechs : allTechnologies.slice(0, 4)).map((t) => ({
                id: t.id,
                name: t.name,
                slug: t.slug,
            })),
            matchingQuestionCount: questions.length,
            recommendedQuestionIds: questions.map((q) => q.id),
        };
    }
};
exports.ResumeService = ResumeService;
exports.ResumeService = ResumeService = ResumeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        interview_service_1.InterviewService])
], ResumeService);
//# sourceMappingURL=resume.service.js.map