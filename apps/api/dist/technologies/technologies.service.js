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
exports.TechnologiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TechnologiesService = class TechnologiesService {
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
    async findAll() {
        const technologies = await this.prisma.technology.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });
        return {
            success: true,
            data: technologies.map((tech) => ({
                id: tech.id,
                name: tech.name,
                slug: tech.slug,
                icon: tech.icon,
                questionCount: tech._count.questions,
                createdAt: tech.createdAt,
                updatedAt: tech.updatedAt,
            })),
        };
    }
    async findOne(idOrSlug) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
        const technology = await this.prisma.technology.findUnique({
            where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
            include: {
                _count: {
                    select: { questions: true },
                },
            },
        });
        if (!technology) {
            throw new common_1.NotFoundException(`Technology '${idOrSlug}' not found.`);
        }
        return {
            success: true,
            data: {
                ...technology,
                questionCount: technology._count.questions,
            },
        };
    }
    async create(createTechnologyDto) {
        const slug = createTechnologyDto.slug
            ? this.slugify(createTechnologyDto.slug)
            : this.slugify(createTechnologyDto.name);
        const existing = await this.prisma.technology.findUnique({ where: { slug } });
        if (existing) {
            throw new common_1.ConflictException(`Technology with slug '${slug}' already exists.`);
        }
        const newTechnology = await this.prisma.technology.create({
            data: {
                name: createTechnologyDto.name,
                slug,
                icon: createTechnologyDto.icon,
            },
        });
        return {
            success: true,
            message: 'Technology created successfully',
            data: newTechnology,
        };
    }
    async update(id, updateTechnologyDto) {
        const existing = await this.prisma.technology.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Technology with ID '${id}' not found.`);
        }
        let slug = existing.slug;
        if (updateTechnologyDto.slug || updateTechnologyDto.name) {
            const candidate = updateTechnologyDto.slug
                ? this.slugify(updateTechnologyDto.slug)
                : this.slugify(updateTechnologyDto.name || existing.name);
            if (candidate !== existing.slug) {
                const slugCollision = await this.prisma.technology.findUnique({ where: { slug: candidate } });
                if (slugCollision) {
                    throw new common_1.ConflictException(`Technology with slug '${candidate}' already exists.`);
                }
                slug = candidate;
            }
        }
        const updatedTechnology = await this.prisma.technology.update({
            where: { id },
            data: {
                ...(updateTechnologyDto.name && { name: updateTechnologyDto.name }),
                slug,
                ...(updateTechnologyDto.icon !== undefined && { icon: updateTechnologyDto.icon }),
            },
        });
        return {
            success: true,
            message: 'Technology updated successfully',
            data: updatedTechnology,
        };
    }
    async remove(id) {
        const technology = await this.prisma.technology.findUnique({
            where: { id },
            include: { _count: { select: { questions: true } } },
        });
        if (!technology) {
            throw new common_1.NotFoundException(`Technology with ID '${id}' not found.`);
        }
        if (technology._count.questions > 0) {
            throw new common_1.BadRequestException(`Cannot delete technology '${technology.name}' because it contains ${technology._count.questions} questions. Please reassign questions first.`);
        }
        await this.prisma.technology.delete({ where: { id } });
        return {
            success: true,
            message: `Technology '${technology.name}' deleted successfully.`,
        };
    }
};
exports.TechnologiesService = TechnologiesService;
exports.TechnologiesService = TechnologiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TechnologiesService);
//# sourceMappingURL=technologies.service.js.map