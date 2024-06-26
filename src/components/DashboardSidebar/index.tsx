'use client'

import Box from '@mui/material/Box'
import DashboardSidebarMenu from '@/components/DashboardSidebarMenu'
import DashboardSidebarSubmissionBoxes from '@/components/DashboardSidebarSubmissionBoxes'
import { SidebarOption } from '@/types/dashboard/sidebar'
import { useRouter } from 'next/navigation'

export type DashboardSidePanelProps = {
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: (option: SidebarOption) => void
}

export default function DashboardSidePanel(props: DashboardSidePanelProps) {
    const router = useRouter()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                my: 0,
                mx: '2rem',
                pt: '4rem',
                pb: '2rem',
                width: '14rem',
                height: '100%',
            }}
        >
            <DashboardSidebarMenu
                onRecordNewClick={handleOnRecordNewClick}
                sidebarSelectedOption={props.sidebarSelectedOption}
                setSidebarSelectedOption={props.setSidebarSelectedOption}
            />
            <DashboardSidebarSubmissionBoxes
                onCreateNewClick={handleOnCreateNewSubmissionBoxClick}
                sidebarSelectedOption={props.sidebarSelectedOption}
                setSidebarSelectedOption={props.setSidebarSelectedOption}
            />
        </Box>
    )

    function handleOnRecordNewClick() {
        router.push('/video/upload')
    }

    function handleOnCreateNewSubmissionBoxClick() {
        router.push('/submission-box/create')
    }
}
