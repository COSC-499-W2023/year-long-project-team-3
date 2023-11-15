import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })
import { Box } from '@mui/material'
import React, { useEffect } from 'react'

export type ScalingReactPlayerProps = {
    url: string
}

const ScalingReactPlayer = (props: ScalingReactPlayerProps) => {
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
        // Initial size update
        updateSize()

        // Add event listener for viewport resize
        window.addEventListener('resize', updateSize)

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', updateSize)
        }
    }, [])

    return (
        <Box
            className='react-wrapper'
            sx={{
                position: 'absolute',
                backgroundColor: 'black',
            }}
        >
            <ReactPlayer className='react-player' url={props.url} controls width='100%' height='100%' />
        </Box>
    )
}

export default ScalingReactPlayer
