import Typography from '@mui/material/Typography'
import { theme } from '@/components/ThemeRegistry/theme'
import DashboardSidePanelOption from '@/components/DashboardSidePanelOption'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import { SidebarOption } from '@/types/dashboard/sidebar'
import { Badge } from '@mui/material'
import { toast } from 'react-toastify'

export type DashboardSidebarSubmissionBoxesProps = {
    onCreateNewClick: () => void
    onSubmissionInboxClick?: () => void
    onSubmissionOutboxClick?: () => void
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: (option: SidebarOption) => void
}

export default function DashboardSidebarSubmissionBoxes(props: DashboardSidebarSubmissionBoxesProps) {
    const { sidebarSelectedOption } = props
    const [count, setCount] = useState()
    useEffect(() => {
        fetch('/api/submission-box/requestedsubmissions/require-submission')
            .then(async (res) => {
                const { requiredCount } = await res.json()
                setCount(requiredCount)
            })
            .catch(() => {
                toast.error('An error occurred trying to access requested submission count')
            })
    })

    return (
        <>
            <Box marginTop='2rem' display='flex' flexDirection='column' gap='0.5rem'>
                <Typography color={theme.palette.text.secondary} fontSize={'20px'} fontWeight={600}>
                Submission Boxes
                </Typography>
                <DashboardSidePanelOption
                    title={'Create New'}
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
                <Badge
                    badgeContent={count}
                    color='error'
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    style={{ transform: 'translate(-25px, 25px)'}}
                    max={99}
                    data-cy='requested-badge'
                />
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
