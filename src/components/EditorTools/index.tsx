import { Box, IconButton, Typography } from '@mui/material'
import React, { useState } from 'react'
import { VolumeOff, VolumeUp } from '@mui/icons-material'

const EditorTools = () => {
    const [state, setState] = useState({
        isMuted: false,
    })

    const handleMuteClick = () => {
        setState({ ...state, isMuted: !state.isMuted })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography color='black'>This is a test</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexGrow: 1,
                }}
            >
                <Box className='editor-tool-buttons'>
                    <IconButton onClick={handleMuteClick}>{state.isMuted ? <VolumeUp /> : <VolumeOff />}</IconButton>
                </Box>
                <Box className='editor-options'></Box>
            </Box>
        </Box>
    )
}

export default EditorTools
