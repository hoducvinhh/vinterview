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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_evaluator_service_1 = require("./ai-evaluator.service");
const crypto_1 = require("crypto");
let InterviewService = class InterviewService {
    constructor(prisma, aiEvaluator) {
        this.prisma = prisma;
        this.aiEvaluator = aiEvaluator;
        this.sessions = new Map();
    }
    async startInterview(dto, userId) {
        const where = {};
        if (dto.difficulty) {
            where.difficulty = dto.difficulty;
        }
        if (dto.category) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.category);
            where.category = isUuid ? { id: dto.category } : { slug: dto.category };
        }
        if (dto.technology) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(dto.technology);
            where.technology = isUuid ? { id: dto.technology } : { slug: dto.technology };
        }
        const candidateQuestions = await this.prisma.question.findMany({
            where,
            include: {
                category: true,
                technology: true,
                answer: true,
            },
        });
        if (candidateQuestions.length === 0) {
            throw new common_1.NotFoundException('No questions found matching your interview filters.');
        }
        const shuffled = candidateQuestions.sort(() => 0.5 - Math.random());
        const count = Math.min(dto.questionCount || 5, shuffled.length);
        const selectedQuestions = shuffled.slice(0, count);
        const sessionId = (0, crypto_1.randomUUID)();
        const sessionState = {
            id: sessionId,
            userId,
            questions: selectedQuestions,
            currentIndex: 0,
            answers: {},
            startTime: new Date(),
        };
        this.sessions.set(sessionId, sessionState);
        const currentQuestion = selectedQuestions[0];
        return {
            success: true,
            data: {
                sessionId,
                totalQuestions: selectedQuestions.length,
                currentIndex: 0,
                question: {
                    id: currentQuestion.id,
                    title: currentQuestion.title,
                    slug: currentQuestion.slug,
                    content: currentQuestion.content,
                    difficulty: currentQuestion.difficulty,
                    category: currentQuestion.category,
                    technology: currentQuestion.technology,
                },
            },
        };
    }
    async submitAnswer(sessionId, dto) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Interview session not found or expired.');
        }
        const currentQuestion = session.questions[session.currentIndex];
        if (!currentQuestion) {
            throw new common_1.BadRequestException('Interview session has already completed.');
        }
        const aiEvaluation = await this.aiEvaluator.evaluateAnswer({
            questionTitle: currentQuestion.title,
            questionContent: currentQuestion.content,
            canonicalAnswer: currentQuestion.answer?.content,
            userAnswer: dto.userAnswer,
        });
        const finalRating = aiEvaluation.rating || dto.rating || 3;
        session.answers[dto.questionId] = {
            questionId: dto.questionId,
            userAnswer: dto.userAnswer,
            rating: finalRating,
            aiEvaluation,
        };
        session.currentIndex += 1;
        const isComplete = session.currentIndex >= session.questions.length;
        if (isComplete) {
            session.endTime = new Date();
        }
        const nextQuestion = !isComplete ? session.questions[session.currentIndex] : null;
        return {
            success: true,
            data: {
                expectedAnswer: currentQuestion.answer,
                aiEvaluation,
                isComplete,
                currentIndex: session.currentIndex,
                totalQuestions: session.questions.length,
                nextQuestion: nextQuestion
                    ? {
                        id: nextQuestion.id,
                        title: nextQuestion.title,
                        slug: nextQuestion.slug,
                        content: nextQuestion.content,
                        difficulty: nextQuestion.difficulty,
                        category: nextQuestion.category,
                        technology: nextQuestion.technology,
                    }
                    : null,
            },
        };
    }
    async getResult(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new common_1.NotFoundException('Interview session not found or expired.');
        }
        const totalQuestions = session.questions.length;
        let totalScore = 0;
        const maxScore = totalQuestions * 5;
        const questionsSummary = session.questions.map((q) => {
            const ans = session.answers[q.id] || { userAnswer: '', rating: 0 };
            totalScore += ans.rating;
            return {
                id: q.id,
                title: q.title,
                difficulty: q.difficulty,
                category: q.category.name,
                technology: q.technology.name,
                userAnswer: ans.userAnswer,
                rating: ans.rating,
                expectedAnswer: q.answer,
                aiEvaluation: ans.aiEvaluation,
            };
        });
        const scorePercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        let readinessGrade = 'Needs Review';
        if (scorePercentage >= 80)
            readinessGrade = 'Senior Ready';
        else if (scorePercentage >= 60)
            readinessGrade = 'Mid-Level Ready';
        return {
            success: true,
            data: {
                sessionId: session.id,
                totalQuestions,
                totalScore,
                maxScore,
                scorePercentage,
                readinessGrade,
                questionsSummary,
            },
        };
    }
};
exports.InterviewService = InterviewService;
exports.InterviewService = InterviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ai_evaluator_service_1.AiEvaluatorService])
], InterviewService);
//# sourceMappingURL=interview.service.js.map