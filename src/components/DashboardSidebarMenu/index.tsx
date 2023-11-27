import Typography from '@mui/material/Typography'
import { theme } from '@/components/ThemeRegistry/theme'
import DashboardSidePanelOption from '@/components/DashboardSidePanelOption'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import React from 'react'
import { SidebarOption } from '@/types/dashboard/sidebar'

export type DashboardMenuSidebarProps = {
    onRecordNewClick: () => void
    onRecentClick: () => void
    onSubmittedVideosClick: () => void
    onStarredClick: () => void
    onTrashClick: () => void
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: React.Dispatch<React.SetStateAction<SidebarOption>>
}

export default function DashboardSidebarMenu(props: DashboardMenuSidebarProps) {
    const { sidebarSelectedOption } = props

    return (
        <Box marginTop='4rem' display='flex' flexDirection='column'>
            <Typography color={theme.palette.text.secondary} fontSize={'25px'} fontWeight={600} marginBottom={'1rem'}>
                Menu
            </Typography>
            <DashboardSidePanelOption
                title={'Record New'}
                icon={<PlayCircleFilledIcon sx={{ color: 'white' }} />}
                onClick={handleRecordNewClick}
                isSelected={sidebarSelectedOption === 'menu_record_new'}
                isDisabled={false}
                isAddButton={true}
            />
            <DashboardSidePanelOption
                title={'Recent'}
                icon={<AccessTimeIcon />}
                onClick={handleRecentClick}
                isSelected={sidebarSelectedOption === 'menu_recent'}
                isDisabled={false}
                isAddButton={false}
            />
            <DashboardSidePanelOption
                title={'Submitted Videos'}
                icon={<CloudDoneIcon />}
                onClick={handleSubmittedVideosClick}
                isSelected={sidebarSelectedOption === 'menu_submitted_videos'}
                isDisabled={false}
                isAddButton={false}
            />
            <DashboardSidePanelOption
                title={'Starred'}
                icon={<StarBorderIcon />}
                onClick={handleStarredClick}
                isSelected={sidebarSelectedOption === 'menu_starred'}
                isDisabled={false}
                isAddButton={false}
            />
            <DashboardSidePanelOption
                title={'Trash'}
                icon={<DeleteIcon />}
                onClick={handleTrashClick}
                isSelected={sidebarSelectedOption === 'menu_trash'}
                isDisabled={false}
                isAddButton={false}
            />
        </Box>
    )

    function handleRecordNewClick() {
        props.setSidebarSelectedOption('menu_record_new')
        props.onRecordNewClick()
    }

    function handleRecentClick() {
        props.setSidebarSelectedOption('menu_recent')
        props.onRecentClick()
    }

    function handleSubmittedVideosClick() {
        props.setSidebarSelectedOption('menu_submitted_videos')
        props.onSubmittedVideosClick()
    }

    function handleStarredClick() {
        props.setSidebarSelectedOption('menu_starred')
        props.onStarredClick()
    }

    function handleTrashClick() {
        props.setSidebarSelectedOption('menu_trash')
        props.onTrashClick()
    }
}
