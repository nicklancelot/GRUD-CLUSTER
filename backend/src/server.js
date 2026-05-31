import dns from 'dns'

dns.setServers(['8.8.8.8', '1.1.1.1'])

import app from './app.js'
import { connectDatabase } from './config/db.js'
import { env } from './config/env.js'
import { seedDatabase } from './utils/seedUsers.js'

async function startServer() {
  await connectDatabase(env.mongodbUri)

  await seedDatabase({
    adminEmail: env.adminEmail,
    adminPassword: env.adminPassword,
  })

  app.listen(env.port, () => {
    console.log(`Backend API running on http://localhost:${env.port}`)
  })
}

startServer().catch((error) => {
  console.error('Unable to start server:', error)
  process.exit(1)
})