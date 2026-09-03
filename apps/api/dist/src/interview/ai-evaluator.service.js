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
var AiEvaluatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiEvaluatorService = void 0;
const common_1 = require("@nestjs/common");
const genai_1 = require("@google/genai");
let AiEvaluatorService = AiEvaluatorService_1 = class AiEvaluatorService {
    logger = new common_1.Logger(AiEvaluatorService_1.name);
    aiClient = null;
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            this.aiClient = new genai_1.GoogleGenAI({ apiKey });
        }
        else {
            this.logger.warn('GEMINI_API_KEY is not configured in environment variables.');
        }
    }
    async evaluateAnswer(params) {
        const { questionTitle, questionContent, canonicalAnswer, userAnswer } = params;
        if (!this.aiClient) {
            return this.getFallbackEvaluation('Chưa cấu hình GEMINI_API_KEY.');
        }
        if (!userAnswer || !userAnswer.trim()) {
            return {
                rating: 1,
                scorePercent: 0,
                strengths: [],
                improvements: ['Ứng viên chưa nhập câu trả lời.'],
                aiFeedback: 'Ứng viên chưa cung cấp câu trả lời hoặc giải pháp cho câu hỏi này.',
                suggestedAnswer: canonicalAnswer || 'Vui lòng tham khảo đáp án chuẩn.',
            };
        }
        const prompt = `
Bạn là một Technical Lead / Senior Interviewer chuyên nghiệp đang thực hiện phỏng vấn kỹ thuật lập trình.
Hãy đánh giá câu trả lời của ứng viên dựa trên câu hỏi và đáp án chuẩn (nếu có).

[CÂU HỎI]: ${questionTitle}
[NỘI DUNG CÂU HỎI]: ${questionContent}
[ĐÁP ÁN CHUẨN]: ${canonicalAnswer || 'N/A'}
[CÂU TRẢ LỜI CỦA ỨNG VIÊN]: ${userAnswer}

YÊU CẦU:
1. Đánh giá khách quan, chính xác, mang tính xây dựng.
2. Trả về kết quả dưới dạng JSON duy nhất với cấu trúc sau (không kèm markdown format ngoài JSON):
{
  "rating": <số nguyên từ 1 đến 5>,
  "scorePercent": <số nguyên từ 0 đến 100>,
  "strengths": [<danh sách 1-3 điểm tốt mà ứng viên đã nêu đúng bằng tiếng Việt>],
  "improvements": [<danh sách 1-3 điểm còn thiếu, chưa chính xác hoặc cần bổ sung bằng tiếng Việt>],
  "aiFeedback": "<nhận xét tổng quan ngắn gọn 2-3 câu từ AI Tech Lead bằng tiếng Việt>",
  "suggestedAnswer": "<câu trả lời chuẩn mực, ngắn gọn, súc tích bằng tiếng Việt>"
}
`;
        try {
            const response = await this.aiClient.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.2,
                },
            });
            const text = response.text;
            if (!text) {
                throw new Error('Empty response from Gemini API');
            }
            const json = JSON.parse(text);
            return {
                rating: Math.min(5, Math.max(1, Math.round(json.rating || 3))),
                scorePercent: Math.min(100, Math.max(0, Math.round(json.scorePercent || 60))),
                strengths: Array.isArray(json.strengths) ? json.strengths : [],
                improvements: Array.isArray(json.improvements) ? json.improvements : [],
                aiFeedback: json.aiFeedback || 'Đã ghi nhận câu trả lời.',
                suggestedAnswer: json.suggestedAnswer || canonicalAnswer || '',
            };
        }
        catch (error) {
            this.logger.error(`Gemini AI Evaluation Error: ${error?.message || error}`);
            return this.getFallbackEvaluation(`Lỗi kết nối AI: ${error?.message || 'Không xác định'}`);
        }
    }
    getFallbackEvaluation(reason) {
        return {
            rating: 3,
            scorePercent: 60,
            strengths: ['Đã đưa ra phản hồi cho câu hỏi.'],
            improvements: ['Cần bổ sung chi tiết giải thuật hoặc ví dụ thực tế.'],
            aiFeedback: `Đã ghi nhận câu trả lời. (${reason})`,
            suggestedAnswer: 'Vui lòng đối chiếu với đáp án chuẩn bên dưới.',
        };
    }
};
exports.AiEvaluatorService = AiEvaluatorService;
exports.AiEvaluatorService = AiEvaluatorService = AiEvaluatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiEvaluatorService);
//# sourceMappingURL=ai-evaluator.service.js.map