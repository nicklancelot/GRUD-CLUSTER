import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { env } from '../config/env.js'

export async function login(request, response) {
  const { email, password } = request.body ?? {}

  if (!email || !password) {
    return response.status(400).json({
      message: 'Email and password are required.',
    })
  }

  const adminUser = await User.findOne({
    email: String(email).trim().toLowerCase(),
    isAdmin: true,
  })

  if (!adminUser?.passwordHash) {
    return response.status(401).json({
      message: 'Invalid credentials.',
    })
  }

  const isPasswordValid = await bcrypt.compare(password, adminUser.passwordHash)

  if (!isPasswordValid) {
    return response.status(401).json({
      message: 'Invalid credentials.',
    })
  }

  adminUser.lastLoginAt = new Date()
  await adminUser.save()

  const token = jwt.sign(
    {
      sub: adminUser._id.toString(),
      email: adminUser.email,
      role: adminUser.role,
    },
    env.jwtSecret,
    {
      expiresIn: '1d',
    },
  )

  return response.json({
    data: {
      token,
      user: {
        name: adminUser.name,
        email: adminUser.email,
      },
    },
  })
}
