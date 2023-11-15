import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('../VideoPlayer'), { ssr: false })
import { Box } from '@mui/material'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import screenfull from 'screenfull'

export type ScalingReactPlayerProps = {
    url: string
}

const ScalingReactPlayer = (props: ScalingReactPlayerProps) => {
    const [state, setState] = useState({
        isPlaying: false,
        isMuted: false,
        volume: 1.0,
        playbackRate: 1.0,
    })
    const playerRef = useRef() as MutableRefObject<ReactPlayer>

    const updateSize = () => {
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

    useEffect(() => {
        const keyboardControl = (evt: KeyboardEvent) => {
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
                setState({ ...state, isPlaying: !state.isPlaying })
            } else if (code === 'KeyM') {
                setState({ ...state, isMuted: !state.isMuted })
            } else if (code === 'ArrowUp') {
                setState({ ...state, volume: Math.min(1, state.volume + 0.05) })
            } else if (code === 'ArrowDown') {
                setState({ ...state, volume: Math.max(0, state.volume - 0.05) })
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
                setState({ ...state, playbackRate: Math.min(3, state.playbackRate + 0.25) })
            } else if (code === 'Comma' && evt.shiftKey) {
                setState({ ...state, playbackRate: Math.max(0.25, state.playbackRate - 0.25) })
            }
        }

        // Initial size update
        updateSize()

        // Add event listeners
        window.addEventListener('keydown', keyboardControl)
        window.addEventListener('resize', updateSize)

        // Cleanup the listeners on component unmount
        return () => {
            window.removeEventListener('keydown', keyboardControl)
            window.removeEventListener('resize', updateSize)
        }
    }, [state, playerRef])

    return (
        <Box
            className='react-wrapper'
            sx={{
                position: 'absolute',
                backgroundColor: 'black',
            }}
        >
            <VideoPlayer
                playerref={playerRef}
                className='react-player'
                url={props.url}
                playing={state.isPlaying}
                muted={state.isMuted}
                volume={state.volume}
                playbackRate={state.playbackRate}
                controls
                width='100%'
                height='100%'
            />
        </Box>
    )
}

export default ScalingReactPlayer
