import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '@/lib/constants'
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
        error: '/login',
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
            id: 'credentials',
            name: 'Credentials',
            type: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'johndoe@example.com', required: true },
                password: { label: 'Password', type: 'password', required: true },
            },
            async authorize(credentials, _) {
                if (!credentials?.email || !credentials?.password) {
                    // TODO: Handle error better
                    return null
                }
                if (!isValidPassword(credentials.password)) {
                    // TODO: Handle error better
                    return null
                }

                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                })
                if (!existingUser) {
                    // TODO: Handle error better
                    return null
                }

                // May not have password if logging in with Google
                if (existingUser?.password) {
                    // Check if entered password matches password in database
                    const passwordMatch = await compare(credentials.password, existingUser.password)
                    if (!passwordMatch) {
                        return null
                    }
                }

                if (existingUser) {
                    // Any object returned will be saved in `user` property of the JWT
                    return {
                        id: existingUser.id,
                        email: existingUser.email,
                    } as any
                }

                // If you return null then an error will be displayed advising the user to check their details.
                return null

                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
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

function isValidPassword(password: string): boolean {
    const regExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*[a-zA-Z\d@$!%*?&])$/)
    return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH && regExp.test(password)
}