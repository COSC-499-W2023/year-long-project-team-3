import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent} from '@mui/material'
import {useState} from 'react'

type MinifiedSubmissionBox = {
    id: string
    title: string
}

type SubmissionBoxesSelectorProps = {
    allSubmissionBoxes: MinifiedSubmissionBox[]
    submittedBoxes: MinifiedSubmissionBox[]
}

export default function SubmissionBoxesSelector(props: SubmissionBoxesSelectorProps) {
    const {allSubmissionBoxes, submittedBoxes} = props
    const [selectedBoxes, setSelectedBoxes] = useState<MinifiedSubmissionBox[]>(submittedBoxes)

    const handleChange = (event: SelectChangeEvent<MinifiedSubmissionBox[]>) => {
        const {
            target: { value },
        } = event
        // String case only happens on autofill, which is disabled
        typeof value !== 'string' && setSelectedBoxes(value)
    }

    return (
        <FormControl sx={{ width: '100%', maxWidth: '20rem' }}>
            <InputLabel>Submission Boxes</InputLabel>
            <Select
                multiple
                autoComplete='off'
                value={selectedBoxes}
                onChange={handleChange}
                input={<OutlinedInput label='Submission Boxes' />}
                renderValue={(selected) => (
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 0.5,
                        }}
                    >
                        {selected.map((_box, index, boxes) => (
                            <Chip key={index} label={`${ boxes[index] }`} />
                        ))}
                    </Box>
                )}
                MenuProps={{
                    PaperProps: {
                        style: {
                            borderRadius: '1rem',
                        },
                    },
                }}
            >
                {allSubmissionBoxes.map((box) => (
                    <MenuItem key={box.id} value={box.title}>
                        {box.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
