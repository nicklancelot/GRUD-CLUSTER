import { connectDatabase } from '../config/db.js'
import { env } from '../config/env.js'
import { seedDatabase } from '../utils/seedUsers.js'

async function runSeed() {
  await connectDatabase(env.mongodbUri)
  await seedDatabase({
    adminEmail: env.adminEmail,
    adminPassword: env.adminPassword,
  })

  console.log('Seed completed.')
  process.exit(0)
}

runSeed().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})
