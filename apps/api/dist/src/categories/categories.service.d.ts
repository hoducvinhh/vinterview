import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private slugify;
    findAll(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            questionCount: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findOne(idOrSlug: string): Promise<{
        success: boolean;
        data: {
            questionCount: number;
            _count: {
                questions: number;
            };
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        };
    }>;
    create(createCategoryDto: CreateCategoryDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        };
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
