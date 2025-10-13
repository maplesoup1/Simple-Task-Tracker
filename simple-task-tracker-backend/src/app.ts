import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Public routes
app.use('/api/auth', authRoutes)

// Private routes (require authentication)
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default app
