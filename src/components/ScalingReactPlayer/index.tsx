import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('../VideoPlayer'), { ssr: false })
import { Box } from '@mui/material'
import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import screenfull from 'screenfull'

export type ScalingReactPlayerProps = {
    url: string
    allowKeyDown?: boolean
}

const ScalingReactPlayer = (props: ScalingReactPlayerProps) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(1.0)
    const [playbackRate, setPlaybackRate] = useState(1.0)

    const playerRef = useRef() as MutableRefObject<ReactPlayer>

    const rescalePlayer = () => {
        const rw = document.querySelector('.react-wrapper')

        if (rw && rw instanceof HTMLElement && rw.parentNode && rw.parentNode instanceof HTMLElement) {
            const parentElement = rw.parentNode
            const parentWidth = parentElement.offsetWidth
            const parentHeight = parentElement.offsetHeight

            if ((parentHeight * 16) / 9 <= parentWidth) {
                rw.style.width = (parentHeight * 16) / 9 + 'px'
                rw.style.height = parentHeight + 'px'
            } else {
                rw.style.width = parentWidth + 'px'
                rw.style.height = (parentWidth * 9) / 16 + 'px'
            }
        }
    }

    const keyboardControl = useCallback(
        (evt: KeyboardEvent) => {
            /*
            Toggle play/pause the video	k or Spacebar
            Go back 5 seconds	Left arrow
            Go back 10 seconds	j
            Go forward 5 seconds	Right arrow
            Go forward 10 seconds	l
            Restart video	Home
            Bring video to the end	End
            Go to Full Screen mode	f
            Exit Full Screen mode	Escape
            Increase volume 5%	Up arrow
            Decrease volume 5%	Down arrow
            Increase speed	Shift + >
            Decrease speed	Shift + <
             */
            const code = evt.code
            if (code === 'KeyK' || code === 'Space') {
                setIsPlaying(!isPlaying)
            } else if (code === 'KeyM') {
                setIsMuted(!isMuted)
            } else if (code === 'ArrowUp') {
                setVolume(Math.min(1, volume + 0.05))
            } else if (code === 'ArrowDown') {
                setVolume(Math.max(0, volume - 0.05))
            } else if (code === 'ArrowRight') {
                playerRef.current &&
                    playerRef.current.seekTo(
                        Math.min(playerRef.current.getDuration(), playerRef.current.getCurrentTime() + 5)
                    )
            } else if (code === 'ArrowLeft') {
                playerRef.current && playerRef.current.seekTo(Math.max(0, playerRef.current.getCurrentTime() - 5))
            } else if (code === 'KeyF') {
                screenfull.exit().then(() => {})
                const player = document.querySelector('.react-player > video')
                player && screenfull.request(player)
            } else if (code === 'KeyL') {
                playerRef.current &&
                    playerRef.current.seekTo(
                        Math.min(playerRef.current.getDuration(), playerRef.current.getCurrentTime() + 10)
                    )
            } else if (code === 'KeyJ') {
                playerRef.current && playerRef.current.seekTo(Math.max(0, playerRef.current.getCurrentTime() - 10))
            } else if (code === 'Home') {
                playerRef.current && playerRef.current.seekTo(0)
            } else if (code === 'End') {
                playerRef.current && playerRef.current.seekTo(playerRef.current.getDuration())
            } else if (code === 'Period' && evt.shiftKey) {
                setPlaybackRate(Math.min(3, playbackRate + 0.25))
            } else if (code === 'Comma' && evt.shiftKey) {
                setPlaybackRate(Math.max(0.25, playbackRate - 0.25))
            }
        },
        [isMuted, isPlaying, playbackRate, volume]
    )

    useEffect(() => {
        // Initial size update
        rescalePlayer()

        // Add event listeners
        if (!!props.allowKeyDown || props.allowKeyDown === undefined) {
            window.addEventListener('keydown', keyboardControl)
        }
        window.addEventListener('resize', rescalePlayer)

        // Cleanup the listeners on component unmount
        return () => {
            window.removeEventListener('keydown', keyboardControl)
            window.removeEventListener('resize', rescalePlayer)
        }
    }, [keyboardControl, props.allowKeyDown])

    return (
        <Box
            className='react-wrapper'
            sx={{
                position: 'absolute',
                backgroundColor: 'black',
            }}
        >
            <VideoPlayer
                data-cy='video-player'
                playerref={playerRef}
                className='react-player'
                url={props.url}
                playing={isPlaying}
                muted={isMuted}
                volume={volume}
                playbackRate={playbackRate}
                controls
                width='100%'
                height='100%'
            />
        </Box>
    )
}

export default ScalingReactPlayer
