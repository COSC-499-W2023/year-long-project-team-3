import { type NextAuthOptions } from 'next-auth'
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
                if (!credentials) {
                    throw new Error('Invalid credentials!')
                }
                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })
                // !existingUser.password is the case for Google logins
                if (
                    !existingUser ||
                    !existingUser.password ||
                    !(await passwordMatch(credentials.password, existingUser.password!))
                ) {
                    throw new Error('Unable to login with provided credentials')
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
            return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl)
        },
    },
}

async function passwordMatch(enteredPassword: string, password: string) {
    return await compare(enteredPassword, password)
}
