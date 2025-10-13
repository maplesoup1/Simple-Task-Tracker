import React, { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { Task as TaskType } from '../../components/types'
import { useTasks } from '../../components/useTasks'
import Column from '../../components/column'
import AddTaskForm from '../../components/addTaskForm'
import TaskDetailModal from '../../components/taskDetailModal'

const Task = () => {
  const {
    tasks,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    getTaskById
  } = useTasks([])

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    moveTask(parseInt(draggableId), destination.droppableId as TaskType['status'])
  }

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setSelectedTaskId(null)
    setIsDetailModalOpen(false)
  }

  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : null

  const totalTaskCount = tasks.length

  const columnsConfig: Array<{ title: string; status: TaskType['status'] }> = [
    { title: 'To Do', status: 'TODO' },
    { title: 'In Progress', status: 'INPROGRESS' },
    { title: 'Done', status: 'DONE' }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Task Board</h1>
          <button
            onClick={() => setIsAddFormOpen(true)}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="flex gap-4">
            {columnsConfig.map(({ title, status }) => (
              <Column
                key={status}
                title={title}
                status={status}
                tasks={getTasksByStatus(status)}
                totalTaskCount={totalTaskCount}
                onDelete={deleteTask}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>
        </DragDropContext>

        <AddTaskForm
          isOpen={isAddFormOpen}
          onAddTask={addTask}
          onClose={() => setIsAddFormOpen(false)}
        />

        <TaskDetailModal
          task={selectedTask ?? null}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  )
}

export default Task
