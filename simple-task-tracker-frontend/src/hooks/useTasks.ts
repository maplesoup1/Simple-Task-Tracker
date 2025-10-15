import { useState, useEffect, useCallback, useReducer } from 'react'
import type { Task } from '../types'
import * as taskService from '../services/taskService'
import { getErrorMessage, ERROR_MESSAGES, logError } from '../utils/errorHandler'
import { getTasksByStatus as filterByStatus, getTaskById as findById } from '../utils/taskFilter'

// State type
interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
}

// Action types
type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: number; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: number }
  | { type: 'REPLACE_TASK'; payload: { tempId: number; task: Task } }

// Reducer
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null }

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      }

    case 'REPLACE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.tempId ? action.payload.task : task
        ),
      }

    default:
      return state
  }
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: true,
  error: null,
}

export const useTasks = () => {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'SET_ERROR', payload: null })

      const response = await taskService.getTasks()

      // Flatten the response into a single array
      const allTasks = [
        ...response.TODO,
        ...response.INPROGRESS,
        ...response.DONE,
      ]

      dispatch({ type: 'SET_TASKS', payload: allTasks })
    } catch (err: any) {
      const errorMessage = getErrorMessage(err, ERROR_MESSAGES.FETCH_TASKS)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      logError('fetchTasks', err)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Load tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Add task with optimistic update
  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'status'>) => {
    const tempId = -Date.now() // Negative timestamp as temp ID
    const tempTask: Task = {
      id: tempId,
      title: taskData.title,
      description: taskData.description,
      status: 'TODO',
    }

    // Optimistic update
    dispatch({ type: 'ADD_TASK', payload: tempTask })

    try {
      const newTask = await taskService.createTask(taskData.title, taskData.description)
      // Replace temp task with real task
      dispatch({ type: 'REPLACE_TASK', payload: { tempId, task: newTask } })
    } catch (err: any) {
      // Rollback on error
      dispatch({ type: 'DELETE_TASK', payload: tempId })
      const errorMessage = getErrorMessage(err, ERROR_MESSAGES.CREATE_TASK)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      logError('addTask', err)
      throw err
    }
  }, [])

  // Delete task with optimistic update
  const deleteTask = useCallback(async (taskId: number) => {
    // Store for potential rollback
    const taskToDelete = state.tasks.find(t => t.id === taskId)
    if (!taskToDelete) return

    // Optimistic update
    dispatch({ type: 'DELETE_TASK', payload: taskId })

    try {
      await taskService.deleteTask(taskId)
    } catch (err: any) {
      // Rollback on error
      dispatch({ type: 'ADD_TASK', payload: taskToDelete })
      const errorMessage = getErrorMessage(err, ERROR_MESSAGES.DELETE_TASK)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      logError('deleteTask', err)
      throw err
    }
  }, [state.tasks])

  // Update task with optimistic update
  const updateTask = useCallback(async (
    taskId: number,
    updates: { title?: string; description?: string; status?: Task['status'] }
  ) => {
    // Store original for potential rollback
    const originalTask = state.tasks.find(t => t.id === taskId)
    if (!originalTask) return

    // Optimistic update
    dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates } })

    try {
      // If status is being updated, use the status update endpoint
      if (updates.status && updates.status !== originalTask.status) {
        await taskService.changeTaskStatus(taskId, updates.status)
      }

      // If title or description is being updated, use the update endpoint
      if (updates.title !== undefined || updates.description !== undefined) {
        await taskService.updateTask(taskId, {
          title: updates.title,
          description: updates.description,
        })
      }
    } catch (err: any) {
      // Rollback on error
      dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates: originalTask } })
      const errorMessage = getErrorMessage(err, ERROR_MESSAGES.UPDATE_TASK)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      logError('updateTask', err)
      throw err
    }
  }, [state.tasks])

  // Move task (drag and drop)
  const moveTask = useCallback(async (
    taskId: number,
    newStatus: Task['status']
  ) => {
    const originalTask = state.tasks.find(t => t.id === taskId)
    if (!originalTask) return

    // Optimistic update
    dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates: { status: newStatus } } })

    try {
      await taskService.moveTask(taskId, newStatus)
    } catch (err: any) {
      // Rollback on error
      dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates: { status: originalTask.status } } })
      const errorMessage = getErrorMessage(err, ERROR_MESSAGES.MOVE_TASK)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      logError('moveTask', err)
      throw err
    }
  }, [state.tasks])

  // Helper functions using utils
  const getTasksByStatus = useCallback((status: Task['status']) => {
    return filterByStatus(state.tasks, status)
  }, [state.tasks])

  const getTaskById = useCallback((taskId: number) => {
    return findById(state.tasks, taskId)
  }, [state.tasks])

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    getTaskById,
    refetch: fetchTasks,
  }
}
