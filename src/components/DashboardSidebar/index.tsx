'use client'

import Box from '@mui/material/Box'
import DashboardSidebarMenu from '@/components/DashboardSidebarMenu'
import DashboardSidebarSubmissionBoxes from '@/components/DashboardSidebarSubmissionBoxes'
import { useState } from 'react'
import { SidebarOption } from '@/types/dashboard/sidebar'
import { useRouter } from 'next/navigation'

export type DashboardSidePanelProps = {}

export default function DashboardSidePanel(props: DashboardSidePanelProps) {
    const router = useRouter()
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState<SidebarOption>('menu_recent')

    return (
        <Box display='flex' flexDirection='column' margin={'0 2rem'}>
            <DashboardSidebarMenu
                onRecordNewClick={handleOnRecordNewClick}
                onRecentClick={() => {}}
                onStarredClick={() => {}}
                onSubmittedVideosClick={() => {}}
                onTrashClick={() => {}}
                sidebarSelectedOption={sidebarSelectedOption}
                setSidebarSelectedOption={setSidebarSelectedOption}
            />
            <DashboardSidebarSubmissionBoxes
                onCreateNewClick={() => {}}
                onSubmissionInboxClick={() => {}}
                onSubmissionOutboxClick={() => {}}
                sidebarSelectedOption={sidebarSelectedOption}
                setSidebarSelectedOption={setSidebarSelectedOption}
            />
        </Box>
    )

    function handleOnRecordNewClick() {
        router.push('/video/upload')
    }
}
