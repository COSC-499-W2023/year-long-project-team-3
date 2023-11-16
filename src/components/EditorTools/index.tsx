import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Typography } from '@mui/material'
import React, { FormEventHandler, useRef, useState } from 'react'
import { ContentCut, Speed, TuneRounded, VolumeOff, VolumeUp } from '@mui/icons-material'
import SquareIcon from '@mui/icons-material/Square'

const EditorTools = () => {
    const [state, setState] = useState({
        isMuted: false,
        videoOptions: {
            blurred: false,
            bwVideo: false,
            otherOption: false,
        },
    })
    const [startingState, setStartingState] = useState({ ...state })

    const [menu, setMenu] = useState({
        isFilterOpen: true,
        isCutOpen: false,
        isPlaybackRateOpen: false,
    })

    const handleMuteClick = () => {
        setState((prevState) => ({
            ...prevState,
            isMuted: !prevState.isMuted,
        }))
    }

    const handleFilterClick = () => {
        setMenu({ ...menu, isFilterOpen: true, isCutOpen: false, isPlaybackRateOpen: false })
    }

    const handleCutClick = () => {
        setMenu({ ...menu, isFilterOpen: false, isCutOpen: true, isPlaybackRateOpen: false })
    }

    const handlePlaybackRateClick = () => {
        setMenu({ ...menu, isFilterOpen: false, isCutOpen: false, isPlaybackRateOpen: true })
    }
    const handleApplyChangesClick = () => {
        setStartingState({ ...state })
    }

    const changesMade = () => {
        return startingState.isMuted !== state.isMuted
    }

    const handleFilterChange: FormEventHandler<HTMLDivElement> = (e) => {
        const { name, checked } = e.target
        console.log(name)
        console.log(checked)
        setState({ ...state, videoOptions: { ...state.videoOptions, otherOption: !state.videoOptions.otherOption } })
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexGrow: 1,
                    gap: '0.3rem',
                }}
            >
                <Box
                    className='editor-tool-buttons'
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <IconButton sx={{ visibility: 'hidden' }}>
                        <SquareIcon />
                    </IconButton>
                    <IconButton onClick={handleMuteClick}>{state.isMuted ? <VolumeUp /> : <VolumeOff />}</IconButton>
                    <IconButton
                        onClick={handleFilterClick}
                        sx={{ backgroundColor: menu.isFilterOpen ? 'primary.lighter' : '' }}
                    >
                        <TuneRounded sx={{ transform: 'rotate(270deg)' }} />
                    </IconButton>
                    <IconButton
                        onClick={handleCutClick}
                        sx={{ backgroundColor: menu.isCutOpen ? 'primary.lighter' : '' }}
                    >
                        <ContentCut sx={{ transform: 'rotate(270deg)' }} />
                    </IconButton>
                    <IconButton
                        onClick={handlePlaybackRateClick}
                        sx={{ backgroundColor: menu.isPlaybackRateOpen ? 'primary.lighter' : '' }}
                    >
                        <Speed />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <Typography
                        color='black'
                        variant='h6'
                        component='div'
                        textAlign='center'
                        sx={{ margin: 0, display: 'flex', flexDirection: 'column', justifyContents: 'center' }}
                    >
                        Video Options
                    </Typography>
                    <Box
                        className='editor-options'
                        sx={{
                            flexGrow: 1,
                            backgroundColor: 'primary.lighter',
                            borderRadius: '1rem',
                            padding: '0.5rem 0.8rem',
                            width: '100%',
                        }}
                    >
                        <Box
                            sx={{
                                display: menu.isFilterOpen ? '' : 'none',
                            }}
                        >
                            <FormGroup onChange={handleFilterChange}>
                                <FormControlLabel
                                    control={<Checkbox size='small' checked={state.videoOptions.blurred} />}
                                    label='Blur Face'
                                />
                                <FormControlLabel
                                    control={<Checkbox size='small' checked={state.videoOptions.bwVideo} />}
                                    label='Black & White Video'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size='small'
                                            name='yourmom'
                                            checked={state.videoOptions.otherOption}
                                        />
                                    }
                                    label='Another option'
                                />
                            </FormGroup>
                        </Box>
                        <Box
                            sx={{
                                display: menu.isCutOpen ? '' : 'none',
                            }}
                        >
                            <Typography>Video trimming menu</Typography>
                        </Box>
                        <Box
                            sx={{
                                display: menu.isPlaybackRateOpen ? '' : 'none',
                            }}
                        >
                            <Typography>Video playback rate</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Button variant='outlined' disabled={!changesMade()} onClick={handleApplyChangesClick}>
                Apply Changes
            </Button>
        </Box>
    )
}

export default EditorTools
