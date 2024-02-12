import type { Metadata } from 'next'
import ThemeRegistry from '@/components/ThemeRegistry'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import NextAuthProvider from '@/app/context/nextAuthProvider'
import Header from '@/components/Header'
import { Box } from '@mui/material'

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
            <body>
                <ThemeRegistry>
                    <NextAuthProvider session={session}>
                        <Box sx={{ margin: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                            <Header />
                            <Box sx={{ display: 'flex', flexGrow: '1', flexDirection: 'column'}}>{children}</Box>
                        </Box>
                    </NextAuthProvider>
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
