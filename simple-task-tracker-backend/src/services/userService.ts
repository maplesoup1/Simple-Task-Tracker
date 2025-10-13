import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function createUser(id: string, name?: string) {
  return await prisma.user.create({
    data: { id, name, email: '' },
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
