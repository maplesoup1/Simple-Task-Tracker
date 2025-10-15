import React from 'react'
import { useTasks } from '../../hooks/useTasks'
import { useAuth } from '../../contexts/AuthContext'
import { usePopup } from '../../components/modal/PopupProvider'
import { useTaskSearch } from '../../hooks/useTaskSearch'
import { useModal } from '../../hooks/useModal'
import { useTaskDragDrop } from '../../hooks/useTaskDragDrop'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorDisplay from '../../components/common/ErrorDisplay'
import SearchBar from '../../components/common/SearchBar'
import PageHeader from '../../components/layout/PageHeader'
import TaskBoard from '../../components/task/TaskBoard'
import AddTaskForm from '../../components/task/AddTaskForm'
import TaskDetailModal from '../../components/task/TaskDetailModal'

const TaskPage = () => {
  const { logout } = useAuth()
  const { confirm } = usePopup()

  // Task management
  const {
    tasks,
    loading,
    error,
    addTask,
    deleteTask,
    updateTask,
    moveTask,
    getTasksByStatus,
    getTaskById,
    refetch
  } = useTasks()

  // Search functionality
  const {
    searchQuery,
    setSearchQuery,
    clearSearch,
    isActive: isSearchActive,
    filterTasks
  } = useTaskSearch()

  // Modals
  const addModal = useModal()
  const detailModal = useModal<number>()

  // Drag and drop
  const { handleDragEnd, isDragDisabled } = useTaskDragDrop({
    onTaskMove: moveTask,
    disabled: isSearchActive
  })

  // Handlers
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

  const handleTaskClick = (taskId: number) => {
    detailModal.open(taskId)
  }

  const filterTasksByStatus = (status: Parameters<typeof getTasksByStatus>[0]) => {
    const tasksInStatus = getTasksByStatus(status)
    return filterTasks(tasksInStatus)
  }

  const selectedTask = detailModal.data ? getTaskById(detailModal.data) : null

  // Loading and error states
  if (loading) {
    return <LoadingSpinner message="Loading tasks..." />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Task Board"
          onAddTask={addModal.open}
          onLogout={handleLogout}
        />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={clearSearch}
          placeholder="Search tasks by title or description..."
          showWarning={isSearchActive}
        />

        <TaskBoard
          tasks={tasks}
          onDragEnd={handleDragEnd}
          onTaskDelete={deleteTask}
          onTaskClick={handleTaskClick}
          isDragDisabled={isDragDisabled}
          filterTasksByStatus={filterTasksByStatus}
        />

        <AddTaskForm
          isOpen={addModal.isOpen}
          onAddTask={addTask}
          onClose={addModal.close}
        />

        <TaskDetailModal
          task={selectedTask ?? null}
          isOpen={detailModal.isOpen}
          onClose={detailModal.close}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  )
}

export default TaskPage
