import { useState, useCallback } from 'react'
import { Task } from './types'

export const useTasks = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [nextId, setNextId] = useState(
    initialTasks.length > 0 ? Math.max(...initialTasks.map(t => t.id)) + 1 : 1
  )

  const addTask = useCallback((taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: nextId
    }
    setTasks(prev => [...prev, newTask])
    setNextId(prev => prev + 1)
  }, [nextId])

  const deleteTask = useCallback((taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }, [])

  const updateTask = useCallback((taskId: number, updates: Partial<Omit<Task, 'id'>>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ))
  }, [])

  const moveTask = useCallback((taskId: number, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ))
  }, [])

  const getTasksByStatus = useCallback((status: Task['status']) => {
    return tasks.filter(task => task.status === status)
  }, [tasks])

  const getTaskById = useCallback((taskId: number) => {
    return tasks.find(task => task.id === taskId)
  }, [tasks])

  return {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    getTaskById,
    setTasks
  }
}