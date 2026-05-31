import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function requireAuth(request, response, next) {
  const authorizationHeader = request.headers.authorization ?? ''
  const token = authorizationHeader.startsWith('Bearer ') ? authorizationHeader.slice(7) : null

  if (!token) {
    return response.status(401).json({
      message: 'Authentication required.',
    })
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret)
    request.auth = payload
    return next()
  } catch {
    return response.status(401).json({
      message: 'Invalid or expired token.',
    })
  }
}
