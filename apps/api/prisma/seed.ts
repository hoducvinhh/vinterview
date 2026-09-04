import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users.seed';
import { seedCategories } from './seeds/categories.seed';
import { seedTechnologies } from './seeds/technologies.seed';
import { seedQuestions } from './seeds/questions.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Vinterview database seed (Modular Version)...');

  // 1. Seed Default User Accounts
  await seedUsers(prisma);

  // 2. Seed Categories
  const categoryMap = await seedCategories(prisma);

  // 3. Seed Technologies
  const techMap = await seedTechnologies(prisma);

  // 4. Seed Interview Questions & Answers
  await seedQuestions(prisma, categoryMap, techMap);

  console.log('🚀 Vinterview database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed process failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
