import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeRegistry from '@/components/ThemeRegistry'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import NextAuthProvider from '@/app/context/nextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Harp: A Secure Platform for Anonymous Video Submission',
    description: 'Generated by create next app',
    icons: {
        // icon can be found in public folder
        icon: 'icon.ico',
    },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)

    return (
        <html lang='en'>
            <body style={{ overflow: 'hidden' }}>
                <ThemeRegistry>
                    <NextAuthProvider session={session}>{children}</NextAuthProvider>
                </ThemeRegistry>
                <ToastContainer
                    position='top-right'
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme='light'
                />
            </body>
        </html>
    )
}
