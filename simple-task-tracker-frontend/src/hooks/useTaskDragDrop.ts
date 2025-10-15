import { useCallback } from 'react'
import type { DropResult } from '@hello-pangea/dnd'
import type { Task } from '../types'

interface UseTaskDragDropProps {
  onTaskMove: (taskId: number, newStatus: Task['status']) => Promise<void>
  disabled?: boolean
}

export const useTaskDragDrop = ({ onTaskMove, disabled = false }: UseTaskDragDropProps) => {
  const handleDragEnd = useCallback((result: DropResult) => {
    // Don't do anything if drag is disabled
    if (disabled) return

    const { destination, source, draggableId } = result

    // Dropped outside a droppable area
    if (!destination) return

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    // Move the task to the new status
    const taskId = parseInt(draggableId)
    const newStatus = destination.droppableId as Task['status']

    onTaskMove(taskId, newStatus)
  }, [onTaskMove, disabled])

  return {
    handleDragEnd,
    isDragDisabled: disabled,
  }
}
