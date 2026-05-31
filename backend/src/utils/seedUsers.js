import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'

const seededUsers = [
  {
    name: 'Sophie Martin',
    email: 'sophie.martin@corpium.app',
    role: 'Product Manager',
    team: 'Produit',
    status: 'active',
    lastLoginAt: new Date('2026-05-18T09:24:00Z'),
  },
  {
    name: 'Karim Diallo',
    email: 'karim.diallo@corpium.app',
    role: 'Frontend Lead',
    team: 'Engineering',
    status: 'active',
    lastLoginAt: new Date('2026-05-18T08:12:00Z'),
  },
  {
    name: 'Nina Roche',
    email: 'nina.roche@corpium.app',
    role: 'Support Manager',
    team: 'Support',
    status: 'inactive',
    lastLoginAt: new Date('2026-05-17T18:40:00Z'),
  },
  {
    name: 'Alex Mensah',
    email: 'alex.mensah@corpium.app',
    role: 'Data Analyst',
    team: 'Insights',
    status: 'active',
    lastLoginAt: new Date('2026-05-17T14:55:00Z'),
  },
  {
    name: 'Jade Bernard',
    email: 'jade.bernard@corpium.app',
    role: 'HR Specialist',
    team: 'People Ops',
    status: 'inactive',
    lastLoginAt: new Date('2026-05-11T16:08:00Z'),
  },
  {
    name: 'Mickael Ndao',
    email: 'mickael.ndao@corpium.app',
    role: 'Backend Engineer',
    team: 'Engineering',
    status: 'active',
    lastLoginAt: new Date('2026-05-18T07:47:00Z'),
  },
]

export async function seedDatabase({ adminEmail, adminPassword }) {
  const existingUsers = await User.countDocuments()

  if (existingUsers > 0) {
    return
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10)

  await User.insertMany([
    ...seededUsers,
    {
      name: 'Admin Corpium',
      email: adminEmail.toLowerCase(),
      role: 'Super Administrateur',
      team: 'Administration',
      status: 'active',
      isAdmin: true,
      passwordHash: adminPasswordHash,
      lastLoginAt: null,
    },
  ])
}
