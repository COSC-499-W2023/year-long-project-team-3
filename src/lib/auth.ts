import {getServerSession, type NextAuthOptions} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {User} from "@prisma/client";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            type: "credentials",
            credentials: {
                email: {label: "Email", type: "text", placeholder: "johndoe@example.com"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
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
}

export function getSession() {
    return getServerSession(authOptions) as Promise<{
        user: {
            id: string;
            name: string;
            username: string;
            email: string;
            image: string;
        };
    } | null>;
}
