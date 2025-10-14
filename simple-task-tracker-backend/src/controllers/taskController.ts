import { Request, Response } from 'express'
import { TaskStatus } from '@prisma/client'
import * as taskService from '../services/taskService'

// POST /api/tasks
export async function createTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!
    const { title, description } = req.body

    if (!title?.trim()) {
      res.status(400).json({ error: 'Title is required' })
      return
    }

    const task = await taskService.createTask(userId, title, description)
    res.status(201).json(task)
  } catch (error) {
    console.error('Prisma createTask error:', error)
    res.status(500).json({
      error: 'Failed to create task',
      details: error instanceof Error ? error.message : String(error),
      prismaError: error
    })
  }
}

// GET /api/tasks
export async function listTasks(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!
    console.log('Fetching tasks for userId:', userId)
    const tasks = await taskService.listTasksByStatus(userId)
    res.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({
      error: 'Failed to fetch tasks',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}

// GET /api/tasks/count
export async function countTasks(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!
    const count = await taskService.countTasksByStatus(userId)
    res.json(count)
  } catch (error) {
    res.status(500).json({ error: 'Failed to count tasks' })
  }
}

// PUT /api/tasks/:id
export async function updateTask(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id)
    const { title, description } = req.body

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' })
      return
    }

    const updates: { title?: string; description?: string } = {}
    if (title !== undefined) updates.title = title
    if (description !== undefined) updates.description = description

    const task = await taskService.editTask(id, updates)
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' })
  }
}

// PATCH /api/tasks/:id/status
export async function changeStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id)
    const { status } = req.body

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' })
      return
    }

    if (!Object.values(TaskStatus).includes(status)) {
      res.status(400).json({ error: 'Invalid status' })
      return
    }

    const task = await taskService.changeTaskStatus(id, status)
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: 'Failed to change status' })
  }
}

// POST /api/tasks/:id/move
export async function moveTask(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.userId!
    const taskId = parseInt(req.params.id)
    const { toStatus, beforeId, afterId } = req.body

    if (isNaN(taskId)) {
      res.status(400).json({ error: 'Invalid task ID' })
      return
    }

    if (!Object.values(TaskStatus).includes(toStatus)) {
      res.status(400).json({ error: 'Invalid status' })
      return
    }

    const task = await taskService.moveTask({
      taskId,
      userId,
      toStatus,
      beforeId: beforeId ?? null,
      afterId: afterId ?? null
    })

    res.json(task)
  } catch (error) {
    if (error instanceof Error) {
      res.status(403).json({ error: error.message })
      return
    }
    res.status(500).json({ error: 'Failed to move task' })
  }
}

// DELETE /api/tasks/:id
export async function deleteTask(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid task ID' })
      return
    }

    await taskService.deleteTask(id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' })
  }
}
