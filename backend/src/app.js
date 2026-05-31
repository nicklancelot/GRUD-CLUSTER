import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import authRouter from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'

const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
  })
})

app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
