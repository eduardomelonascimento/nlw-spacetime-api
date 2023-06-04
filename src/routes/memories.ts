import { FastifyInstance } from 'fastify'
import { prismaClient } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.get('/memories', async () => {
    const memories = await prismaClient.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })
    return memories.map((memory) => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 150).concat('...'),
    }))
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)
    return prismaClient.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })
  })

  app.post('/memories', async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, isPublic, coverUrl } = bodySchema.parse(request.body)
    await prismaClient.memory.create({
      data: {
        content,
        isPublic,
        coverUrl,
        userId: '82ad1473-9f17-41f9-ab15-802b4f3b949a',
      },
    })
  })

  app.put('/memories', async (request) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })
    const { id, coverUrl, content, isPublic } = bodySchema.parse(request.body)
    return prismaClient.memory.update({
      where: { id },
      data: {
        content,
        coverUrl,
        isPublic,
      },
    })
  })

  app.delete('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)
    await prismaClient.memory.delete({
      where: {
        id,
      },
    })
  })
}
