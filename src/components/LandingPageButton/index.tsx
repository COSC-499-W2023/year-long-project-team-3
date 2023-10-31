'use client'

import { Button } from '@mui/material'

export type LandingPageButtonProps = {
    text: string
    handleOnClick: () => void
}

export default function LandingPageButton(props: LandingPageButtonProps) {
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
