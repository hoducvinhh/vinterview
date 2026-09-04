import { PrismaClient } from '@prisma/client';
export declare const technologiesData: {
    name: string;
    slug: string;
    icon: string;
}[];
export declare function seedTechnologies(prisma: PrismaClient): Promise<Map<string, string>>;
