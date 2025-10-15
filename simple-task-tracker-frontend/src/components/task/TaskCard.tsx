import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { TaskCardProps } from '../../types'
import { usePopup } from '../modal/PopupProvider'
import { getStatusTheme } from '../../constants/theme'
import { DESCRIPTION_PREVIEW_LENGTH } from '../../constants/taskStatus'

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onDelete,
  onTaskClick,
  isDragDisabled = false
}) => {
  const { confirm } = usePopup()
  const theme = getStatusTheme(task.status)
  const colors = theme.card

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

  const showPreviewHint = task.description && task.description.length > DESCRIPTION_PREVIEW_LENGTH

  return (
    <Draggable draggableId={task.id.toString()} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`relative border-2 ${colors.container} rounded-2xl p-6 mb-3 shadow-lg transition-all ${
            isDragDisabled ? 'cursor-pointer' : 'cursor-move hover:shadow-xl hover:scale-105'
          } ${snapshot.isDragging ? 'rotate-2 shadow-2xl scale-110' : ''}`}
        >
          <button
            onClick={handleDeleteClick}
            className={`absolute top-4 right-4 text-2xl font-bold bg-transparent border-none cursor-pointer w-8 h-8 flex items-center justify-center z-10 ${colors.delete}`}
            aria-label="Delete task"
          >
            ×
          </button>

          <div className="mb-4">
            <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${colors.badge}`}>
              {task.title}
            </span>
          </div>

          {task.description && (
            <p className="m-0 text-gray-600 text-base leading-relaxed pr-8 line-clamp-3">
              {task.description}
            </p>
          )}

          {showPreviewHint && (
            <div className="mt-2">
              <span className={`${colors.accent} text-sm font-medium`}>Click to view more...</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default TaskCard
