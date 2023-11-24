import {
    Box,
    Checkbox,
    FormControlLabel,
    FormGroup,
    IconButton,
    Modal,
    Typography,
    Tooltip,
    Button,
    Slider,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ContentCut, Speed, TuneRounded, VolumeOff, VolumeUp } from '@mui/icons-material'
import TimestampInputField from '@/components/TimestampInputField'

export type EditorToolsProps = {
    setIsEditorChanged: React.Dispatch<React.SetStateAction<boolean>>
}

const EditorTools = (props: EditorToolsProps) => {
    const [isMuted, setIsMuted] = useState(false)
    const [isBlurred, setIsBlurred] = useState(false)
    const [isBWVideo, setIsBWVideo] = useState(false)
    const [isOtherOption, setIsOtherOption] = useState(false)
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [playbackRate, setPlaybackRate] = useState(1.0)

    const [startingState, setStartingState] = useState({
        isMuted: false,
        isBlurred: false,
        isBWVideo: false,
        isOtherOption: false,
        startTime: '',
        endTime: '',
        playbackRate: 1.0,
    })

    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isCutOpen, setIsCutOpen] = useState(false)
    const [isPlaybackRateOpen, setIsPlaybackRateOpen] = useState(false)

    const handleMuteClick = () => {
        setIsMuted(!isMuted)
    }

    const handleFilterOpen = () => {
        setIsFilterOpen(true)
    }

    const handleFilterClose = () => {
        setIsFilterOpen(false)
    }

    const handleCutOpen = () => {
        setIsCutOpen(true)
    }

    const handleCutClose = () => {
        setIsCutOpen(false)
    }

    const handlePlaybackRateOpen = () => {
        setIsPlaybackRateOpen(true)
    }

    const handlePlaybackRateClose = () => {
        setIsPlaybackRateOpen(false)
    }

    const handleApplyChangesClick = () => {
        setStartingState({
            isMuted: isMuted,
            isBlurred: isBlurred,
            isBWVideo: isBWVideo,
            isOtherOption: isOtherOption,
            startTime: startTime,
            endTime: endTime,
            playbackRate: playbackRate,
        })

        // TODO: Actually apply changes to video
    }

    const changesMade = () => {
        return !(
            isMuted === startingState.isMuted &&
            isBlurred === startingState.isBlurred &&
            isBWVideo === startingState.isBWVideo &&
            isOtherOption === startingState.isOtherOption &&
            startTime === startingState.startTime &&
            endTime === startingState.endTime &&
            playbackRate === startingState.playbackRate
        )
    }

    useEffect(() => {
        const changeMade = !(
            isMuted === startingState.isMuted &&
            isBlurred === startingState.isBlurred &&
            isBWVideo === startingState.isBWVideo &&
            isOtherOption === startingState.isOtherOption &&
            startTime === startingState.startTime &&
            endTime === startingState.endTime &&
            playbackRate === startingState.playbackRate
        )
        props.setIsEditorChanged(changeMade)
    }, [endTime, isBWVideo, isBlurred, isMuted, isOtherOption, playbackRate, props, startTime, startingState])

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30vw',
        minWidth: '20rem',
        backgroundColor: 'background.default',
        borderRadius: '1rem',
        boxShadow: 24,
        padding: '1rem 2rem',
    }

    const parseSeconds = (timestamp: string) => {
        const parts = timestamp.split(':')
        let seconds = 0
        let multiplier = 1
        for (let i = parts.length - 1; i >= 0; i--) {
            seconds += parseFloat(parts[i]) * multiplier
            multiplier *= 60
        }
        return seconds
    }

    return (
        <>
            <Box
                className='editor-tools'
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <Tooltip title='Mute' placement='right'>
                    <IconButton onClick={handleMuteClick}>{isMuted ? <VolumeUp /> : <VolumeOff />}</IconButton>
                </Tooltip>
                <Tooltip title='Filters' placement='right'>
                    <IconButton
                        onClick={handleFilterOpen}
                        sx={{ backgroundColor: isFilterOpen ? 'primary.lighter' : '' }}
                    >
                        <TuneRounded sx={{ transform: 'rotate(270deg)' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Trim' placement='right'>
                    <IconButton onClick={handleCutOpen} sx={{ backgroundColor: isCutOpen ? 'primary.lighter' : '' }}>
                        <ContentCut sx={{ transform: 'rotate(270deg)' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title='Playback Rate' placement='right'>
                    <IconButton
                        onClick={handlePlaybackRateOpen}
                        sx={{ backgroundColor: isPlaybackRateOpen ? 'primary.lighter' : '' }}
                    >
                        <Speed />
                    </IconButton>
                </Tooltip>
            </Box>
            <Modal open={isFilterOpen} onClose={handleFilterClose}>
                <Box sx={modalStyle}>
                    <Typography
                        component='div'
                        variant='h5'
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        Video Filters
                    </Typography>
                    <FormGroup
                        sx={{
                            margin: '1.5rem 0 0.5rem 0',
                        }}
                    >
                        <FormControlLabel
                            control={<Checkbox size='small' name='blur' checked={isBlurred} />}
                            label='Blur Face'
                            onChange={(_e, checked) => setIsBlurred(checked)}
                        />
                        <FormControlLabel
                            control={<Checkbox size='small' name='bwVideo' checked={isBWVideo} />}
                            label='Black & White Video'
                            onChange={(_e, checked) => setIsBWVideo(checked)}
                        />
                        <FormControlLabel
                            control={<Checkbox size='small' name='other' checked={isOtherOption} />}
                            label='Another option'
                            onChange={(_e, checked) => setIsOtherOption(checked)}
                        />
                    </FormGroup>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <Button onClick={handleFilterClose}>Done</Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={isCutOpen} onClose={handleCutClose}>
                <Box sx={modalStyle}>
                    <Typography
                        component='div'
                        variant='h5'
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        Video Trimming
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '1rem',
                            width: '100%',
                            margin: '1.5rem 0 0.5rem 0',
                        }}
                    >
                        <TimestampInputField
                            label='Start Time'
                            value={startTime}
                            onChange={(value) => setStartTime(value)}
                        />
                        <TimestampInputField label='End Time' value={endTime} onChange={(value) => setEndTime(value)} />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <Typography
                            color='red'
                            sx={{
                                visibility:
                                    startTime === '' ||
                                    endTime === '' ||
                                    parseSeconds(startTime) < parseSeconds(endTime)
                                        ? 'hidden'
                                        : 'inline',
                            }}
                        >
                            Start time must be less than end time
                        </Typography>
                        <Button onClick={handleCutClose}>Done</Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={isPlaybackRateOpen} onClose={handlePlaybackRateClose}>
                <Box sx={modalStyle}>
                    <Typography
                        component='div'
                        variant='h5'
                        sx={{
                            textAlign: 'center',
                        }}
                    >
                        Video playback rate
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            gap: '1rem',
                            width: '100%',
                            margin: '1.5rem 0 0.5rem 0',
                        }}
                    ></Box>
                    <Slider
                        valueLabelDisplay='auto'
                        value={playbackRate}
                        step={0.25}
                        marks={Array.from({ length: 12 }, (_, index) => ({
                            value: 0.25 * (index + 1),
                            label: index % 2 == 1 ? 0.25 * (index + 1) : '',
                        }))}
                        min={0.25}
                        max={3}
                        onChange={(_event, value, _i) => setPlaybackRate(typeof value === 'number' ? value : value[0])}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <Button onClick={handlePlaybackRateClose}>Done</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    )
}

export default EditorTools
