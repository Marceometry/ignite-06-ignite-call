import { Adapter } from 'next-auth/adapters'
import { NextApiRequest, NextApiResponse } from 'next'
import { destroyCookie, parseCookies } from 'nookies'
import { prisma } from '../prisma'

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })
      if (!userIdOnCookies) {
        throw new Error('User ID not found on cookies')
      }

      const prismaUser = await prisma.user.update({
        where: { id: userIdOnCookies },
        data: { name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      })

      destroyCookie({ res }, '@ignitecall:userId', { path: '/' })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email || '',
        avatarUrl: prismaUser.avatarUrl || '',
        username: prismaUser.username,
        emailVerified: null,
      }
    },
    async getUser(id) {
      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
        username: user.username,
        emailVerified: null,
      }
    },
    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) return null

      return {
        id: user.id,
        name: user.name,
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
        username: user.username,
        emailVerified: null,
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          providerId_providerAccountId: {
            providerId: provider,
            providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })
      if (!account) return null
      const { user } = account

      return {
        id: user.id,
        name: user.name,
        email: user.email || '',
        avatarUrl: user.avatarUrl || '',
        username: user.username,
        emailVerified: null,
      }
    },
    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: { id: user.id },
        data: { name: user.name, email: user.email, avatarUrl: user.avatarUrl },
      })
      return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email || '',
        avatarUrl: prismaUser.avatarUrl || '',
        username: prismaUser.username,
        emailVerified: null,
      }
    },
    async linkAccount(account) {
      await prisma.account.create({
        data: {
          id: account.id_token,
          userId: account.userId,
          providerAccountId: account.providerAccountId,
          providerId: account.providerAccountId,
          providerType: account.provider,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at
            ? new Date(account.expires_at)
            : new Date(),
        },
      })
    },
    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: { userId, expires, sessionToken, accessToken: sessionToken },
      })
      return { userId, expires, sessionToken }
    },
    async getSessionAndUser(sessionToken) {
      const session = await prisma.session.findUniqueOrThrow({
        where: {
          sessionToken,
        },
        include: {
          user: true,
        },
      })
      if (!session) return null
      const { user } = session

      return {
        session: {
          userId: session.userId,
          sessionToken: session.sessionToken,
          expires: session.expires,
        },
        user: {
          id: user.id,
          name: user.name,
          email: user.email || '',
          avatarUrl: user.avatarUrl || '',
          username: user.username,
          emailVerified: null,
        },
      }
    },
    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: { sessionToken },
        data: { userId, expires },
      })
      return {
        userId: prismaSession.userId,
        expires: prismaSession.expires,
        sessionToken: prismaSession.sessionToken,
      }
    },
  }
}
