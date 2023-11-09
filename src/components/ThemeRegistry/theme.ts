import { Inter } from 'next/font/google'
import { createTheme, Theme } from '@mui/material/styles'
import { NextFont } from 'next/dist/compiled/@next/font'

const inter: NextFont = Inter({ subsets: ['latin'] })

export const theme: Theme = createTheme({
    palette: {
        background: {
            default: '#FDFCF2',
        },
        mode: 'light',
        primary: {
            main: '#212FAB',
        },
        secondary: {
            main: '#CDADFF',
        },
    },
    typography: {
        fontFamily: inter.style.fontFamily,
    },
})
