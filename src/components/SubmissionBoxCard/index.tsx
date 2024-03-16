import { Box, Card, CardContent, Typography } from '@mui/material'
import { theme } from '@/components/ThemeRegistry/theme'
import { useRouter } from 'next/navigation'
import dayjs from 'dayjs'

export type SubmissionBoxCardProps = {
  id: string
  title: string
  isOpen: boolean
  numMembers: number
  numSubmissions: number
  closesAt: Date | null
  isOwned: boolean
  timeSubmitted: Date | null
}

export default function SubmissionBoxCard(props: SubmissionBoxCardProps) {
    const router = useRouter()

    return <Card sx={{ mb: 2, cursor: 'pointer' }} onClick={handleOnClick}>
        <CardContent sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 100,
            pl: '3rem',
        }}>
            <Box sx={{ width: '25%' }}>
                <Typography noWrap variant='h5' color={theme.palette.secondary.main} sx={{ fontWeight: 'bold' }} data-cy={props.title}>
                    {props.title}
                </Typography>
            </Box>
            <Box sx={{ width: '5%' }}/>
            <Box sx={{ width: '20%' }}>
                <Typography color={theme.palette.text.secondary}
                    sx={{ fontWeight: 'bold' }}>{props.isOpen ? 'Open' : 'Closed'}</Typography>
            </Box>
            <Box sx={{ width: '25%' }}>
                <Typography>{props.closesAt ? 'Close' + (props.isOpen ? 's' : 'd') + ' at ' + formatDate(props.closesAt) + ' ' : 'No closing date'}  </Typography>
            </Box>
            <Box sx={{ width: '25%' }}>
                {props.isOwned ?
                    <Typography>{props.numMembers > 0 ? +props.numSubmissions + ' / ' + props.numMembers + ' members have submitted!' : 'You have not invited anyone!'}</Typography> :
                    <Typography>{props.timeSubmitted ? 'Submitted at ' + formatDate(props.timeSubmitted) : 'You have not submitted yet!'}</Typography>
                }
            </Box>
        </CardContent>
    </Card>

    function handleOnClick() {
        router.push(`/submission-box/${ props.id }`)
    }

    function formatDate(date: Date | null) {
        return dayjs(date).format('h:mma [on] MMMM D')
    }
}
