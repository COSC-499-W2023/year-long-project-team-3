import Typography from '@mui/material/Typography'
import { theme } from '@/components/ThemeRegistry/theme'
import DashboardSidePanelOption from '@/components/DashboardSidePanelOption'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { SidebarOption } from '@/types/dashboard/sidebar'

export type DashboardSidebarSubmissionBoxesProps = {
    onCreateNewClick: () => void
    onSubmissionInboxClick?: () => void
    onSubmissionOutboxClick?: () => void
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: React.Dispatch<React.SetStateAction<SidebarOption>>
}

export default function DashboardSidebarSubmissionBoxes(props: DashboardSidebarSubmissionBoxesProps) {
    const { sidebarSelectedOption } = props

    return (
        <>
            <Box marginTop='2rem' display='flex' flexDirection='column' gap='0.5rem'>
                <Typography color={theme.palette.text.secondary} fontSize={'20px'} fontWeight={600}>
                Submission Boxes
                </Typography>
                <DashboardSidePanelOption
                    title={'Create new'}
                    icon={<AddCircleIcon fontSize='small' sx={{ color: 'white' }} />}
                    onClick={handleCreateNewClick}
                    isSelected={sidebarSelectedOption === 'submission_boxes_create_new'}
                    isDisabled={false}
                    isAddButton={true}
                />
                <DashboardSidePanelOption
                    title={'Manage Boxes'}
                    icon={<EditIcon fontSize='small'/>}
                    onClick={handleManageBoxesClick}
                    isSelected={sidebarSelectedOption === 'submission_boxes_manage_boxes'}
                    isDisabled={false}
                    isAddButton={false}
                    data-cy='My Boxes'
                />
            </Box>
            <Box marginTop='2rem' display='flex' flexDirection='column' gap='0.5rem'>
                <Typography noWrap color={theme.palette.text.secondary} fontSize={'20px'} fontWeight={600} >
                Submission Invitations
                </Typography>
                <DashboardSidePanelOption
                    title={'My Invitations'}
                    icon={<SendIcon fontSize='small'/>}
                    onClick={handleMyInvitationsClick}
                    isSelected={sidebarSelectedOption === 'submission_boxes_my_invitations'}
                    isDisabled={false}
                    isAddButton={false}
                    data-cy='My Requests'
                />
            </Box>
        </>
    )

    function handleCreateNewClick() {
        props.setSidebarSelectedOption('submission_boxes_create_new')
        props.onCreateNewClick()
    }

    function handleManageBoxesClick() {
        props.setSidebarSelectedOption('submission_boxes_manage_boxes')
        if (!!props.onSubmissionInboxClick) {
            props.onSubmissionInboxClick()
        }
    }

    function handleMyInvitationsClick() {
        props.setSidebarSelectedOption('submission_boxes_my_invitations')
        if (!!props.onSubmissionOutboxClick) {
            props.onSubmissionOutboxClick()
        }
    }
}
