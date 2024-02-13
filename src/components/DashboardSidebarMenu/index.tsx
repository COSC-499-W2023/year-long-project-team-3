import Typography from '@mui/material/Typography'
import { theme } from '@/components/ThemeRegistry/theme'
import DashboardSidePanelOption from '@/components/DashboardSidePanelOption'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import FolderIcon from '@mui/icons-material/Folder'
import Box from '@mui/material/Box'
import React from 'react'
import { SidebarOption } from '@/types/dashboard/sidebar'

export type DashboardMenuSidebarProps = {
    onRecordNewClick: () => void
    onRecentClick?: () => void
    onSubmittedVideosClick?: () => void
    onStarredClick?: () => void
    onTrashClick?: () => void
    sidebarSelectedOption: SidebarOption
    setSidebarSelectedOption: React.Dispatch<React.SetStateAction<SidebarOption>>
}

export default function DashboardSidebarMenu(props: DashboardMenuSidebarProps) {
    const { sidebarSelectedOption } = props

    return (
        <Box display='flex' flexDirection='column' gap='0.5rem'>
            <Typography
                color={theme.palette.text.secondary}
                fontSize={'20px'}
                fontWeight={600}
                data-cy='Side Bar Menu'
            >
                Videos
            </Typography>
            <DashboardSidePanelOption
                title={'Upload New'}
                icon={<PlayCircleFilledIcon fontSize='small' sx={{ color: 'white' }} />}
                onClick={handleRecordNewClick}
                isSelected={sidebarSelectedOption === 'menu_record_new'}
                isDisabled={false}
                isAddButton={true}
            />
            <DashboardSidePanelOption
                title={'My Videos'}
                icon={<FolderIcon fontSize='small'/>}
                onClick={handleMyVideosClick}
                isSelected={sidebarSelectedOption === 'menu_my_videos'}
                isDisabled={false}
                isAddButton={false}
            />
        </Box>
    )

    function handleRecordNewClick() {
        props.setSidebarSelectedOption('menu_record_new')
        props.onRecordNewClick()
    }

    function handleMyVideosClick() {
        if (sidebarSelectedOption !== 'menu_my_videos') {
            props.setSidebarSelectedOption('menu_my_videos')
            if (!!props.onRecentClick) {
                props.onRecentClick()
            }
        }
    }
}
