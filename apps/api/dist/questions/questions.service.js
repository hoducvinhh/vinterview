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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestionsService = class QuestionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    async findAll(query) {
        const { page = 1, limit = 10, search, category, technology, difficulty, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search?.trim()) {
            const term = search.trim();
            where.OR = [
                { title: { contains: term, mode: 'insensitive' } },
                { slug: { contains: term, mode: 'insensitive' } },
                { content: { contains: term, mode: 'insensitive' } },
                { category: { name: { contains: term, mode: 'insensitive' } } },
                { technology: { name: { contains: term, mode: 'insensitive' } } },
                { answer: { content: { contains: term, mode: 'insensitive' } } },
                { answer: { explanation: { contains: term, mode: 'insensitive' } } },
            ];
        }
        if (category) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category);
            if (isUuid) {
                where.categoryId = category;
            }
            else {
                where.category = { slug: category };
            }
        }
        if (technology) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(technology);
            if (isUuid) {
                where.technologyId = technology;
            }
            else {
                where.technology = { slug: technology };
            }
        }
        if (difficulty) {
            where.difficulty = difficulty;
        }
        const [questions, total] = await Promise.all([
            this.prisma.question.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    category: {
                        select: { id: true, name: true, slug: true },
                    },
                    technology: {
                        select: { id: true, name: true, slug: true, icon: true },
                    },
                    answer: {
                        select: { id: true, content: true, codeSnippet: true, explanation: true },
                    },
                },
            }),
            this.prisma.question.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            data: questions,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }
    async findBySlug(slugOrId) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
        const question = await this.prisma.question.findUnique({
            where: isUuid ? { id: slugOrId } : { slug: slugOrId },
            include: {
                category: true,
                technology: true,
                answer: true,
            },
        });
        if (!question) {
            throw new common_1.NotFoundException(`Question with identifier "${slugOrId}" not found`);
        }
        return {
            success: true,
            data: question,
        };
    }
    async create(createQuestionDto) {
        const { title, slug: customSlug, content, difficulty, categoryId, technologyId, answer } = createQuestionDto;
        const categoryExists = await this.prisma.category.findUnique({ where: { id: categoryId } });
        if (!categoryExists) {
            throw new common_1.NotFoundException(`Category with ID "${categoryId}" not found`);
        }
        const techExists = await this.prisma.technology.findUnique({ where: { id: technologyId } });
        if (!techExists) {
            throw new common_1.NotFoundException(`Technology with ID "${technologyId}" not found`);
        }
        const slug = customSlug ? this.slugify(customSlug) : this.slugify(title);
        const slugExists = await this.prisma.question.findUnique({ where: { slug } });
        if (slugExists) {
            throw new common_1.ConflictException(`Question with slug "${slug}" already exists`);
        }
        const newQuestion = await this.prisma.question.create({
            data: {
                title,
                slug,
                content,
                difficulty,
                categoryId,
                technologyId,
                ...(answer && {
                    answer: {
                        create: {
                            content: answer.content,
                            codeSnippet: answer.codeSnippet,
                            explanation: answer.explanation,
                        },
                    },
                }),
            },
            include: {
                category: true,
                technology: true,
                answer: true,
            },
        });
        return {
            success: true,
            data: newQuestion,
        };
    }
    async update(id, updateQuestionDto) {
        const existing = await this.prisma.question.findUnique({
            where: { id },
            include: { answer: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Question with ID "${id}" not found`);
        }
        const { categoryId, technologyId, answer, slug: newSlug, ...dataToUpdate } = updateQuestionDto;
        if (categoryId) {
            const categoryExists = await this.prisma.category.findUnique({ where: { id: categoryId } });
            if (!categoryExists) {
                throw new common_1.NotFoundException(`Category with ID "${categoryId}" not found`);
            }
        }
        if (technologyId) {
            const techExists = await this.prisma.technology.findUnique({ where: { id: technologyId } });
            if (!techExists) {
                throw new common_1.NotFoundException(`Technology with ID "${technologyId}" not found`);
            }
        }
        let finalSlug = undefined;
        if (newSlug) {
            finalSlug = this.slugify(newSlug);
            if (finalSlug !== existing.slug) {
                const slugExists = await this.prisma.question.findUnique({ where: { slug: finalSlug } });
                if (slugExists) {
                    throw new common_1.ConflictException(`Question with slug "${finalSlug}" already exists`);
                }
            }
        }
        const updated = await this.prisma.question.update({
            where: { id },
            data: {
                ...dataToUpdate,
                ...(finalSlug && { slug: finalSlug }),
                ...(categoryId && { categoryId }),
                ...(technologyId && { technologyId }),
                ...(answer && {
                    answer: {
                        upsert: {
                            create: {
                                content: answer.content,
                                codeSnippet: answer.codeSnippet,
                                explanation: answer.explanation,
                            },
                            update: {
                                content: answer.content,
                                codeSnippet: answer.codeSnippet,
                                explanation: answer.explanation,
                            },
                        },
                    },
                }),
            },
            include: {
                category: true,
                technology: true,
                answer: true,
            },
        });
        return {
            success: true,
            data: updated,
        };
    }
    async remove(id) {
        const existing = await this.prisma.question.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Question with ID "${id}" not found`);
        }
        await this.prisma.question.delete({ where: { id } });
        return {
            success: true,
            message: `Question with ID "${id}" deleted successfully`,
        };
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map