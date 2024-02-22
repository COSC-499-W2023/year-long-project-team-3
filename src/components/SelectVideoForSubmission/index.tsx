import {Box, Button, Divider, Modal} from '@mui/material'
import {useEffect, useState} from 'react'
import {theme} from '@/components/ThemeRegistry/theme'
import VideoList from '@/components/VideoList'
import {Video} from '@prisma/client'
import Link from '@mui/material/Link'

export default function SelectVideoForSubmission() {
    const [selectVideoOpen, setSelectVideoOpen] = useState(false)

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70vw',
        height: '50vh',
        backgroundColor: theme.palette.background.default,
        boxShadow: 24,
        borderRadius: '1rem',
        p: 4,
    }

    const [userVideos, setUserVideos] = useState<Video[]>([])
    useEffect(() => {
        fetch('/api/my-videos').then(async (res) => {
            const {videos} = await res.json()
            setUserVideos(videos)
            console.log(videos)
        }).catch((err) => {
            setUserVideos([])
            console.log('error: ' + err)
        })
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
                <Box sx={style}>
                    <VideoList
                        isSearching={false}
                        videos={userVideos.map((video) => {
                            return {
                                title: video.title,
                                videoId: video.id,
                                thumbnailUrl: video.thumbnail,
                            }
                        })}
                    />
                </Box>
            </Modal>
        </Box>
    )
}
