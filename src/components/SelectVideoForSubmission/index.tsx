import {Box, Button, Divider, Modal} from '@mui/material'
import { useEffect, useState } from 'react'
import {theme} from '@/components/ThemeRegistry/theme'
import VideoList from '@/components/VideoList'
import {Video} from '@prisma/client'
import Link from '@mui/material/Link'
import { VideoSubmission } from '@/app/api/my-videos/route'
import { toast } from 'react-toastify'
import PageLoadProgress from '@/components/PageLoadProgress'

export default function SelectVideoForSubmission() {
    const [selectVideoOpen, setSelectVideoOpen] = useState(false)
    const [isFetching, setIsFetching] = useState(false)
    const [userVideos, setUserVideos] = useState<(Video & VideoSubmission)[]>([])

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw',
        height: '80vh',
        backgroundColor: theme.palette.background.default,
        boxShadow: 24,
        borderRadius: '1rem',
        p: 4,
    }

    useEffect(() => {
        setIsFetching(true)
        fetchAllVideos()
            .then((videos: (Video & VideoSubmission)[]) => setUserVideos(videos))
            .catch((error) => toast.error(error))
            .finally(() => setIsFetching(false))
    }, [])

    return (
        <Box
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
                <Button variant='contained'>Upload new video</Button>
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
            <Button variant='contained' onClick={() => setSelectVideoOpen(true)}>Choose existing video</Button>
            <Modal
                open={selectVideoOpen}
                onClose={() => setSelectVideoOpen(false)}
            >
                <Box sx={modalStyle}>
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
                        />
                    )}
                </Box>
            </Modal>
        </Box>
    )
}

async function fetchAllVideos(): Promise<(Video & VideoSubmission)[]> {
    const response = await fetch('/api/my-videos')
    const data = await response.json()

    // Map video submission objects to extract necessary properties
    return data.videoSubmission.map((submittedVideo: { title: string; id: string; thumbnail: string | null; description: string | null; isSubmitted: boolean; createdAt: Date; submissions: any }) => ({
        title: submittedVideo.title,
        id: submittedVideo.id,
        thumbnail: submittedVideo.thumbnail,
        description: submittedVideo.description,
        isSubmitted: submittedVideo.isSubmitted,
        createdAt: submittedVideo.createdAt,
        submissions: submittedVideo.submissions,
    }))
}
