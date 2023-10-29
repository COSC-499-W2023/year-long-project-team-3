import { type NextAuthOptions, type User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import logger from '@/utils/logger'
import { compare } from 'bcrypt'

export const authOptions: NextAuthOptions = {
    logger: {
        debug: (msg, metadata) => {
            const child = logger.child({ 'metadata:': metadata })
            child.debug(msg)
        },
        warn: (msg) => {
            logger.warn(msg)
        },
        error: (msg, metadata) => {
            const child = logger.child({ ...metadata })
            child.error(msg)
        },
    },
    secret: process.env.nextAuthSecret,
    pages: {
        signIn: '/login',
    },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.googleClientId as string,
            clientSecret: process.env.googleClientSecret as string,
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                }
            },
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'john@mail.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    logger.error('Missing email or password!')
                    // TODO: Handle error better
                    return null
                }
                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                })
                if (!existingUser) {
                    logger.error('No such user!')
                    // TODO: Handle error better
                    return null
                }
                const passwordMatch = await compare(credentials.password, existingUser.password!)
                if (!passwordMatch) {
                    logger.error('Incorrect password!')
                    // TODO: Handle error better
                    return null
                }
                return {
                    id: existingUser.id,
                    email: existingUser.email,
                }
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            logger.info('jwt callback' + JSON.stringify(token) + JSON.stringify(user))
            if (user) {
                token.user = user
            }
            return token
        },
        redirect: async ({ url, baseUrl }) => {
            logger.info('redirect callback: ' + url + ' -> ' + baseUrl)
            return baseUrl
        },
    },
}
