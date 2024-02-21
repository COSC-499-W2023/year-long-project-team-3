import {Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent} from '@mui/material'
import {useState} from 'react'

export type MinifiedSubmissionBox = {
    id: string
    title: string
}

export type SubmissionBoxesSelectorProps = {
    allSubmissionBoxes: MinifiedSubmissionBox[]
    submittedBoxes: MinifiedSubmissionBox[]
    onSubmit: (box: MinifiedSubmissionBox[]) => void
    onUnsubmit: (box: MinifiedSubmissionBox[]) => void
}

export default function SubmissionBoxesSelector(props: SubmissionBoxesSelectorProps) {
    const {allSubmissionBoxes, submittedBoxes, onSubmit, onUnsubmit} = props
    // I know storing this as JSON is sus, but the selector doesn't seem to work with objects. See https://github.com/mui/material-ui/issues/16775
    const [selectedBoxes, setSelectedBoxes] = useState<string[]>(submittedBoxes.map((box) => JSON.stringify(box)))

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event

        console.log(event)

        // String case only happens on autofill, which is disabled
        if (typeof value === 'string') {
            return
        }

        const addedBoxes = value.filter((box) => !selectedBoxes.includes(box))
        const removedBoxes = selectedBoxes.filter((box) => !value.includes(box))
        if (addedBoxes.length > 0) {
            // Convert JSON to objects
            onSubmit(addedBoxes.map((box) => JSON.parse(box)))
        }
        if (removedBoxes.length > 0) {
            // Convert JSON to objects
            onUnsubmit(removedBoxes.map((box) => JSON.parse(box)))
        }

        setSelectedBoxes(value)
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
                        {selected.map((boxJSON) => {
                            const box = JSON.parse(boxJSON)
                            return (
                                <Chip key={box.id} label={ box.title } />
                            )
                        })}
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
                    <MenuItem
                        key={box.id}
                        value={JSON.stringify(box)}
                    >
                        {box.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}
