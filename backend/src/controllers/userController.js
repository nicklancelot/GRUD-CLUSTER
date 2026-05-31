import { User } from '../models/User.js'
import { toUserResponse } from '../utils/formatters.js'

function buildSearchFilter(search) {
  if (!search?.trim()) {
    return {}
  }

  return {
    $or: ['name', 'email', 'role', 'team'].map((field) => ({
      [field]: {
        $regex: search.trim(),
        $options: 'i',
      },
    })),
  }
}

export async function getUsers(request, response) {
  const search = String(request.query.search ?? '')
  const page = Math.max(Number(request.query.page ?? 1), 1)
  const limit = Math.min(Math.max(Number(request.query.limit ?? 5), 1), 100)

  const filter = {
    isAdmin: false,
    ...buildSearchFilter(search),
  }

  const total = await User.countDocuments(filter)
  const totalPages = Math.max(Math.ceil(total / limit), 1)
  const currentPage = Math.min(page, totalPages)
  const skip = (currentPage - 1) * limit

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  return response.json({
    data: users.map(toUserResponse),
    meta: {
      page: currentPage,
      limit,
      total,
      totalPages,
    },
  })
}

export async function createUser(request, response) {
  const { name, email, role, team, status } = request.body ?? {}

  const createdUser = await User.create({
    name,
    email,
    role,
    team,
    status,
    isAdmin: false,
    lastLoginAt: null,
  })

  return response.status(201).json({
    data: toUserResponse(createdUser),
  })
}

export async function updateUser(request, response) {
  const { id } = request.params
  const { name, email, role, team, status } = request.body ?? {}

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: id,
      isAdmin: false,
    },
    {
      name,
      email,
      role,
      team,
      status,
    },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!updatedUser) {
    return response.status(404).json({
      message: 'User not found.',
    })
  }

  return response.json({
    data: toUserResponse(updatedUser),
  })
}

export async function deleteUser(request, response) {
  const { id } = request.params

  const deletedUser = await User.findOneAndDelete({
    _id: id,
    isAdmin: false,
  })

  if (!deletedUser) {
    return response.status(404).json({
      message: 'User not found.',
    })
  }

  return response.json({
    success: true,
  })
}
