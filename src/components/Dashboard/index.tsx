'use client'

import Box from '@mui/material/Box'
import Logo from '@/components/Logo'
import Typography from '@mui/material/Typography'
import DashboardSidebar from '../DashboardSidebar'
import { SidebarOption } from '@/types/dashboard/sidebar'
import { Dispatch, SetStateAction } from 'react'

export type DashboardProps = {
    userEmail: string
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: Dispatch<SetStateAction<SidebarOption>>
}

export default function Dashboard(props: DashboardProps) {
    return (
        <>
            <DashboardSidebar {...props} />
        </>
    )
}
