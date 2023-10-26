import { Alert, Box } from '@mui/material'

const boxCss = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
}

export default function Home() {
    return (
        <Box sx={boxCss}>
            <h1 data-cy='header'>Harp</h1>
            <Alert severity='success'>This is now the home page</Alert>
        </Box>
    )
}
