import { PrismaClient } from '@prisma/client';
export declare const categoriesData: {
    name: string;
    slug: string;
    description: string;
}[];
export declare function seedCategories(prisma: PrismaClient): Promise<Map<string, string>>;
