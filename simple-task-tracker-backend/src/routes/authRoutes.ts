import { Router } from 'express'
import { signupSchema, loginSchema } from '../utils/validation'
import { validate } from '../middlewares/validate'
import { requireAuth } from '../middlewares/requireAuth'
import * as authController from '../controllers/authController'

const router = Router()

router.post('/signup', validate(signupSchema), authController.signup)
router.post('/login', validate(loginSchema), authController.login)
router.post('/logout', authController.logout)
router.post('/sync', requireAuth, authController.syncUser)

export default router
