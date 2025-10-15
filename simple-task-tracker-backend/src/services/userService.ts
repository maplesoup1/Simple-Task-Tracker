import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Idempotent user sync - upsert user from Supabase
export async function syncUser(id: string, email: string, name?: string) {
  return await prisma.user.upsert({
    where: { id },
    update: { email, name },
    create: { id, email, name }
  });
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: { tasks: true },
  });
}

export async function updateUser(id: string, data: { name?: string; email?: string }) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({
    where: { id },
  });
}
