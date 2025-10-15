import type { Task } from '../types'

// Filter tasks by search query (title or description)
export const filterTasksByQuery = (tasks: Task[], query: string): Task[] => {
  const trimmedQuery = query.trim()

  if (!trimmedQuery) {
    return tasks
  }

  const lowerQuery = trimmedQuery.toLowerCase()

  return tasks.filter(task => {
    const titleMatch = task.title.toLowerCase().includes(lowerQuery)
    const descriptionMatch = task.description?.toLowerCase().includes(lowerQuery)

    return titleMatch || descriptionMatch
  })
}

// Get tasks by status
export const getTasksByStatus = (tasks: Task[], status: Task['status']): Task[] => {
  return tasks.filter(task => task.status === status)
}

// Get task by ID
export const getTaskById = (tasks: Task[], taskId: number): Task | undefined => {
  return tasks.find(task => task.id === taskId)
}

// Check if search is active
export const isSearchActive = (query: string): boolean => {
  return query.trim().length > 0
}
