import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import { signOut } from 'next-auth/react'
import logger from '@/utils/logger'

export default function UserAvatar() {
    const [avatarEl, setAvatarEl] = React.useState<HTMLButtonElement | null>(null)
    const handleAvatarClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAvatarEl(e.currentTarget)
    }

    const handleAvatarClose = () => {
        setAvatarEl(null)
    }
    const open = Boolean(avatarEl)
    const id = open ? 'simpe-popover' : undefined

    return (
        <div>
            <Stack direction='row' spacing={1}>
                <Button aria-describedby={id} onClick={handleAvatarClick}>
                    <Avatar></Avatar>
                </Button>
            </Stack>

            <Popover
                id={id}
                open={open}
                anchorEl={avatarEl}
                onClose={handleAvatarClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{ '& .MuiPaper-root': { borderRadius: 0 } }}
            >
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary='Settings' />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemText primary='Sign out' onClick={handleSignOut} data-cy='sign-out-button' />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Popover>
        </div>
    )

    function handleSignOut() {
        signOut().catch((err) => {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        })
    }
}
