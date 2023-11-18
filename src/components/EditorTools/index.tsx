import { Box, Button, Checkbox, FormControlLabel, FormGroup, IconButton, Typography } from '@mui/material'
import React, { ChangeEvent, FormEventHandler, useState } from 'react'
import { ContentCut, Speed, TuneRounded, VolumeOff, VolumeUp } from '@mui/icons-material'
import SquareIcon from '@mui/icons-material/Square'

const EditorTools = () => {
    const [isMuted, setIsMuted] = useState(false)
    const [isBlurred, setIsBlurred] = useState(false)
    const [isBWVideo, setIsBWVideo] = useState(false)
    const [isOtherOption, setIsOtherOption] = useState(false)

    const [startingState, setStartingState] = useState({
        isMuted: false,
        isBlurred: false,
        isBWVideo: false,
        isOtherOption: false,
    })

    const [isFilterOpen, setIsFilterOpen] = useState(true)
    const [isCutOpen, setIsCutOpen] = useState(false)
    const [isPlaybackRateOpen, setIsPlaybackRateOpen] = useState(false)

    const handleMuteClick = () => {
        setIsMuted(!isMuted)
    }

    const handleFilterClick = () => {
        setIsFilterOpen(true)
        setIsCutOpen(false)
        setIsPlaybackRateOpen(false)
    }

    const handleCutClick = () => {
        setIsFilterOpen(false)
        setIsCutOpen(true)
        setIsPlaybackRateOpen(false)
    }

    const handlePlaybackRateClick = () => {
        setIsFilterOpen(false)
        setIsCutOpen(false)
        setIsPlaybackRateOpen(true)
    }
    const handleApplyChangesClick = () => {
        setStartingState({
            isMuted: isMuted,
            isBlurred: isBlurred,
            isBWVideo: isBWVideo,
            isOtherOption: isOtherOption,
        })

        // TODO: Actually apply changes to video
    }

    const changesMade = () => {
        return !(
            isMuted === startingState.isMuted &&
            isBlurred === startingState.isBlurred &&
            isBWVideo === startingState.isBWVideo &&
            isOtherOption === startingState.isOtherOption
        )
    }

    const handleFilterChange: FormEventHandler<HTMLDivElement> = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target

        if (name === 'blur') {
            setIsBlurred(checked)
        } else if (name === 'bwVideo') {
            setIsBWVideo(checked)
        } else if (name === 'other') {
            setIsOtherOption(checked)
        }
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
                    <IconButton onClick={handleMuteClick}>{isMuted ? <VolumeUp /> : <VolumeOff />}</IconButton>
                    <IconButton
                        onClick={handleFilterClick}
                        sx={{ backgroundColor: isFilterOpen ? 'primary.lighter' : '' }}
                    >
                        <TuneRounded sx={{ transform: 'rotate(270deg)' }} />
                    </IconButton>
                    <IconButton onClick={handleCutClick} sx={{ backgroundColor: isCutOpen ? 'primary.lighter' : '' }}>
                        <ContentCut sx={{ transform: 'rotate(270deg)' }} />
                    </IconButton>
                    <IconButton
                        onClick={handlePlaybackRateClick}
                        sx={{ backgroundColor: isPlaybackRateOpen ? 'primary.lighter' : '' }}
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
                                display: isFilterOpen ? 'block' : 'none',
                            }}
                        >
                            <FormGroup onChange={handleFilterChange}>
                                <FormControlLabel
                                    control={<Checkbox size='small' name='blur' checked={isBlurred} />}
                                    label='Blur Face'
                                />
                                <FormControlLabel
                                    control={<Checkbox size='small' name='bwVideo' checked={isBWVideo} />}
                                    label='Black & White Video'
                                />
                                <FormControlLabel
                                    control={<Checkbox size='small' name='other' checked={isOtherOption} />}
                                    label='Another option'
                                />
                            </FormGroup>
                        </Box>
                        <Box
                            sx={{
                                display: isCutOpen ? 'block' : 'none',
                            }}
                        >
                            <Typography>Video trimming menu</Typography>
                        </Box>
                        <Box
                            sx={{
                                display: isPlaybackRateOpen ? 'block' : 'none',
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
