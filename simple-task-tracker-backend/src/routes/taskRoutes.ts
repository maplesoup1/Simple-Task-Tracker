import { Router } from 'express'
import * as taskController from '../controllers/taskController'
import { requireAuth } from '../middlewares/requireAuth'

const router = Router()

// All task routes require authentication
router.use(requireAuth)

// GET /api/tasks/count - must be before /:id routes
router.get('/count', taskController.countTasks)

// GET /api/tasks
router.get('/', taskController.listTasks)

// POST /api/tasks
router.post('/', taskController.createTask)

// PUT /api/tasks/:id
router.put('/:id', taskController.updateTask)

// PATCH /api/tasks/:id/status
router.patch('/:id/status', taskController.changeStatus)

// POST /api/tasks/:id/move
router.post('/:id/move', taskController.moveTask)

// DELETE /api/tasks/:id
router.delete('/:id', taskController.deleteTask)

export default router
