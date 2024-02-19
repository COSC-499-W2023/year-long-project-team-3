import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export type VideoCardProps = {
    videoId: string
    title: string
    description: string | null
    thumbnailUrl: string | null
}

export default function VideoCard(props: VideoCardProps) {
    const router = useRouter()

    return (
        <Card sx={{ display: 'flex', width: '100%', height: 200, mb: 2 }}>
            {!!props.thumbnailUrl && (
                <Box display={'flex'} alignItems={'center'} maxWidth={300} paddingLeft={2}>
                    <CardMedia
                        component='img'
                        src={props.thumbnailUrl}
                        alt={props.title}
                        style={{ objectFit: 'cover' }}
                    />
                </Box>
            )}
            <CardContent>
                <Typography variant='h5'>{props.title}</Typography>
                <Typography>{props.description}</Typography>
            </CardContent>
        </Card>
    )


    function handleOnClick() {
        router.push(`/video/${ props.videoId }`)
    }
}
