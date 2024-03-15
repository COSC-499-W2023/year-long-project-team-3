import { Box, Card, CardContent, Chip, Typography } from '@mui/material'
import { theme } from '@/components/ThemeRegistry/theme'
import { router } from 'next/client'

export type ManageSubmissionBoxCardProps = {
  id: string
  title: string
  isOpen: boolean
  // numMembers: number
  // numSubmissions: number
  closesAt: Date | null
}

export default function ManageSubmissionBoxCard(props: ManageSubmissionBoxCardProps) {
    return <Card sx={{ display: 'flex', width: '100%', height: 200, mb: 2, px: 1, cursor: 'pointer' }} onClick={handleOnClick}>
        <CardContent sx={{ ml: '1rem', display: 'flex', width: '75%', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                    <Typography noWrap variant='h5' color={theme.palette.secondary.main} sx={{ fontWeight: 'bold', width: '70%' }}>{props.title}</Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>

    function handleOnClick() {
        router.push(`/submission-box/${ props.id }`)
    }
}