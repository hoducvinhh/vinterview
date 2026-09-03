import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  private slugify(text: string): string {
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

  async findOne(idOrSlug: string) {
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
      throw new NotFoundException(`Category '${idOrSlug}' not found.`);
    }

    return {
      success: true,
      data: {
        ...category,
        questionCount: category._count.questions,
      },
    };
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.slug ? this.slugify(createCategoryDto.slug) : this.slugify(createCategoryDto.name);

    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Category with slug '${slug}' already exists.`);
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

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }

    let slug = existing.slug;
    if (updateCategoryDto.slug || updateCategoryDto.name) {
      const candidate = updateCategoryDto.slug
        ? this.slugify(updateCategoryDto.slug)
        : this.slugify(updateCategoryDto.name || existing.name);

      if (candidate !== existing.slug) {
        const slugCollision = await this.prisma.category.findUnique({ where: { slug: candidate } });
        if (slugCollision) {
          throw new ConflictException(`Category with slug '${candidate}' already exists.`);
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

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found.`);
    }

    if (category._count.questions > 0) {
      throw new BadRequestException(
        `Cannot delete category '${category.name}' because it contains ${category._count.questions} questions. Please reassign questions first.`,
      );
    }

    await this.prisma.category.delete({ where: { id } });

    return {
      success: true,
      message: `Category '${category.name}' deleted successfully.`,
    };
  }
}
