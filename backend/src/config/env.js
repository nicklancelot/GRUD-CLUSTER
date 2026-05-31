import dotenv from 'dotenv'

dotenv.config()

const directMongoUri = process.env.MONGODB_URI ?? ''
const template = process.env.MONGODB_URI_TEMPLATE ?? ''
const dbPassword = process.env.DB_PASSWORD ?? ''
const templatedMongoUri = template.includes('<db_password>')
  ? template.replace('<db_password>', encodeURIComponent(dbPassword))
  : template

export const env = {
  port: Number(process.env.PORT ?? 5000),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET ?? 'change-this-secret',
  adminEmail: process.env.ADMIN_EMAIL ?? 'admin@corpium.app',
  adminPassword: process.env.ADMIN_PASSWORD ?? 'Admin123!',
  mongodbUri: directMongoUri || templatedMongoUri,
}

if (!env.mongodbUri) {
  throw new Error('MongoDB connection string is missing. Configure MONGODB_URI or MONGODB_URI_TEMPLATE.')
}
