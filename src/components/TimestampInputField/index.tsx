import TextField from '@mui/material/TextField'
import { ChangeEventHandler, useState } from 'react'
import { Theme } from '@mui/material/styles'
import { SxProps } from '@mui/material'
import { validTimestamp } from '@/utils/verification'

export type TimestampInputFieldProps = {
    label: string
    value: string
    onChange: (value: string) => void
    sx?: SxProps<Theme>
}

const TimestampInputField = (props: TimestampInputFieldProps) => {
    const [localValue, setLocalValue] = useState(props.value)
    const [error, setError] = useState(false)

    const handleFieldChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newValue = event.target.value
        if (validTimestamp(newValue)) {
            setError(false)
            props.onChange(newValue)
        } else {
            setError(true)
        }
        setLocalValue(newValue)
    }

    return (
        <TextField
            label={props.label}
            placeholder='mm:ss.ms'
            variant='outlined'
            value={localValue}
            error={error}
            onChange={handleFieldChange}
            sx={props.sx}
        />
    )
}

export default TimestampInputField
