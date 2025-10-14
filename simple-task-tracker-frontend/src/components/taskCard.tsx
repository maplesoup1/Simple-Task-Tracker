import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Task } from './types'
import { usePopup } from './popupProvider'

interface TaskCardProps {
  task: Task
  index: number
  onDelete: (id: number) => void
  onTaskClick?: (id: number) => void
  isDragDisabled?: boolean
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onDelete, onTaskClick, isDragDisabled = false }) => {
  const { confirm } = usePopup()
  const getCardColors = () => {
    switch (task.status) {
      case 'INPROGRESS':
        return {
          container: 'bg-orange-100 border-orange-300',
          badge: 'bg-orange-200 text-orange-800',
          accent: 'text-orange-600',
          delete: 'text-orange-500 hover:text-orange-700'
        }
      case 'DONE':
        return {
          container: 'bg-green-100 border-green-300',
          badge: 'bg-green-200 text-green-800',
          accent: 'text-green-600',
          delete: 'text-green-500 hover:text-green-700'
        }
      case 'TODO':
      default:
        return {
          container: 'bg-pink-100 border-pink-300',
          badge: 'bg-pink-200 text-pink-800',
          accent: 'text-pink-600',
          delete: 'text-pink-500 hover:text-pink-700'
        }
    }
  }

  const { container, badge, accent, delete: deleteColors } = getCardColors()

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const confirmed = await confirm({
      title: 'Delete Task',
      message: `Delete "${task.title}"? This cannot be undone.`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel'
    })

    if (confirmed) {
      onDelete(task.id)
    }
  }

  const handleCardClick = () => {
    if (onTaskClick) {
      onTaskClick(task.id)
    }
  }

  return (
    <Draggable draggableId={task.id.toString()} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`relative border-2 ${container} rounded-2xl p-6 mb-3 shadow-lg transition-all ${
            isDragDisabled ? 'cursor-pointer' : 'cursor-move hover:shadow-xl hover:scale-105'
          } ${
            snapshot.isDragging ? 'rotate-2 shadow-2xl scale-110' : ''
          }`}
        >
          <button
            onClick={handleDeleteClick}
            className={`absolute top-4 right-4 text-2xl font-bold bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center z-10 ${deleteColors}`}
            aria-label="Delete task"
          >
            ×
          </button>

          <div className="mb-4">
            <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${badge}`}>
              {task.title}
            </span>
          </div>

          {task.description && (
            <p className="m-0 text-gray-600 text-base leading-relaxed pr-8 line-clamp-3">
              {task.description}
            </p>
          )}

          {task.description && task.description.length > 100 && (
            <div className="mt-2">
              <span className={`${accent} text-sm font-medium`}>Click to view more...</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard
