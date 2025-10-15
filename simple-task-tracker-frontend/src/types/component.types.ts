import { Task } from './task.types'

// Component props types
export interface ColumnProps {
  title: string
  status: 'TODO' | 'INPROGRESS' | 'DONE'
  tasks: Task[]
  totalTaskCount: number
  onDelete: (id: number) => void
  onTaskClick?: (id: number) => void
  isDragDisabled?: boolean
}

export interface TaskCardProps {
  task: Task
  index: number
  onDelete: (id: number) => void
  onTaskClick?: (id: number) => void
  isDragDisabled?: boolean
}

export interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void
  onClose: () => void
  isOpen: boolean
}

export interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (taskId: number, updates: Partial<Omit<Task, 'id'>>) => void
  onDelete: (taskId: number) => void
}

export interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export interface ConfirmOptions {
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}

export interface PopupContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}
