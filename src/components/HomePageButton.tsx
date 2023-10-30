'use client'

import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'

export default function HomePageButton(props: { text: string; route: string }) {
    const router = useRouter()
    return (
        <Button
            variant='contained'
            sx={{ fontSize: 20, borderRadius: 28, textTransform: 'capitalize' }}
            onClick={() => router.push(props.route)}
        >
            {props.text}
        </Button>
    )
}
