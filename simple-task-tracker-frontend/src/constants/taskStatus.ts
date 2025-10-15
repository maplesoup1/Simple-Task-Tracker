import type { Task } from '../types'

// Task status enum
export const TASK_STATUS = {
  TODO: 'TODO',
  INPROGRESS: 'INPROGRESS',
  DONE: 'DONE',
} as const

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS]

// Status labels for display
export const STATUS_LABELS: Record<Task['status'], string> = {
  TODO: 'To Do',
  INPROGRESS: 'In Progress',
  DONE: 'Done',
}

// Column configuration
export interface ColumnConfig {
  title: string
  status: Task['status']
}

export const COLUMNS_CONFIG: ColumnConfig[] = [
  { title: 'To Do', status: 'TODO' },
  { title: 'In Progress', status: 'INPROGRESS' },
  { title: 'Done', status: 'DONE' },
]

// Description length threshold for "click to view more" hint
export const DESCRIPTION_PREVIEW_LENGTH = 100
