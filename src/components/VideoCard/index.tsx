import { Box, Card, CardContent, CardMedia, Chip, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { theme } from '@/components/ThemeRegistry/theme'
import dayjs from 'dayjs'

export type VideoCardVideoInfo = {
  videoId: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  isSubmitted: boolean
  createdDate: Date
  submissionBoxes: string[]
  userEmail?: string
  dateSubmitted?: Date
}

export type VideoCardProps = {
  isOwned: boolean
  onClick?: (videoId: string) => void
}

export default function VideoCard(props: VideoCardVideoInfo & VideoCardProps) {
    const router = useRouter()

    return (
        <Card sx={{ display: 'flex', height: 200, mb: 2, cursor: 'pointer' }} onClick={handleOnClick}>
            <Box display={'flex'} alignItems={'center'} width={'25%'} pl='1rem'>
                {!!props.thumbnailUrl ? (
                    <CardMedia
                        component='img'
                        src={props.thumbnailUrl}
                        alt={props.title}
                        style={{ objectFit: 'cover' }}
                        height={'80%'}
                        sx={{ borderRadius: '20px' }}
                    />) : (<Box width='100%' height='80%' sx={{ backgroundColor: 'black', borderRadius: '20px' }} />)
                }
            </Box>
            <CardContent
                sx={{ ml: '1rem', display: 'flex', width: '75%', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                        <Typography noWrap variant='h5' color={theme.palette.secondary.main} sx={{ fontWeight: 'bold' }}>{props.title}</Typography>

                        {/* If not owned and submitted (i.e. when viewing submissions to your submission box) display the
                         date submitted, else (when viewing you own videos, display the date uploaded if the upload has
                         finished */}
                        {!props.isOwned && props.isSubmitted ? (
                            <Typography>
                                { props.dateSubmitted ? 'Submitted on: ' +  getDateString(props.dateSubmitted): '' }
                            </Typography>
                        ) : (
                            <Typography noWrap>
                                {!!props.thumbnailUrl ? 'Uploaded on: ' + getDateString(props.createdDate) : 'Upload in progress'}
                            </Typography>)}

                    </Box>
                    <Typography sx={{
                        maxHeight: '3rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                    }}>{props.description}</Typography>
                </Box>

                {/*If owned, display what boxes submitted to if submitted else display who submitted and when */}
                {props.isOwned ?
                    (props.isSubmitted ?
                        (<>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                width: '75%',
                            }}>
                                <Typography sx={{ mr: 1 }}>Submitted to: </Typography>
                                {props.submissionBoxes.map((submissionBox, idx) => (
                                    <Chip
                                        sx={{ m: 0.5, ml: 0 }}
                                        key={`submission-box-chip-${ idx }`}
                                        label={submissionBox}
                                    />
                                ))}
                            </Box>
                        </>) :
                        (<Typography color={theme.palette.secondary.main} sx={{ fontWeight: 600 }}>Not Submitted</Typography>)
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center'}} >
                            <Typography sx={{ mr: 1 }}>Submitted by: </Typography>
                            <Chip sx={{ m: 0.5, ml: 0 }} label={props.userEmail} />
                        </Box>
                    )
                }
            </CardContent>
        </Card>
    )

    function getDateString(date: Date) {
        // doing this to fix: https://stackoverflow.com/questions/57007749/date-getdate-is-not-a-function-typescript
        const myDate: Date = new Date(date)
        return myDate && dayjs(myDate).format('MMM D, YYYY')
    }

    function handleOnClick() {
        if (props.onClick) {
            props.onClick(props.videoId)
        } else {
            router.push(`/video/${ props.videoId }`)
        }
    }
}
