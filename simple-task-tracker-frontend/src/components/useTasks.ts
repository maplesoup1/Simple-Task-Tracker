import { useState, useEffect, useCallback } from 'react'
import { Task } from '../types'
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
    // Create a temporary task with a temporary ID
    const tempId = -Date.now() // Use negative timestamp as temp ID
    const tempTask: Task = {
      id: tempId,
      title: taskData.title,
      description: taskData.description,
      status: 'TODO'
    }

    // Optimistic update: add task to UI immediately
    setTasks(prevTasks => [...prevTasks, tempTask])

    try {
      const newTask = await taskService.createTask(taskData.title, taskData.description)
      // Replace temp task with real task from server
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === tempId ? newTask : task)
      )
    } catch (err: any) {
      // Rollback on error: remove temp task
      setTasks(prevTasks => prevTasks.filter(task => task.id !== tempId))
      setError(err.response?.data?.error || 'Failed to create task')
      throw err
    }
  }, [])

  // Delete task
  const deleteTask = useCallback(async (taskId: number) => {
    // Optimistic update: remove task from UI immediately
    const previousTasks = [...tasks]
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))

    try {
      await taskService.deleteTask(taskId)
    } catch (err: any) {
      // Rollback on error: restore the task
      setTasks(previousTasks)
      setError(err.response?.data?.error || 'Failed to delete task')
      throw err
    }
  }, [tasks])

  // Update task
  const updateTask = useCallback(async (
    taskId: number,
    updates: { title?: string; description?: string }
  ) => {
    // Optimistic update: update task in UI immediately
    const previousTasks = [...tasks]
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    )

    try {
      await taskService.updateTask(taskId, updates)
    } catch (err: any) {
      // Rollback on error
      setTasks(previousTasks)
      setError(err.response?.data?.error || 'Failed to update task')
      throw err
    }
  }, [tasks])

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
