import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';

@Injectable()
export class TechnologiesService {
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

  async findOne(idOrSlug: string) {
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
      throw new NotFoundException(`Technology '${idOrSlug}' not found.`);
    }

    return {
      success: true,
      data: {
        ...technology,
        questionCount: technology._count.questions,
      },
    };
  }

  async create(createTechnologyDto: CreateTechnologyDto) {
    const slug = createTechnologyDto.slug
      ? this.slugify(createTechnologyDto.slug)
      : this.slugify(createTechnologyDto.name);

    const existing = await this.prisma.technology.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Technology with slug '${slug}' already exists.`);
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

  async update(id: string, updateTechnologyDto: UpdateTechnologyDto) {
    const existing = await this.prisma.technology.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Technology with ID '${id}' not found.`);
    }

    let slug = existing.slug;
    if (updateTechnologyDto.slug || updateTechnologyDto.name) {
      const candidate = updateTechnologyDto.slug
        ? this.slugify(updateTechnologyDto.slug)
        : this.slugify(updateTechnologyDto.name || existing.name);

      if (candidate !== existing.slug) {
        const slugCollision = await this.prisma.technology.findUnique({ where: { slug: candidate } });
        if (slugCollision) {
          throw new ConflictException(`Technology with slug '${candidate}' already exists.`);
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

  async remove(id: string) {
    const technology = await this.prisma.technology.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });

    if (!technology) {
      throw new NotFoundException(`Technology with ID '${id}' not found.`);
    }

    if (technology._count.questions > 0) {
      throw new BadRequestException(
        `Cannot delete technology '${technology.name}' because it contains ${technology._count.questions} questions. Please reassign questions first.`,
      );
    }

    await this.prisma.technology.delete({ where: { id } });

    return {
      success: true,
      message: `Technology '${technology.name}' deleted successfully.`,
    };
  }
}
