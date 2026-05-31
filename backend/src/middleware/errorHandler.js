import mongoose from 'mongoose'

export function notFoundHandler(_request, response) {
  return response.status(404).json({
    message: 'Route not found.',
  })
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof mongoose.Error.ValidationError) {
    return response.status(400).json({
      message: 'Validation failed.',
      errors: Object.values(error.errors).map((item) => item.message),
    })
  }

  if (error?.code === 11000) {
    return response.status(409).json({
      message: 'A user with this email already exists.',
    })
  }

  console.error(error)

  return response.status(500).json({
    message: 'Internal server error.',
  })
}
