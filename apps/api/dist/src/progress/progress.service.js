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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ProgressService = class ProgressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateProgress(userId, questionId, status) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question) {
            throw new common_1.NotFoundException(`Question with ID "${questionId}" not found.`);
        }
        const progress = await this.prisma.userProgress.upsert({
            where: {
                userId_questionId: {
                    userId,
                    questionId,
                },
            },
            update: {
                status,
            },
            create: {
                userId,
                questionId,
                status,
            },
        });
        return {
            success: true,
            message: `Question progress set to ${status}`,
            data: progress,
        };
    }
    async getUserProgress(userId) {
        const [totalQuestions, completedQuestions, inProgressQuestions, recentlyCompleted] = await Promise.all([
            this.prisma.question.count(),
            this.prisma.userProgress.count({
                where: { userId, status: client_1.ProgressStatus.COMPLETED },
            }),
            this.prisma.userProgress.count({
                where: { userId, status: client_1.ProgressStatus.IN_PROGRESS },
            }),
            this.prisma.userProgress.findMany({
                where: { userId, status: client_1.ProgressStatus.COMPLETED },
                orderBy: { updatedAt: 'desc' },
                take: 5,
                include: {
                    question: {
                        include: {
                            category: true,
                            technology: true,
                        },
                    },
                },
            }),
        ]);
        const completionPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
        return {
            success: true,
            data: {
                stats: {
                    totalQuestions,
                    completedQuestions,
                    inProgressQuestions,
                    completionPercentage,
                },
                recentlyCompleted: recentlyCompleted.map((p) => ({
                    ...p.question,
                    completedAt: p.updatedAt,
                })),
            },
        };
    }
    async getUserProgressMap(userId) {
        const progressList = await this.prisma.userProgress.findMany({
            where: { userId },
            select: { questionId: true, status: true },
        });
        const map = {};
        for (const p of progressList) {
            map[p.questionId] = p.status;
        }
        return map;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map