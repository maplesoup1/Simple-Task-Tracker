import { Router } from 'express'
import * as userController from '../controllers/userController'
import { requireAuth } from '../middlewares/requireAuth'

const router = Router()

// All user routes require authentication
router.use(requireAuth)

// GET /api/users/me
router.get('/me', userController.getUser)

// PUT /api/users/me
router.put('/me', userController.updateUser)

// DELETE /api/users/me
router.delete('/me', userController.deleteUser)

export default router
