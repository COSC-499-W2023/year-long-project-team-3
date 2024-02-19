import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'

export type VideoCardProps = {
    videoId: string
    title: string
    description: string | null
    thumbnailUrl: string | null
    isSubmitted: boolean
    createdDate: Date
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
            <Box sx={{width: 40}}></Box>
            <CardContent sx={{display: 'flex', justifyContent: 'space-between',  width: '100%'}}>
                <Box>
                    <Typography variant='h5'>{props.title}</Typography>
                    <Typography>{props.description}</Typography>
                </Box>
                <Typography>Uploaded on: {getDateString()}</Typography>
            </CardContent>
        </Card>
    )

    function getDateString() {
        // doing this to fix: https://stackoverflow.com/questions/57007749/date-getdate-is-not-a-function-typescript
        const myDate: Date = new Date(props.createdDate)

        const day = myDate.getDate()
        const year = myDate.getFullYear()
        const month = myDate.toLocaleString('default', { month: 'short' })

        return month + ' ' + day + ', ' + year
    }
    function handleOnClick() {
        router.push(`/video/${ props.videoId }`)
    }
}
