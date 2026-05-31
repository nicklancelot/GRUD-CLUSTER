import { Router } from 'express'
import { createUser, deleteUser, getUsers, updateUser } from '../controllers/userController.js'
import { requireAuth } from '../middleware/auth.js'

const userRouter = Router()

userRouter.use(requireAuth)
userRouter.get('/', getUsers)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter
