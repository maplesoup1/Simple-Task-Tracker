import type { Task } from '../types'

// Color theme configuration for task statuses
export interface StatusTheme {
  // Column colors
  column: {
    container: string
    header: string
    badge: string
  }
  // Card colors
  card: {
    container: string
    badge: string
    accent: string
    delete: string
  }
  // Status badge colors (for detail modal)
  statusBadge: string
}

export const STATUS_THEMES: Record<Task['status'], StatusTheme> = {
  TODO: {
    column: {
      container: 'bg-pink-50 border-pink-200',
      header: 'bg-pink-200 text-pink-800',
      badge: 'bg-pink-500 text-white',
    },
    card: {
      container: 'bg-pink-100 border-pink-300',
      badge: 'bg-pink-200 text-pink-800',
      accent: 'text-pink-600',
      delete: 'text-pink-500 hover:text-pink-700',
    },
    statusBadge: 'bg-pink-100 text-pink-800 border-pink-200',
  },
  INPROGRESS: {
    column: {
      container: 'bg-orange-50 border-orange-200',
      header: 'bg-orange-200 text-orange-800',
      badge: 'bg-orange-500 text-white',
    },
    card: {
      container: 'bg-orange-100 border-orange-300',
      badge: 'bg-orange-200 text-orange-800',
      accent: 'text-orange-600',
      delete: 'text-orange-500 hover:text-orange-700',
    },
    statusBadge: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  DONE: {
    column: {
      container: 'bg-green-50 border-green-200',
      header: 'bg-green-200 text-green-800',
      badge: 'bg-green-500 text-white',
    },
    card: {
      container: 'bg-green-100 border-green-300',
      badge: 'bg-green-200 text-green-800',
      accent: 'text-green-600',
      delete: 'text-green-500 hover:text-green-700',
    },
    statusBadge: 'bg-green-100 text-green-800 border-green-200',
  },
}

// Default theme for unknown status
export const DEFAULT_THEME: StatusTheme = {
  column: {
    container: 'bg-gray-50 border-gray-200',
    header: 'bg-gray-200 text-gray-800',
    badge: 'bg-gray-500 text-white',
  },
  card: {
    container: 'bg-gray-100 border-gray-300',
    badge: 'bg-gray-200 text-gray-800',
    accent: 'text-gray-600',
    delete: 'text-gray-500 hover:text-gray-700',
  },
  statusBadge: 'bg-gray-100 text-gray-800 border-gray-200',
}

// Helper function to get theme for a status
export const getStatusTheme = (status: Task['status']): StatusTheme => {
  return STATUS_THEMES[status] || DEFAULT_THEME
}
