'use client'

import Box from '@mui/material/Box'
import Logo from '@/components/Logo'
import Typography from '@mui/material/Typography'
import DashboardSidebar from '../DashboardSidebar'
import { SidebarOption } from '@/types/dashboard/sidebar'

export type DashboardProps = {
    userEmail: string
    initialSidebarSelectedOption?: SidebarOption
}

export default function Dashboard(props: DashboardProps) {
    return (
        <>
            <Box display='grid' maxWidth={325} height='100%'>
                <DashboardSidebar initialSidebarSelectedOption={props.initialSidebarSelectedOption ?? 'menu_recent'} />
            </Box>
        </>
    )
}
