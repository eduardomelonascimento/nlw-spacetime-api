import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

const app = fastify()

const prismaClient = new PrismaClient()

app.listen({ port: 3030 }).then(async () => {
  console.log('kekw')
})

app.get('/', async () => {
  return prismaClient.user.findMany()
})
