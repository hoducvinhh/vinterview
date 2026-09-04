import { PrismaService } from '../prisma/prisma.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
export declare class TechnologiesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private slugify;
    findAll(): Promise<{
        success: boolean;
        data: {
            id: string;
            name: string;
            slug: string;
            icon: string | null;
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            icon: string | null;
        };
    }>;
    create(createTechnologyDto: CreateTechnologyDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            icon: string | null;
        };
    }>;
    update(id: string, updateTechnologyDto: UpdateTechnologyDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            icon: string | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
