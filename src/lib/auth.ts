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
                    throw new Error('Missing email or password!')
                }
                const existingUser = await prisma.user.findUnique({
                    where: { email: credentials?.email },
                })
                if (!existingUser) {
                    throw new Error('No such user!')
                }
                // TODO: already checked on frontend, check here as well?
                if (!isValidPassword(credentials.password)) {
                    throw new Error('Invalid password!')
                }
                if (!isValidEmail(credentials.email)) {
                    throw new Error('Invalid email!')
                }
                if (!(await passwordMatch(credentials.password, existingUser.password!))) {
                    throw new Error('Wrong password!')
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

function isValidEmail(email: string): boolean {
    const regExp = new RegExp(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)
    return regExp.test(email)
}

function isValidPassword(password: string): boolean {
    const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH && regExp.test(password)
}

async function passwordMatch(enteredPassword: string, password: string) {
    return await compare(enteredPassword, password)
}
