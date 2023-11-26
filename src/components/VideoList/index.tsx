import VideoCard, { type VideoCardProps } from '@/components/VideoCard'
import { Box } from '@mui/material'
import { VideoPageType } from '@/types/videos/videoPage'

export type VideoListProps = {
    videos: VideoCardProps[]
    videoPageType: VideoPageType
}

export default function VideoList(props: VideoListProps) {
    return (
        <Box
            display={'grid'}
            gridTemplateColumns={'repeat(auto-fill, minmax(250px, 1fr))'}
            rowGap={'55px'}
            columnGap={'60px'}
            padding={'0 30px'}
            width={'100%'}
            height={'100%'}
            maxWidth={'1280px'}
            component={props.videoPageType === 'received' ? 'section' : 'div'}
            overflow={'scroll'}
        >
            {props.videos.map((video, idx) => (
                <VideoCard key={`${ props.videoPageType }_video_${ idx }`} {...video} />
            ))}
        </Box>
    )
}
