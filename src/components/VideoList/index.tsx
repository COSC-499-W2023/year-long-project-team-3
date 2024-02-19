import VideoCard, { type VideoCardProps } from '@/components/VideoCard'
import { Box, Card, Typography } from '@mui/material'

export type VideoListProps = {
    videos: VideoCardProps[]
    isSearching: boolean
    emptyMessage?: string
}

export default function VideoList(props: VideoListProps) {
    console.log(props.videos)
    return !!props.videos && props.videos.length > 0 ? (
        <Box
            justifyContent={'center'}
            justifyItems={'center'}
            rowGap={'55px'}
            columnGap={'.8rem'}
            padding={'0 30px'}
            width={'100%'}
            height={'100%'}
            component={'div'}
            overflow={'scroll'}
            data-cy='video-list'
        >
            {props.videos.map((video, idx) => (
                <VideoCard key={`video_${ idx }`} {...video} />
            ))}
        </Box>
    ) : (
        <Box display='flex' justifyContent='center' alignItems='center'>
            <Typography
                data-cy='no-video-text'
                variant='h5'
                align='center'
                color={'textSecondary'}
                sx={{ mt: 20 }}
            >
                { props.isSearching
                    ? 'You do not have any videos that match this search'
                    : props.emptyMessage
                        ? props.emptyMessage
                        :'You do not have any videos' }
            </Typography>
        </Box>
    )
}
