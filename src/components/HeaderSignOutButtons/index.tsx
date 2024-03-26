'use client'

import {Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Typography} from '@mui/material'
import {signOut, useSession} from 'next-auth/react'
import logger from '@/utils/logger'
import React, { useMemo, useState } from 'react'
import {Logout} from '@mui/icons-material'
import {theme} from '@/components/ThemeRegistry/theme'

export default function HeaderSignOutButtons() {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null)
    const menuOpen = useMemo(() => {
        return !!anchorElement
    }, [anchorElement])
    const session = useSession()
    const email = session.data?.user?.email

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget)
    }

    return (
        <Box
            sx={{
                mr: '0.5rem',
            }}
        >
            <IconButton onClick={handleClick} data-cy='header-profile'>
                <Avatar>{email?.toUpperCase().charAt(0)}</Avatar>
            </IconButton>
            <Menu
                open={menuOpen}
                anchorEl={anchorElement}
                onClose={() => setAnchorElement(null)}
                sx={{
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiMenu-paper': {
                        borderRadius: '0.75rem',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        maxWidth: '16rem',
                        gap: '0.5rem',
                        px: '16px',
                        py: '6px',
                    }}
                >
                    <Avatar
                        sx={{
                            height: '1.5rem',
                            width: '1.5rem',
                            mr: '4px',
                        }}
                    />
                    <Typography noWrap>{email}</Typography>
                </Box>
                <Divider/>
                <MenuItem
                    onClick={handleSignOut}
                    sx={{
                        color: theme.palette.error.main,
                    }}
                    data-cy='sign-out-button'
                >
                    <ListItemIcon>
                        <Logout fontSize='small' color='error'/>
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            </Menu>
        </Box>
    )

    function handleSignOut() {
        signOut({ callbackUrl: '/login' }).catch((err) => {
            const errMessage = JSON.stringify(err, Object.getOwnPropertyNames(err))
            logger.error(errMessage)
        })
    }
}
