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
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookmarksService = class BookmarksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBookmark(userId, questionId) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
        });
        if (!question) {
            throw new common_1.NotFoundException(`Question with ID "${questionId}" not found.`);
        }
        try {
            const bookmark = await this.prisma.bookmark.create({
                data: {
                    userId,
                    questionId,
                },
                include: {
                    question: {
                        include: {
                            category: true,
                            technology: true,
                        },
                    },
                },
            });
            return {
                success: true,
                message: 'Question bookmarked successfully',
                data: bookmark,
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('Question is already bookmarked.');
            }
            throw error;
        }
    }
    async removeBookmark(userId, questionId) {
        const existingBookmark = await this.prisma.bookmark.findUnique({
            where: {
                userId_questionId: {
                    userId,
                    questionId,
                },
            },
        });
        if (!existingBookmark) {
            throw new common_1.NotFoundException('Bookmark not found for this question.');
        }
        await this.prisma.bookmark.delete({
            where: {
                userId_questionId: {
                    userId,
                    questionId,
                },
            },
        });
        return {
            success: true,
            message: 'Bookmark removed successfully',
        };
    }
    async getUserBookmarks(userId) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                question: {
                    include: {
                        category: true,
                        technology: true,
                        answer: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: bookmarks.map((b) => b.question),
        };
    }
    async getUserBookmarkIds(userId) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: { userId },
            select: { questionId: true },
        });
        return bookmarks.map((b) => b.questionId);
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map