import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InterviewService } from '../interview/interview.service';
import { GoogleGenAI } from '@google/genai';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');


export interface CvAnalysisResult {
  candidateName?: string;
  title?: string;
  detectedSkills: string[];
  experienceLevel: string;
  summary: string;
  matchedTechnologies: Array<{ id: string; name: string; slug: string }>;
  matchingQuestionCount: number;
  recommendedQuestionIds: string[];
}

@Injectable()
export class ResumeService {
  private readonly logger = new Logger(ResumeService.name);
  private aiClient: GoogleGenAI | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly interviewService: InterviewService,
  ) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.aiClient = new GoogleGenAI({ apiKey });
    }
  }

  async analyzeCv(fileBuffer: Buffer): Promise<CvAnalysisResult> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException('File PDF CV không hợp lệ hoặc bị rỗng.');
    }

    let extractedText = '';
    try {
      const pdfData = await pdfParse(fileBuffer);
      extractedText = pdfData.text || '';
    } catch (err: any) {
      this.logger.error(`Lỗi trích xuất chữ từ PDF: ${err.message}`);
      throw new BadRequestException('Không thể đọc nội dung file PDF CV. Vui lòng đảm bảo file không bị khóa hoặc bị hỏng.');
    }

    if (!extractedText.trim()) {
      throw new BadRequestException('File PDF CV không chứa nội dung văn bản có thể trích xuất.');
    }

    // Call Gemini AI to analyze CV text
    let aiParsedData: {
      candidateName?: string;
      title?: string;
      detectedSkills?: string[];
      experienceLevel?: string;
      summary?: string;
    } = {};

    if (this.aiClient) {
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

        const response = await this.aiClient.models.generateContent({
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
      } catch (err: any) {
        this.logger.error(`Gemini CV Analysis error: ${err.message}`);
      }
    }

    const detectedSkills = aiParsedData.detectedSkills || [];
    const candidateName = aiParsedData.candidateName || 'Ứng Viên';
    const title = aiParsedData.title || 'Developer';
    const experienceLevel = aiParsedData.experienceLevel || 'Mid-Level';
    const summary = aiParsedData.summary || 'Đã phân tích thông tin từ CV cá nhân.';

    // Query technologies from Database and match against detectedSkills
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
      return detectedSkills.some(
        (skill) =>
          skill.toLowerCase().includes(techName) ||
          techName.includes(skill.toLowerCase()) ||
          skill.toLowerCase() === techSlug,
      );
    });

    // Find questions matching matchedTechs or general questions if matchedTechs is empty
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
}
