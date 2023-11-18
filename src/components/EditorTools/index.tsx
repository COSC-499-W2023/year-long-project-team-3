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
} from '@mui/material'
import React, { useState } from 'react'
import { ContentCut, Speed, TuneRounded, VolumeOff, VolumeUp } from '@mui/icons-material'

export type EditorToolsProps = {
    handleHaveChangesBeenMade: (haveChangesBeenMade: boolean) => void
}

const EditorTools = (props: EditorToolsProps) => {
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

    props.handleHaveChangesBeenMade(changesMade())

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40vw',
        minWidth: '20rem',
        backgroundColor: 'background.default',
        borderRadius: '1rem',
        boxShadow: 24,
        padding: '1rem 2rem',
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
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'row',*/}
                {/*        gap: '0.3rem',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    /!*Put invisible button to match spacing of buttons below the title*!/*/}
                {/*    <IconButton sx={{ visibility: 'hidden' }}>*/}
                {/*        <SquareIcon />*/}
                {/*    </IconButton>*/}
                {/*    <Typography*/}
                {/*        color='black'*/}
                {/*        variant='h6'*/}
                {/*        component='div'*/}
                {/*        textAlign='center'*/}
                {/*        sx={{*/}
                {/*            margin: 0,*/}
                {/*            flexGrow: 1,*/}
                {/*            display: 'flex',*/}
                {/*            flexDirection: 'column',*/}
                {/*            justifyContents: 'center',*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        Video Options*/}
                {/*    </Typography>*/}
                {/*</Box>*/}
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'row',*/}
                {/*        flexGrow: 1,*/}
                {/*        gap: '0.3rem',*/}
                {/*    }}*/}
                {/*>*/}
                {/*<Box*/}
                {/*    className='editor-tool-buttons'*/}
                {/*    sx={{*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'column',*/}
                {/*    }}*/}
                {/*>*/}
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
                {/*</Box>*/}
                {/*<Box*/}
                {/*    sx={{*/}
                {/*        flexGrow: 1,*/}
                {/*        display: 'flex',*/}
                {/*        flexDirection: 'column',*/}
                {/*        alignItems: 'center',*/}
                {/*        gap: '0.5rem',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Box*/}
                {/*        className='editor-options'*/}
                {/*        sx={{*/}
                {/*            flexGrow: 1,*/}
                {/*            backgroundColor: 'primary.lighter',*/}
                {/*            borderRadius: '1rem',*/}
                {/*            padding: '0.5rem 0.8rem',*/}
                {/*            width: '100%',*/}
                {/*        }}*/}
                {/*    ></Box>*/}
                {/*</Box>*/}
                {/*</Box>*/}
                {/*<Button variant='outlined' disabled={!changesMade()} onClick={handleApplyChangesClick}>*/}
                {/*    Apply Changes*/}
                {/*</Button>*/}
            </Box>
            <Modal open={isFilterOpen} onClose={handleFilterClose}>
                <Box sx={modalStyle}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox size='small' name='blur' checked={isBlurred} />}
                            label='Blur Face'
                            onChange={(e, checked) => setIsBlurred(checked)}
                        />
                        <FormControlLabel
                            control={<Checkbox size='small' name='bwVideo' checked={isBWVideo} />}
                            label='Black & White Video'
                            onChange={(e, checked) => setIsBWVideo(checked)}
                        />
                        <FormControlLabel
                            control={<Checkbox size='small' name='other' checked={isOtherOption} />}
                            label='Another option'
                            onChange={(e, checked) => setIsOtherOption(checked)}
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
                    <Typography>Video trimming menu</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            width: '100%',
                        }}
                    >
                        <Button onClick={handleCutClose}>Done</Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={isPlaybackRateOpen} onClose={handlePlaybackRateClose}>
                <Box sx={modalStyle}>
                    <Typography>Video playback rate</Typography>
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
