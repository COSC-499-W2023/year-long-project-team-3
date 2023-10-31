'use client'

import { Button } from '@mui/material'

export type HomePageButtonProps = {
    text: string
    handleOnClick: () => void
}

export default function LandingPageButton(props: HomePageButtonProps) {
    return (
        <Button
            data-cy='home-page-button'
            variant='contained'
            sx={{ fontSize: 20, borderRadius: 28, textTransform: 'capitalize' }}
            onClick={props.handleOnClick}
        >
            {props.text}
        </Button>
    )
}
