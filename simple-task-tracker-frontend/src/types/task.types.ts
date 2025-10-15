// Task related types
export interface Task {
  id: number
  title: string
  description?: string
  status: 'TODO' | 'INPROGRESS' | 'DONE'
}

export interface TasksResponse {
  TODO: Task[]
  INPROGRESS: Task[]
  DONE: Task[]
}
