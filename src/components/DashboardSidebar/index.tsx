import Box from '@mui/material/Box'
import DashboardSidebarMenu from '@/components/DashboardSidebarMenu'
import DashboardSidebarSubmissionBoxes from '@/components/DashboardSidebarSubmissionBoxes'
import { useState } from 'react'
import { SidebarOption } from '@/types/dashboard/sidebar'
import { useRouter } from 'next/navigation'

export type DashboardSidePanelProps = {
    initialSidebarSelectedOption: SidebarOption
}

export default function DashboardSidePanel(props: DashboardSidePanelProps) {
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState<SidebarOption>(props.initialSidebarSelectedOption)
    const router = useRouter()

    return (
        <Box display='flex' flexDirection='column' margin={'0 2rem'}>
            <DashboardSidebarMenu
                onRecentClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                onRecordNewClick={() => {}}
                onStarredClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                onSubmittedVideosClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                onTrashClick={() => {
                    router.push('/dashboard/placeholder')
                }}
                sidebarSelectedOption={sidebarSelectedOption}
                setSidebarSelectedOption={setSidebarSelectedOption}
            />
            <DashboardSidebarSubmissionBoxes
                onCreateNewClick={() => {}}
                onSubmissionInboxClick={() => {
                    router.push('/dashboard/inbox')
                }}
                onSubmissionOutboxClick={() => {
                    router.push('/dashboard/outbox')
                }}
                sidebarSelectedOption={sidebarSelectedOption}
                setSidebarSelectedOption={setSidebarSelectedOption}
            />
        </Box>
    )
}
