import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(memoriesRoutes)

app.listen({ port: 3030 }).then(async () => {
  console.log('Started')
})
