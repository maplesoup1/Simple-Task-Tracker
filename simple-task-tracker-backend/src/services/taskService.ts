import { PrismaClient, TaskStatus } from '@prisma/client'
const prisma = new PrismaClient()

export async function createTask(
  userId: string,
  title: string,
  description?: string
) {
  return prisma.task.create({
    data: { userId, title, description, status: TaskStatus.TODO },
  })
}

export async function editTask(
  id: number,
  updates: { title?: string; description?: string }
) {
  return prisma.task.update({
    where: { id },
    data: updates,
  })
}

export async function changeTaskStatus(id: number, status: TaskStatus) {
  return prisma.task.update({
    where: { id },
    data: { status },
  })
}

export async function deleteTask(id: number) {
  return prisma.task.delete({
    where: { id },
  })
}

export async function getTaskById(id: number, userId: string) {
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task || task.userId !== userId) return null
  return task
}

export async function listTasksByStatus(userId: string) {
  const [todo, inProgress, done] = await Promise.all([
    prisma.task.findMany({ where: { userId, status: TaskStatus.TODO },        orderBy: { position: 'asc' } }),
    prisma.task.findMany({ where: { userId, status: TaskStatus.INPROGRESS },   orderBy: { position: 'asc' } }),
    prisma.task.findMany({ where: { userId, status: TaskStatus.DONE },         orderBy: { position: 'asc' } }),
  ])
  return { TODO: todo, INPROGRESS: inProgress, DONE: done }
}

type MovePayload = {
  taskId: number
  userId: string
  toStatus: TaskStatus
  beforeId?: number | null   // put in the front
  afterId?: number | null    // put in the end
}

export async function moveTask({ taskId, userId, toStatus, beforeId, afterId }: MovePayload) {
  // read aligin position
  const [before, after] = await Promise.all([
    beforeId ? prisma.task.findUnique({ where: { id: beforeId } }) : null,
    afterId  ? prisma.task.findUnique({ where: { id: afterId } })  : null,
  ])

  // calculate new position
  let newPos: number
  if (before && after) newPos = (Number(before.position) + Number(after.position)) / 2
  else if (before && !after) newPos = Number(before.position) + 1        // put into bottom
  else if (!before && after) newPos = Number(after.position) - 1         // put into top
  else {
    newPos = 0
  }

  return prisma.$transaction(async (tx) => {
    const t = await tx.task.findUnique({ where: { id: taskId } })
    if (!t || t.userId !== userId) throw new Error('Task not found or forbidden')

    return tx.task.update({
      where: { id: taskId },
      data: { status: toStatus, position: newPos },
    })
  })
}

export async function countTasksByStatus(userId: string) {
  const result = await prisma.task.groupBy({
    by: ['status'],
    where: { userId },
    _count: { id: true }
  })

  return {
    TODO: result.find(r => r.status === TaskStatus.TODO)?._count.id || 0,
    INPROGRESS: result.find(r => r.status === TaskStatus.INPROGRESS)?._count.id || 0,
    DONE: result.find(r => r.status === TaskStatus.DONE)?._count.id || 0
  }
}

