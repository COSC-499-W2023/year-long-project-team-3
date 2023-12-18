'use client'

import Box from '@mui/material/Box'
import DashboardSidebarMenu from '@/components/DashboardSidebarMenu'
import DashboardSidebarSubmissionBoxes from '@/components/DashboardSidebarSubmissionBoxes'
import { Dispatch, SetStateAction } from 'react'
import { SidebarOption } from '@/types/dashboard/sidebar'
import { useRouter } from 'next/navigation'

export type DashboardSidePanelProps = {
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: Dispatch<SetStateAction<SidebarOption>>
}

export default function DashboardSidePanel(props: DashboardSidePanelProps) {
    const router = useRouter()

    return (
        <Box display='flex' flexDirection='column' margin={'0 2rem'} minWidth={200} maxWidth={260} height='100%'>
            <DashboardSidebarMenu
                onRecordNewClick={handleOnRecordNewClick}
                onRecentClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                onStarredClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                onSubmittedVideosClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                onTrashClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                sidebarSelectedOption={props.sidebarSelectedOption}
                setSidebarSelectedOption={props.setSidebarSelectedOption}
            />
            <DashboardSidebarSubmissionBoxes
                onCreateNewClick={() => {
                    router.push('/submission-box/create')
                }}
                onSubmissionInboxClick={() => {
                    router.push('/dashboard/myboxes')
                }}
                onSubmissionOutboxClick={() => {
                    router.push('/dashboard/requestedsubmissions')
                }}
                sidebarSelectedOption={props.sidebarSelectedOption}
                setSidebarSelectedOption={props.setSidebarSelectedOption}
            />
        </Box>
    )

    function handleOnRecordNewClick() {
        router.push('/video/upload')
    }
}
