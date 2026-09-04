import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export async function seedUsers(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@vinterview.com' },
    update: {},
    create: {
      email: 'admin@vinterview.com',
      name: 'Vinterview Admin',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isPremium: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@vinterview.com' },
    update: {},
    create: {
      email: 'user@vinterview.com',
      name: 'Demo Candidate',
      password: hashedPassword,
      role: UserRole.USER,
    },
  });

  console.log('✅ Seeded Default Accounts (admin@vinterview.com & user@vinterview.com).');
}
