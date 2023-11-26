'use client'

import Box from '@mui/material/Box'
import Logo from '@/components/Logo'
import Typography from '@mui/material/Typography'
import DashboardSidebar from '../DashboardSidebar'

export type DashboardProps = {
    userEmail: string
}

export default function Dashboard(props: DashboardProps) {
    return (
        <>
            <Box display='grid' gridTemplateColumns='1fr 4fr' height='100%'>
                <DashboardSidebar />
                <Box>
                    <Box sx={{ marginTop: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Logo fontSize={80} />
                    </Box>
                    <Box
                        sx={{
                            marginTop: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography data-cy='dashboard-message' variant='h4' sx={{ fontWeight: 'medium' }}>
                            Welcome to the dashboard, {props.userEmail}!
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </>
    )
}
