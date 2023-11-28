'use client'

import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '@/components/ThemeRegistry/theme'
import NextAppDirEmotionCacheProvider from './EmotionCache'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </NextAppDirEmotionCacheProvider>
        </LocalizationProvider>
    )
}
