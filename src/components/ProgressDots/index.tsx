'use client'

import React from 'react'
import { Box, Step, StepLabel, Stepper } from '@mui/material'

export type ProgressDotsProps = {
    activeStep: number
    numSteps: number
    labels?: string[]
}

const ProgressDots = (props: ProgressDotsProps) => {
    const { activeStep, numSteps, labels } = props
    const stepperLabels: string[] = labels ? labels : new Array(numSteps).fill('')

    if (stepperLabels.length !== numSteps) {
        throw new Error('The length of labels must be the same as numSteps')
    }

    return (
        <Box className='progress-dots' sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel={!!labels}>
                {stepperLabels &&
                    stepperLabels.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
            </Stepper>
        </Box>
    )
}

export default ProgressDots
