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

  constructor(
    private readonly prisma: PrismaService,
    private readonly interviewService: InterviewService,
  ) {}

  private getAiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }


  private async parsePdfText(fileBuffer: Buffer): Promise<string> {
    try {
      if (typeof pdfParse === 'function') {
        const data = await pdfParse(fileBuffer);
        if (data && data.text) return data.text;
      }
      if (pdfParse && typeof pdfParse.PDFParse === 'function') {
        const parser = new pdfParse.PDFParse({ data: fileBuffer });
        await parser.load();
        const textResult = await parser.getText();
        if (typeof textResult === 'string') return textResult;
        if (textResult && textResult.text) return textResult.text;
        if (textResult && Array.isArray(textResult.pages)) {
          return textResult.pages.map((p: any) => p.text || '').join('\n');
        }
      }
      if (pdfParse && pdfParse.default && typeof pdfParse.default === 'function') {
        const data = await pdfParse.default(fileBuffer);
        if (data && data.text) return data.text;
      }
    } catch (e: any) {
      this.logger.warn(`Primary PDF parser warning: ${e?.message}`);
    }

    // Fallback: extract readable strings from PDF buffer
    const rawText = fileBuffer.toString('utf-8');
    const cleanText = rawText.replace(/[^\x20-\x7E\s\u00C0-\u1EF9]/g, ' ');
    return cleanText.trim();
  }

  async analyzeCv(fileBuffer: Buffer): Promise<CvAnalysisResult> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException('File PDF CV không hợp lệ hoặc bị rỗng.');
    }

    let extractedText = '';
    try {
      extractedText = await this.parsePdfText(fileBuffer);
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
