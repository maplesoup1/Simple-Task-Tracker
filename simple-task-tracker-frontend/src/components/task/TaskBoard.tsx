import React from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import type { Task } from '../../types'
import { COLUMNS_CONFIG } from '../../constants/taskStatus'
import TaskColumn from './TaskColumn'

interface TaskBoardProps {
  tasks: Task[]
  onDragEnd: (result: DropResult) => void
  onTaskDelete: (taskId: number) => void
  onTaskClick: (taskId: number) => void
  isDragDisabled?: boolean
  filterTasksByStatus: (status: Task['status']) => Task[]
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onDragEnd,
  onTaskDelete,
  onTaskClick,
  isDragDisabled = false,
  filterTasksByStatus,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {COLUMNS_CONFIG.map(({ title, status }) => (
          <TaskColumn
            key={status}
            title={title}
            status={status}
            tasks={filterTasksByStatus(status)}
            totalTaskCount={tasks.length}
            onDelete={onTaskDelete}
            onTaskClick={onTaskClick}
            isDragDisabled={isDragDisabled}
          />
        ))}
      </div>
    </DragDropContext>
  )
}

export default TaskBoard
