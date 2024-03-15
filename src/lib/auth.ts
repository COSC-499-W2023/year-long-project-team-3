import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import logger from '@/utils/logger'
import { compare } from 'bcrypt'

const prismaAdapter = PrismaAdapter(prisma)

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
    adapter: {
        ...prismaAdapter,
        createUser: async (user) => {
            // @ts-ignore
            const newUser = await prismaAdapter.createUser(user)

            // Check requested submission and link it to the user
            await prisma.requestedSubmission.updateMany({
                where: {
                    email: {
                        contains: user.email,
                        mode: 'insensitive',
                    },
                },
                data: {
                    userId: newUser.id,
                },
            })

            return newUser
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
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
                const errorMessage: string = 'Unable to login with provided credentials'
                if (!credentials) {
                    throw new Error(errorMessage)
                }
                const existingUsers = await prisma.user.findMany({
                    where: {
                        email: {
                            equals: credentials.email,
                            mode: 'insensitive',
                        },
                    },
                })
                if (!existingUsers || existingUsers.length !== 1 || !existingUsers[0]) {
                    throw new Error(errorMessage)
                }
                const existingUser = existingUsers[0]
                // !existingUser.password is the case for Google logins
                const isCredentialValid =
                    existingUser.password &&
                    (await passwordMatch(credentials.password, existingUser.password!))
                if (!isCredentialValid) {
                    throw new Error(errorMessage)
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
            // Allow relative redirect paths
            if (url.startsWith('/')) {
                return `${ baseUrl }${ url }`
            }
            return url.startsWith(baseUrl) ? Promise.resolve(url) : Promise.resolve(baseUrl)
        },
    },
}

function passwordMatch(enteredPassword: string, password: string): Promise<boolean> {
    return compare(enteredPassword, password)
}
