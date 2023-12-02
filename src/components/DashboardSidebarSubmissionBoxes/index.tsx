import Typography from '@mui/material/Typography'
import { theme } from '@/components/ThemeRegistry/theme'
import DashboardSidePanelOption from '@/components/DashboardSidePanelOption'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import InboxIcon from '@mui/icons-material/Inbox'
import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import React from 'react'
import { SidebarOption } from '@/types/dashboard/sidebar'

export type DashboardSidebarSubmissionBoxesProps = {
    onCreateNewClick: () => void
    onSubmissionInboxClick: () => void
    onSubmissionOutboxClick: () => void
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: React.Dispatch<React.SetStateAction<SidebarOption>>
}

export default function DashboardSidebarSubmissionBoxes(props: DashboardSidebarSubmissionBoxesProps) {
    const { sidebarSelectedOption } = props

    return (
        <Box marginTop='3rem' display='flex' flexDirection='column' gap='0.5rem'>
            <Typography color={theme.palette.text.secondary} fontSize={'25px'} fontWeight={600} marginBottom={'1rem'}>
                Submission Boxes
            </Typography>
            <DashboardSidePanelOption
                title={'Create new'}
                icon={<AddCircleIcon sx={{ color: 'white' }} />}
                onClick={handleCreateNewClick}
                isSelected={sidebarSelectedOption === 'submission_boxes_create_new'}
                isDisabled={false}
                isAddButton={true}
            />
            <DashboardSidePanelOption
                title={'My Boxes'}
                icon={<InboxIcon />}
                onClick={handleSubmissionInboxClick}
                isSelected={sidebarSelectedOption === 'my_submission_boxes'}
                isDisabled={false}
                isAddButton={false}
            />
            <DashboardSidePanelOption
                title={'My Requests'}
                icon={<SendIcon />}
                onClick={handleSubmissionOutboxClick}
                isSelected={sidebarSelectedOption === 'requested_submission_boxes'}
                isDisabled={false}
                isAddButton={false}
            />
        </Box>
    )

    function handleCreateNewClick() {
        props.setSidebarSelectedOption('submission_boxes_create_new')
        props.onCreateNewClick()
    }

    function handleSubmissionInboxClick() {
        props.setSidebarSelectedOption('my_submission_boxes')
        props.onSubmissionInboxClick()
    }

    function handleSubmissionOutboxClick() {
        props.setSidebarSelectedOption('requested_submission_boxes')
        props.onSubmissionOutboxClick()
    }
}
