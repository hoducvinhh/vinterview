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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
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
    async findAll() {
        const categories = await this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });
        return {
            success: true,
            data: categories.map((cat) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                questionCount: cat._count.questions,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt,
            })),
        };
    }
    async findOne(idOrSlug) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        const category = await this.prisma.category.findUnique({
            where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category '${idOrSlug}' not found.`);
        }
        return {
            success: true,
            data: {
                ...category,
                questionCount: category._count.questions,
            },
        };
    }
    async create(createCategoryDto) {
        const slug = createCategoryDto.slug ? this.slugify(createCategoryDto.slug) : this.slugify(createCategoryDto.name);
        const existing = await this.prisma.category.findUnique({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException(`Category with slug '${slug}' already exists.`);
        }
        const newCategory = await this.prisma.category.create({
            data: {
                name: createCategoryDto.name,
                slug,
                description: createCategoryDto.description,
            },
        });
        return {
            success: true,
            message: 'Category created successfully',
            data: newCategory,
        };
    }
    async update(id, updateCategoryDto) {
        const existing = await this.prisma.category.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Category with ID '${id}' not found.`);
        }
        let slug = existing.slug;
        if (updateCategoryDto.slug || updateCategoryDto.name) {
            const candidate = updateCategoryDto.slug
                ? this.slugify(updateCategoryDto.slug)
                : this.slugify(updateCategoryDto.name || existing.name);
            if (candidate !== existing.slug) {
                const slugCollision = await this.prisma.category.findUnique({ where: { slug: candidate } });
                if (slugCollision) {
                    throw new common_1.ConflictException(`Category with slug '${candidate}' already exists.`);
                }
                slug = candidate;
            }
        }
        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: {
                ...(updateCategoryDto.name && { name: updateCategoryDto.name }),
                slug,
                ...(updateCategoryDto.description !== undefined && { description: updateCategoryDto.description }),
            },
        });
        return {
            success: true,
            message: 'Category updated successfully',
            data: updatedCategory,
        };
    }
    async remove(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { questions: true } } },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID '${id}' not found.`);
        }
        if (category._count.questions > 0) {
            throw new common_1.BadRequestException(`Cannot delete category '${category.name}' because it contains ${category._count.questions} questions. Please reassign questions first.`);
        }
        await this.prisma.category.delete({ where: { id } });
        return {
            success: true,
            message: `Category '${category.name}' deleted successfully.`,
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map