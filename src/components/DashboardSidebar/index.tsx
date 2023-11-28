import Box from '@mui/material/Box'
import DashboardSidebarMenu from '@/components/DashboardSidebarMenu'
import DashboardSidebarSubmissionBoxes from '@/components/DashboardSidebarSubmissionBoxes'
import { useState } from 'react'
import { SidebarOption } from '@/types/dashboard/sidebar'
import { useRouter } from 'next/navigation'

export type DashboardSidePanelProps = {}

export default function DashboardSidePanel(props: DashboardSidePanelProps) {
    const [sidebarSelectedOption, setSidebarSelectedOption] = useState<SidebarOption>('menu_recent')
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
                    router.push('/dashboard/in-box')
                }}
                onSubmissionOutboxClick={() => {
                    router.push('/dashboard/out-box')
                }}
                sidebarSelectedOption={sidebarSelectedOption}
                setSidebarSelectedOption={setSidebarSelectedOption}
            />
        </Box>
    )
}
