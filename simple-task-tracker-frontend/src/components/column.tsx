import React from 'react'
import { Droppable } from '@hello-pangea/dnd'
import { Task } from './types'
import TaskCard from './taskCard'

interface ColumnProps {
  title: string
  status: 'TODO' | 'INPROGRESS' | 'DONE'
  tasks: Task[]
  totalTaskCount: number
  onDelete: (id: number) => void
  onTaskClick?: (id: number) => void
  isDragDisabled?: boolean
}

const Column: React.FC<ColumnProps> = ({ title, status, tasks, totalTaskCount, onDelete, onTaskClick, isDragDisabled = false }) => {
  const getColumnColor = () => {
    switch (status) {
      case 'TODO':
        return 'bg-pink-50 border-pink-200'
      case 'INPROGRESS':
        return 'bg-orange-50 border-orange-200'
      case 'DONE':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getHeaderColor = () => {
    switch (status) {
      case 'TODO':
        return 'bg-pink-200 text-pink-800'
      case 'INPROGRESS':
        return 'bg-orange-200 text-orange-800'
      case 'DONE':
        return 'bg-green-200 text-green-800'
      default:
        return 'bg-gray-200 text-gray-800'
    }
  }

  const getBadgeColor = () => {
    switch (status) {
      case 'TODO':
        return 'bg-pink-500 text-white'
      case 'INPROGRESS':
        return 'bg-orange-500 text-white'
      case 'DONE':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className={`flex-1 min-w-0 w-full mx-2 ${getColumnColor()} border-2 rounded-xl`}>
      <div className={`${getHeaderColor()} p-4 rounded-t-lg flex justify-between items-center`}>
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <span className={`${getBadgeColor()} text-sm font-bold px-3 py-1 rounded-full`}>
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
                <p className="text-gray-400 text-xs">{isDragDisabled ? 'No matching tasks' : 'Drag a task here or create a new one'}</p>
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

export default Column
