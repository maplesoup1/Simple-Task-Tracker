import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { ColumnProps } from '../../types'
import { getStatusTheme } from '../../constants/theme'
import TaskCard from './TaskCard'

const TaskColumn: React.FC<ColumnProps> = ({
  title,
  status,
  tasks,
  totalTaskCount,
  onDelete,
  onTaskClick,
  isDragDisabled = false
}) => {
  const theme = getStatusTheme(status)

  return (
    <div className={`flex-1 min-w-0 w-full mx-2 ${theme.column.container} border-2 rounded-xl`}>
      <div className={`${theme.column.header} p-4 rounded-t-lg flex justify-between items-center`}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <span className={`${theme.column.badge} text-sm font-bold px-3 py-1 rounded-full`}>
            {tasks.length}
          </span>
        </div>
      </div>

      <Droppable droppableId={status} isDropDisabled={isDragDisabled}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[400px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : ''
            } ${isDragDisabled ? 'opacity-75' : ''}`}
          >
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No tasks yet</p>
                <p className="text-gray-400 text-xs">
                  {isDragDisabled ? 'No matching tasks' : 'Drag a task here or create a new one'}
                </p>
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onDelete={onDelete}
                onTaskClick={onTaskClick}
                isDragDisabled={isDragDisabled}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}

export default TaskColumn
