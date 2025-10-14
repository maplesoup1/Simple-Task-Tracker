import { useState, useEffect, useCallback } from 'react'
import { Task } from './types'
import * as taskService from '../services/taskService'

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await taskService.getTasks()
      // Flatten the response into a single array
      const allTasks = [
        ...response.TODO,
        ...response.INPROGRESS,
        ...response.DONE,
      ]
      setTasks(allTasks)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Add task
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'status'>) => {
    try {
      await taskService.createTask(taskData.title, taskData.description)
      await fetchTasks() // Refetch to get updated list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create task')
      throw err
    }
  }, [fetchTasks])

  // Delete task
  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await taskService.deleteTask(taskId)
      await fetchTasks() // Refetch to get updated list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete task')
      throw err
    }
  }, [fetchTasks])

  // Update task
  const updateTask = useCallback(async (
    taskId: number,
    updates: { title?: string; description?: string }
  ) => {
    try {
      await taskService.updateTask(taskId, updates)
      await fetchTasks() // Refetch to get updated list
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update task')
      throw err
    }
  }, [fetchTasks])

  // Move task (drag and drop)
  const moveTask = useCallback(async (
    taskId: number,
    newStatus: Task['status']
  ) => {
    // Optimistic update: update UI immediately
    const previousTasks = [...tasks]
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )

    try {
      await taskService.moveTask(taskId, newStatus)
    } catch (err: any) {
      // Rollback on error
      setTasks(previousTasks)
      setError(err.response?.data?.error || 'Failed to move task')
      throw err
    }
  }, [tasks])

  // Get tasks by status
  const getTasksByStatus = useCallback((status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }, [tasks])

  // Get task by ID
  const getTaskById = useCallback((taskId: number) => {
    return tasks.find(task => task.id === taskId)
  }, [tasks])

  return {
    tasks,
    loading,
    error,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    getTaskById,
    refetch: fetchTasks,
  }
}
