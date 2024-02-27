import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { theme } from '@/components/ThemeRegistry/theme'

export type VideoCardProps = {
    videoId: string
    title: string
    description: string | null
    thumbnailUrl: string | null
    isSubmitted: boolean
    createdDate: Date
    submissionBoxes: string[]
}

export default function VideoCard(props: VideoCardProps) {
    const router = useRouter()

    return (
        <Card sx={{ display: 'flex', width: '100%', height: 200, mb: 2, px: 1, cursor: 'pointer' }} onClick={handleOnClick}>
            {!!props.thumbnailUrl && (
                <Box display={'flex'} alignItems={'center'} maxWidth={300} minWidth={300} paddingLeft={2}>
                    <CardMedia
                        component='img'
                        src={props.thumbnailUrl}
                        alt={props.title}
                        style={{ objectFit: 'cover' }}
                    />
                </Box>
            )}
            <Box sx={{ width: 40 }}></Box>
            <CardContent sx={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                        <Typography noWrap variant='h5' color={theme.palette.secondary.main}
                            sx={{ fontWeight: 'bold', width: '48rem' }}>{props.title}</Typography>
                        <Typography noWrap>Uploaded on: {getDateString()}</Typography>
                    </Box>
                    <Typography sx={{ maxHeight: '4.5rem', overflow: 'hidden' }}>{props.description}</Typography>
                </Box>
                {props.isSubmitted ? <><Box sx={{ display: 'flex', alignItems: 'center' }}><Typography sx={{ mr: 1 }}>Submitted to: </Typography>
                    {props.submissionBoxes.map((submissionBox, idx) => (
                        <Chip
                            sx={{ m: 0.5, ml: 0 }}
                            key={`submission-box-chip-${ idx }`}
                            label={submissionBox}
                        />
                    ))}</Box></> :
                    <Typography color={theme.palette.secondary.main} sx={{ fontWeight: 600 }}>Not Submitted</Typography>}
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
