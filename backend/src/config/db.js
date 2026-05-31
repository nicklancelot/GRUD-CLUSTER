import mongoose from 'mongoose'

export async function connectDatabase(mongodbUri) {
  await mongoose.connect(mongodbUri, {
    dbName: 'grid_cluster',
  })
}
