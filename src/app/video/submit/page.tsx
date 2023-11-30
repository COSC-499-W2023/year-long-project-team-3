'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageLoadProgress from '@/components/PageLoadProgress'
import Header from '@/components/Header'
import { Box, Select, Typography, Chip, MenuItem } from '@mui/material'
import ProgressDots from '@/components/ProgressDots'
import { SubmissionBox, Video } from '@prisma/client'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            borderRadius: '0 0 8px 8px',
        },
    },
}
export default function SubmitVideoPage() {
    const session = useSession()
    const { status } = session
    const router = useRouter()

    const [isSubmitVideoPageVisible, setIsSubmitVideoPageVisible] = useState(false)
    const [isUploadingVideo, setIsUploadingVideo] = useState(false)

    // Submission boxes
    const [selectedSubmissionBoxes, setSelectedSubmissionBoxes] = useState<SubmissionBox[]>([])
    const [unSelectedSubmissionBoxes, setUnSelectedSubmissionBoxes] = useState<SubmissionBox[]>([
        {
            id: '123',
            title: 'Lmao lmao',
            createdAt: new Date(),
            description: 'Lmao lmao desc',
            closesAt: new Date(),
            isPublic: true,
            videoStoreToDate: new Date(),
            maxVideoLength: 1000,
        },
        {
            id: '1234',
            title: 'Lmao lmao 123',
            createdAt: new Date(),
            description: 'Lmao lmao desc',
            closesAt: new Date(),
            isPublic: true,
            videoStoreToDate: new Date(),
            maxVideoLength: 1000,
        },
    ])

    useEffect(() => {
        if (status === 'authenticated') {
            setIsSubmitVideoPageVisible(true)
        } else if (status === 'unauthenticated') {
            cleanPageState()
            router.push('/login')
        } else {
            cleanPageState()
        }
    }, [router, status])

    const video: Video = {
        id: '123',
        title: 'Mock Video',
        description: 'This is a mock video',
        thumbnail: 'https://via.placeholder.com/640x360',
        rawVideoUrl: 'https://via.placeholder.com/640x360',
        createdAt: new Date(),
        updatedAt: new Date(),
        processedVideoUrl: 'https://via.placeholder.com/640x360',
        isCloudProcessed: true,
        s3Key: '123',
        ownerId: '123',
    }

    return (
        <>
            <PageLoadProgress show={isUploadingVideo} />
            {isSubmitVideoPageVisible && (
                <>
                    <Header {...session} />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            width: '100%',
                            height: '100%',
                            padding: '2rem',
                        }}
                    >
                        <Box
                            sx={{
                                minWidth: '16rem',
                                width: '70%',
                            }}
                        >
                            <ProgressDots activeStep={2} numSteps={3} labels={['Upload', 'Edit', 'Submit']} />
                        </Box>
                        <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                            <Box display='flex'>
                                <Box width={300} height={200} display='flex' alignItems='start' justifyContent='end'>
                                    <Image
                                        src={video.thumbnail as string}
                                        alt={video.title}
                                        width={0}
                                        height={0}
                                        objectPosition={'100% 0'}
                                        objectFit={'cover'}
                                        style={{
                                            borderRadius: 20,
                                            maxWidth: '21vw',
                                            maxHeight: '14vw',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                </Box>
                                <Box
                                    display='flex'
                                    flexDirection='column'
                                    paddingLeft='2rem'
                                    alignItems='start'
                                    gap='0.5rem'
                                >
                                    <Box>
                                        <TextField
                                            id='video-title'
                                            label='Title'
                                            placeholder='Your video title'
                                            variant='standard'
                                            sx={{
                                                minWidth: '16rem',
                                            }}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                    <Box>
                                        <TextField
                                            id='video-description'
                                            label='Description'
                                            placeholder='Your video description (optional)'
                                            variant='standard'
                                            sx={{
                                                minWidth: '16rem',
                                                // Remove bottom outline
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 0,
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 0,
                                                },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled, .Mui-error):before': {
                                                    borderBottom: 0,
                                                },
                                            }}
                                            multiline
                                            rows={6}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                            <Box
                                display='flex'
                                flexDirection='column'
                                sx={{
                                    '& .MuiInputBase-root.MuiOutlinedInput-root': {
                                        borderRadius: '8px',
                                    },
                                    width: '35vw',
                                }}
                            >
                                <Typography variant='h6' fontWeight='600'>
                                    Choose boxes to submit to:
                                </Typography>
                                <Select
                                    multiple
                                    value={selectedSubmissionBoxes}
                                    sx={{
                                        '& .MuiOutlinedInput-input': {
                                            borderRadius: '8px',
                                        },
                                        width: '100%',
                                    }}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {selected.map(({ id, title }) => (
                                                <Chip
                                                    key={id}
                                                    label={title}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onDelete={() => handleRemoveSelectedSubmissionBoxItem(id)}
                                                    deleteIcon={<HighlightOffIcon />}
                                                    sx={{
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    {unSelectedSubmissionBoxes.map((submissionBox) => (
                                        <MenuItem
                                            key={submissionBox.id}
                                            value={submissionBox.title}
                                            onClick={() => handleClickSubmissionBoxListItem(submissionBox.id)}
                                        >
                                            {submissionBox.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        </Box>
                    </Box>
                </>
            )}
        </>
    )

    function cleanPageState() {
        setIsUploadingVideo(false)
    }

    function handleClickSubmissionBoxListItem(submissionBoxId: string) {
        const submissionBoxIdx = unSelectedSubmissionBoxes.findIndex((sb) => sb.id === submissionBoxId)
        if (submissionBoxIdx >= 0) {
            // Add to selected
            const newSelectedSubmissionBoxes: SubmissionBox[] = [...selectedSubmissionBoxes]
            newSelectedSubmissionBoxes.push(unSelectedSubmissionBoxes[submissionBoxIdx])
            setSelectedSubmissionBoxes(newSelectedSubmissionBoxes)

            // Remove from unselected
            const newUnSelectedSubmissionBoxes: SubmissionBox[] = [...unSelectedSubmissionBoxes]
            newUnSelectedSubmissionBoxes.splice(submissionBoxIdx, 1)
            setUnSelectedSubmissionBoxes(newUnSelectedSubmissionBoxes)
        }
    }

    function handleRemoveSelectedSubmissionBoxItem(submissionBoxId: string) {
        const submissionBoxIdx = selectedSubmissionBoxes.findIndex((sb) => sb.id === submissionBoxId)
        if (submissionBoxIdx >= 0) {
            //  Add back to unselected
            const newSelectedSubmissionBoxes: SubmissionBox[] = [...selectedSubmissionBoxes]
            newSelectedSubmissionBoxes.splice(submissionBoxIdx, 1)
            setSelectedSubmissionBoxes(newSelectedSubmissionBoxes)

            // Remove from selected
            const newUnSelectedSubmissionBoxes: SubmissionBox[] = [...unSelectedSubmissionBoxes]
            newUnSelectedSubmissionBoxes.push(selectedSubmissionBoxes[submissionBoxIdx])
            setUnSelectedSubmissionBoxes(newUnSelectedSubmissionBoxes)
        }
    }
}
