import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Typography } from '@mui/material'
import React, { ChangeEvent, FormEventHandler, useState } from 'react'
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
        function deepEqual(obj1: any, obj2: any): boolean {
            if (obj1 === obj2) {
                return true
            }

            if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
                return false
            }

            const keys1 = Object.keys(obj1)
            const keys2 = Object.keys(obj2)

            if (keys1.length !== keys2.length) {
                return false
            }

            for (const key of keys1) {
                if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
                    return false
                }
            }

            return true
        }

        return !deepEqual(startingState, state)
    }

    const handleFilterChange: FormEventHandler<HTMLDivElement> = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target
        const newState = {
            ...state,
            videoOptions: { ...state.videoOptions },
        }

        if (name === 'blur') {
            newState.videoOptions.blurred = checked
        } else if (name === 'bwVideo') {
            newState.videoOptions.bwVideo = checked
        } else if (name === 'other') {
            newState.videoOptions.otherOption = checked
        }

        setState(newState)
    }

    return (
        <Box
            className='editor-tools'
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
                    gap: '0.3rem',
                }}
            >
                {/*Put invisible button to match spacing of buttons below the title*/}
                <IconButton sx={{ visibility: 'hidden' }}>
                    <SquareIcon />
                </IconButton>
                <Typography
                    color='black'
                    variant='h6'
                    component='div'
                    textAlign='center'
                    sx={{ margin: 0, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContents: 'center' }}
                >
                    Video Options
                </Typography>
            </Box>
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
                                    control={<Checkbox size='small' name='blur' checked={state.videoOptions.blurred} />}
                                    label='Blur Face'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox size='small' name='bwVideo' checked={state.videoOptions.bwVideo} />
                                    }
                                    label='Black & White Video'
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox size='small' name='other' checked={state.videoOptions.otherOption} />
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
