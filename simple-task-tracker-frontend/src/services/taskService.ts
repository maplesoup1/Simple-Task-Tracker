import apiClient from './api'
import { Task } from '../components/types'

export interface TasksResponse {
  TODO: Task[]
  INPROGRESS: Task[]
  DONE: Task[]
}

// Get all tasks grouped by status
export const getTasks = async (): Promise<TasksResponse> => {
  const response = await apiClient.get('/tasks')
  return response.data
}

// Create a new task
export const createTask = async (title: string, description?: string): Promise<Task> => {
  const response = await apiClient.post('/tasks', {
    title,
    description,
  })
  return response.data
}

// Update a task
export const updateTask = async (
  id: number,
  updates: { title?: string; description?: string }
): Promise<Task> => {
  const response = await apiClient.put(`/tasks/${id}`, updates)
  return response.data
}

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`)
}

// Change task status
export const changeTaskStatus = async (
  id: number,
  status: 'TODO' | 'INPROGRESS' | 'DONE'
): Promise<Task> => {
  const response = await apiClient.patch(`/tasks/${id}/status`, { status })
  return response.data
}

// Move task (for drag and drop)
export const moveTask = async (
  id: number,
  toStatus: 'TODO' | 'INPROGRESS' | 'DONE',
  beforeId?: number | null,
  afterId?: number | null
): Promise<Task> => {
  const response = await apiClient.post(`/tasks/${id}/move`, {
    toStatus,
    beforeId,
    afterId,
  })
  return response.data
}

// Get task count by status
export const getTaskCount = async (): Promise<{
  TODO: number
  INPROGRESS: number
  DONE: number
}> => {
  const response = await apiClient.get('/tasks/count')
  return response.data
}
