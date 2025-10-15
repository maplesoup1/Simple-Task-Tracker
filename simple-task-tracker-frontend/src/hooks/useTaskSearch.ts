import { useState, useMemo, useCallback } from 'react'
import type { Task } from '../types'
import { filterTasksByQuery, isSearchActive } from '../utils/taskFilter'

export const useTaskSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  // Check if search is active
  const isActive = useMemo(() => isSearchActive(searchQuery), [searchQuery])

  // Filter tasks by search query
  const filterTasks = useCallback((tasks: Task[]) => {
    return filterTasksByQuery(tasks, searchQuery)
  }, [searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    isActive,
    filterTasks,
  }
}
