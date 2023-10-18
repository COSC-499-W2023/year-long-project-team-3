import Button from '@mui/material/Button'
import Container from '@mui/material/Container'

export default function LogOut() {
    return (
        <Container component='main' maxWidth='xs'>
            <Button variant='contained' sx={{ position: 'fixed', top: 0, right: 0 }}>
                Log Out
            </Button>
        </Container>
    )
}
