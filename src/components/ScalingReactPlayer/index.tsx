import ReactPlayer from 'react-player'
import { Box } from '@mui/material'
import React from 'react'

export type ScalingReactPlayerProps = {
    url: string
}

const ScalingReactPlayer = (props: ScalingReactPlayerProps) => {
    return (
        <Box
            className='react-wrapper'
            sx={{
                backgroundColor: 'black',
                height: 0,
                position: 'relative',
                paddingTop: '56.25%',
            }}
        >
            <ReactPlayer
                className='react-player'
                url={props.url}
                controls
                width='100%'
                height='100%'
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}
            />
        </Box>
    )
}

export default ScalingReactPlayer
