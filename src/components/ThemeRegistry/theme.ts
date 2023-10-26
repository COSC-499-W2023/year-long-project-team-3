import { Inter } from 'next/font/google'
import { createTheme, Theme } from '@mui/material/styles'
import { NextFont } from 'next/dist/compiled/@next/font'

const inter: NextFont = Inter({ subsets: ['latin'] })

export const theme: Theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#007DFC',
        },
        secondary: {
            main: '#f50057',
        },
    },
    typography: {
        fontFamily: inter.style.fontFamily,
    },
})
