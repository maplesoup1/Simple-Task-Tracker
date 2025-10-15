import React, { useState } from 'react'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useTasks } from '../../components/useTasks'
import { useAuth } from '../../contexts/AuthContext'
import { usePopup } from '../../components/popupProvider'
import Column from '../../components/column'
import AddTaskForm from '../../components/addTaskForm'
import TaskDetailModal from '../../components/taskDetailModal'
import type { Task } from '../../types'

const TaskPage = () => {
  const { logout } = useAuth()
  const { confirm } = usePopup()
  const {
    tasks,
    loading,
    error,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    getTaskById
  } = useTasks()

  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    moveTask(parseInt(draggableId), destination.droppableId as Task['status'])
  }

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetailModal = () => {
    setSelectedTaskId(null)
    setIsDetailModalOpen(false)
  }

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Log Out',
      message: 'Are you sure you want to log out?',
      confirmLabel: 'Log Out',
      cancelLabel: 'Cancel'
    })

    if (confirmed) {
      await logout()
    }
  }

  // Filter tasks by search query
  const filterTasks = (status: Task['status']) => {
    const tasksInStatus = getTasksByStatus(status)
    if (!searchQuery.trim()) {
      return tasksInStatus
    }
    const lowerQuery = searchQuery.toLowerCase()
    return tasksInStatus.filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      (task.description && task.description.toLowerCase().includes(lowerQuery))
    )
  }

  const isDragDisabled = searchQuery.trim().length > 0

  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : null

  const totalTaskCount = tasks.length

  const columnsConfig: Array<{ title: string; status: Task['status'] }> = [
    { title: 'To Do', status: 'TODO' },
    { title: 'In Progress', status: 'INPROGRESS' },
    { title: 'Done', status: 'DONE' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading tasks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-600 text-xl font-semibold mb-4">Error</div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Task Board</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setIsAddFormOpen(true)}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
            <button
              onClick={handleLogout}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log Out
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {isDragDisabled && (
            <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Drag and drop is disabled while filtering. Clear search to enable.
            </p>
          )}
        </div>

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="flex gap-4">
            {columnsConfig.map(({ title, status }) => (
              <Column
                key={status}
                title={title}
                status={status}
                tasks={filterTasks(status)}
                totalTaskCount={totalTaskCount}
                onDelete={deleteTask}
                onTaskClick={handleTaskClick}
                isDragDisabled={isDragDisabled}
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

export default TaskPage
