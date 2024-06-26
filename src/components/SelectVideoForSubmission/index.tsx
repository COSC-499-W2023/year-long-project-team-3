import {
    Box,
    Button, CardMedia, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Modal,
    Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import {theme} from '@/components/ThemeRegistry/theme'
import VideoList from '@/components/VideoList'
import {Video} from '@prisma/client'
import Link from '@mui/material/Link'
import { VideoSubmission } from '@/app/api/my-videos/route'
import { toast } from 'react-toastify'
import PageLoadProgress from '@/components/PageLoadProgress'
import CloseIcon from '@mui/icons-material/Close'

type SelectVideoForSubmissionProps = {
    submissionBoxId: string
    onVideoSelect: (video: (Video & VideoSubmission)) => void
}

export default function SelectVideoForSubmission(props: SelectVideoForSubmissionProps) {
    const [selectVideoOpen, setSelectVideoOpen] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [userVideos, setUserVideos] = useState<(Video & VideoSubmission)[]>([])
    const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
    const [proposedSubmission, setProposedSubmission] = useState<(Video & VideoSubmission) | null>(null)

    useEffect(() => {
        setIsFetching(true)
        fetchAllVideos()
            .then((videos: (Video & VideoSubmission)[]) => setUserVideos(videos))
            .catch((error) => toast.error(error))
            .finally(() => setIsFetching(false))
    }, [])

    return (
        <Box
            data-cy='select-video-for-submission'
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                width: '100%',
                p: '1rem',
            }}
        >
            <Link href={'/video/upload'}>
                <Button variant='contained' data-cy='upload-new-submission'>Upload New Video</Button>
            </Link>
            <Divider
                sx={{
                    width: '70%',
                    minWidth: '10rem',
                    maxWidth: '25rem',
                }}
            >
                OR
            </Divider>
            <Button variant='contained' data-cy='submit-existing' onClick={() => setSelectVideoOpen(true)}>Choose Existing Video</Button>
            <Modal
                open={selectVideoOpen}
                onClose={() => setSelectVideoOpen(false)}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                    position: 'absolute' as 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70vw',
                    height: '80vh',
                    backgroundColor: theme.palette.background.default,
                    boxShadow: 24,
                    borderRadius: '1rem',
                    pb: 4,
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                        }}
                    >
                        <Typography
                            variant='h4'
                            sx={{
                                pl: 4,
                                pt: 4,
                                fontWeight: 500,
                                color: 'text.secondary',
                            }}
                        >Select a video to submit</Typography>
                        <IconButton onClick={() => setSelectVideoOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            flexGrow: 1,
                            maxHeight: 'calc(100% - 4.5rem)',
                        }}
                    >
                        {isFetching ? <PageLoadProgress/> : (
                            <VideoList
                                isSearching={false}
                                videos={userVideos.map((video) => {
                                    return {
                                        title: video.title,
                                        videoId: video.id,
                                        thumbnailUrl: video.thumbnail,
                                        description: video.description,
                                        isSubmitted: video.isSubmitted,
                                        createdDate: video.createdAt,
                                        submissionBoxes: video.submissions.map(submission => submission.requestedSubmission.submissionBox.title),
                                    }
                                })}
                                onCardClick={handleCardClick}
                                isOwned={true}
                            />
                        )}
                    </Box>
                </Box>
            </Modal>
            <Dialog
                open={submitDialogOpen}
                onClose={() => setSubmitDialogOpen(false)}
            >
                <DialogTitle>Are you sure you want to submit the video {'"'}{proposedSubmission?.title}{'"'}?</DialogTitle>
                {proposedSubmission && !!proposedSubmission.thumbnail && (
                    <DialogContent>
                        <CardMedia
                            component='img'
                            src={proposedSubmission.thumbnail}
                            alt={proposedSubmission.title}
                            style={{ objectFit: 'cover' }}
                        />
                    </DialogContent>
                )}
                <DialogActions
                    sx={{
                        p: 2,
                    }}
                >
                    <Button onClick={
                        () => {
                            setSubmitDialogOpen(false)
                            setProposedSubmission(null)
                        }
                    }>No</Button>
                    <Button
                        onClick={confirmedSubmission}
                        variant='contained'
                        autoFocus
                    >Yes</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )

    function handleCardClick(videoId: string) {
        // Close select modal
        setSelectVideoOpen(false)

        // Set proposed submission
        const video = userVideos.filter((video) => video.id === videoId)
        if (video.length !== 1) {
            toast.error('An error occurred submitting the video')
            return
        }
        setProposedSubmission(video[0])

        // Open submit confirmation dialog
        setSubmitDialogOpen(true)
    }

    function confirmedSubmission() {
        setSubmitDialogOpen(false)
        if (proposedSubmission) {
            fetch('/api/video/submit', {
                method: 'POST',
                body: JSON.stringify({
                    videoId: proposedSubmission.id,
                    submissionBoxIds: [props.submissionBoxId],
                }),
            }).then(async (res) => {
                if (res.ok) {
                    toast.success('Video submitted successfully')
                } else {
                    toast.error('An error occurred submitting the video')
                }
            }).catch(() => {
                toast.error('An error occurred submitting the video')
            })

            // Notify parent
            props.onVideoSelect(proposedSubmission)
        }
        setProposedSubmission(null)
    }
}

async function fetchAllVideos(): Promise<(Video & VideoSubmission)[]> {
    const response = await fetch('/api/my-videos')
    const data = await response.json()
    return data.videoSubmission
}
