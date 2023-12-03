import { Inter } from 'next/font/google'
import { createTheme, Theme } from '@mui/material/styles'
import { NextFont } from 'next/dist/compiled/@next/font'

const inter: NextFont = Inter({ subsets: ['latin'] })

declare module '@mui/material/styles' {
    interface PaletteColor {
        lighter?: string
        darker?: string
    }

    interface SimplePaletteColorOptions {
        lighter?: string
        darker?: string
    }
}

export const theme: Theme = createTheme({
    palette: {
        background: {
            default: 'white',
        },
        mode: 'light',
        primary: {
            darker: '#004690',
            dark: '#0068d7',
            main: '#007DFC',
            light: '#3c9fff',
            lighter: '#7dc3ff',
        },
        secondary: {
            main: '#f50057',
            lighter: '#cad5e1',
        },
        text: {
            primary: '#000000',
            secondary: '#6B6C7E',
        },
    },
    typography: {
        fontFamily: inter.style.fontFamily,
        button: {
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 32,
    },
})
