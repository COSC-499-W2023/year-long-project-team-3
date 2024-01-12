import { Button } from '@mui/material'
import React from 'react'

export type FormNavButtonProps = {
    title: string
    variant: 'contained' | 'outlined' | 'text'
    handleClick: () => void
}

export default function FormNavButton(props: FormNavButtonProps) {
    return (
        <Button
            type='button'
            variant={props.variant}
            sx={{
                mt: 2,
                px: 5,
                fontSize: 15,
                borderRadius: 28,
                textTransform: 'capitalize',
            }}
            data-cy='back'
            onClick={props.handleClick}
        >
            props.title
        </Button>
    )
}
