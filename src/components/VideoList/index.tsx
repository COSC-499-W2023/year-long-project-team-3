import VideoCard, { type VideoCardProps } from '@/components/VideoCard'
import { Box, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export type VideoListProps = {
    videos: VideoCardProps[]
    isSearching: boolean
}

export default function VideoList(props: VideoListProps) {
    const [displayText, setDisplayText] = useState<string>('You Do Not Have Any Videos')

    useEffect(() => {
        if (props.isSearching) {
            setDisplayText('There Are No Videos That Match This Search')
        } else {
            setDisplayText('You Do Not Have Any Videos')
        }
    }, [props.isSearching])

    return !!props.videos && props.videos.length > 0 ? (
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
                { displayText }
            </Typography>
        </Box>
    )
}
