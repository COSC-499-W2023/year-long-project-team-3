import { AppBar, Toolbar, Typography } from '@mui/material'
import { Box } from '@mui/system'

export default function Home() {
    return (
    // <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
            <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
            Test
            </Typography>
        </AppBar>
    // </Box>
    )
}
