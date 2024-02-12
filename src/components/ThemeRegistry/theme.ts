import { Inter } from 'next/font/google'
import { createTheme, Theme } from '@mui/material/styles'
import { NextFont } from 'next/dist/compiled/@next/font'
import { responsiveFontSizes } from '@mui/material'

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

export const theme: Theme = responsiveFontSizes(createTheme({
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
            main: '#0064c9',
            light: '#cad5e1',
            lighter: '#edf1f5',
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
}))
