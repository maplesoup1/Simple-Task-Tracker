// Extract error message from various error formats
export const getErrorMessage = (error: any, defaultMessage: string = 'An error occurred'): string => {
  // Check for axios-style error response
  if (error?.response?.data?.error) {
    return error.response.data.error
  }

  // Check for axios-style error message
  if (error?.response?.data?.message) {
    return error.response.data.message
  }

  // Check for standard error message
  if (error?.message) {
    return error.message
  }

  // Check if error is a string
  if (typeof error === 'string') {
    return error
  }

  return defaultMessage
}

// Error types for better error handling
export const ERROR_MESSAGES = {
  FETCH_TASKS: 'Failed to fetch tasks',
  CREATE_TASK: 'Failed to create task',
  UPDATE_TASK: 'Failed to update task',
  DELETE_TASK: 'Failed to delete task',
  MOVE_TASK: 'Failed to move task',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
} as const

// Log error to console in development
export const logError = (context: string, error: any): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error)
  }
}
