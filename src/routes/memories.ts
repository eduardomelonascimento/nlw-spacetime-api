import { FastifyInstance } from 'fastify'
import { prismaClient } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  app.get('/memories', async (request) => {
    const memories = await prismaClient.memory.findMany({
      where: {
        userId: request.user.sub,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return memories.map((memory) => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 150).concat('...'),
      createdAt: memory.createdAt,
    }))
  })

  app.get('/memories/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })
    const { id } = paramsSchema.parse(request.params)
    return prismaClient.memory.findUniqueOrThrow({
      where: {
        id_userId: {
          id,
          userId: request.user.sub,
        },
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
        userId: request.user.sub,
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
      where: {
        id_userId: {
          id,
          userId: request.user.sub,
        },
      },
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
        id_userId: {
          id,
          userId: request.user.sub,
        },
      },
    })
  })
}
