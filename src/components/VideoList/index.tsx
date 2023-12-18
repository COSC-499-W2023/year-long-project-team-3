import VideoCard, { type VideoCardProps } from '@/components/VideoCard'
import { Box } from '@mui/material'

export type VideoListProps = {
    videos: VideoCardProps[]
}

export default function VideoList(props: VideoListProps) {
    return (
        <Box
            display={'grid'}
            gridTemplateColumns={'repeat(auto-fill, minmax(250px, 1fr))'}
            gridTemplateRows={'min-content'}
            justifyContent={'center'}
            justifyItems={'center'}
            rowGap={'55px'}
            columnGap={'.8rem'}
            padding={'0 30px'}
            width={'100%'}
            height={'100%'}
            component={'div'}
            overflow={'scroll'}
        >
            {props.videos.map((video, idx) => (
                <VideoCard key={`video_${ idx }`} {...video} />
            ))}
        </Box>
    )
}
