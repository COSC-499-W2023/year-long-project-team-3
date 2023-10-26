import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Harp: A Secure Platform for Videos',
    description: 'Generated by create next app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en'>
            <body>
                <ThemeRegistry>{children}</ThemeRegistry>
            </body>
        </html>
    )
}
