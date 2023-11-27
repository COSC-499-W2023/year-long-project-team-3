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
            <Box display='grid' gridTemplateColumns='1fr' height='100%'>
                <DashboardSidebar />
            </Box>
        </>
    )
}
