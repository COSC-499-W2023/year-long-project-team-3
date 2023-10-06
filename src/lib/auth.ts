import {type NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {User} from "@prisma/client";
import prisma from "@/lib/prisma";
import {MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH} from "@/lib/constants";
import {PrismaAdapter} from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET as string,
    pages: {
        signIn: "/signin",
        error: '/signin'
    },
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile(profile) {
                return {
                    id: profile.sub,
                    email: profile.email,
                    emailVerified: true, // Don't need to verify emails since we're using Google
                }
            },
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            type: "credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "johndoe@example.com", required: true},
                password: {label: "Password", type: "password", required: true,},
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

                const user: User = await (prisma.user.findUniqueOrThrow({
                    where: {
                        email: credentials?.email
                    }
                })).catch(() => {
                    // TODO: Handle error better
                    throw new Error("User not found")
                });

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return {
                        id: user.id,
                        email: user.email,
                    } as any
                }

                // If you return null then an error will be displayed advising the user to check their details.
                return null

                // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
            }
        }),
    ],
    callbacks: {
        jwt: async ({token, user}) => {
            if (user) {
                token.user = user;
            }
            return token;
        },
    }
}

function isValidPassword(password: string): boolean {
    const regExp = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])(?=.*[a-zA-Z\d@$!%*?&])$/);
    return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH && regExp.test(password);
}
