"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const users_seed_1 = require("./seeds/users.seed");
const categories_seed_1 = require("./seeds/categories.seed");
const technologies_seed_1 = require("./seeds/technologies.seed");
const questions_seed_1 = require("./seeds/questions.seed");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting Vinterview database seed (Modular Version)...');
    await (0, users_seed_1.seedUsers)(prisma);
    const categoryMap = await (0, categories_seed_1.seedCategories)(prisma);
    const techMap = await (0, technologies_seed_1.seedTechnologies)(prisma);
    await (0, questions_seed_1.seedQuestions)(prisma, categoryMap, techMap);
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
//# sourceMappingURL=seed.js.map