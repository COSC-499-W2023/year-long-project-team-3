import VideoCard, { type VideoCardVideoInfo } from '@/components/VideoCard'
import { Box, Typography } from '@mui/material'

export type VideoListProps = {
    videos: VideoCardVideoInfo[]
    isSearching: boolean
    emptyMessage?: string
    onCardClick?: (videoId: string) => void
    isOwned: boolean
}

export default function VideoList(props: VideoListProps) {
    return !!props.videos && props.videos.length > 0 ? (
        <Box
            justifyContent={'center'}
            justifyItems={'center'}
            rowGap={'55px'}
            padding={'0 30px'}
            width={'100%'}
            height={'100%'}
            component={'div'}
            data-cy='video-list'
            sx = {{
                overflowY: 'scroll',
                overflowX: 'hidden',
            }}
        >
            {props.videos.map((video, idx) => (
                <VideoCard key={`video_${ idx }`} {...video} onClick={props.onCardClick} isOwned={props.isOwned} />
            ))}
        </Box>
    ) : (
        <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
            <Typography
                data-cy='no-video-text'
                variant='h5'
                align='center'
                color={'textSecondary'}
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
