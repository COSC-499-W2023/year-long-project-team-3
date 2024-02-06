import type { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import NextAuthProvider from '@/app/context/nextAuthProvider'

export const metadata: Metadata = {
    title: 'Harp: A Secure Platform for Anonymous Video Submission',
    description: 'Professional video sharing made easy, with a focus on protecting your privacy',
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
