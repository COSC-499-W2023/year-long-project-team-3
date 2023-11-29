'use client'

import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy'
import { MutableRefObject } from 'react'

export interface VideoPlayerProps extends ReactPlayerProps {
    playerref: MutableRefObject<ReactPlayer>
}

const VideoPlayer = (props: VideoPlayerProps) => {
    return <ReactPlayer ref={props.playerref} {...props} />
}

export default VideoPlayer
