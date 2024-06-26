import { ReactElement, useState } from 'react'
import { toast } from 'react-toastify'

export function useMultiStepForm(steps: ReactElement[], stepTitles: string[]) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    function next(isStepValid: boolean) {
        if (!isStepValid) {
            return
        }
        setCurrentStepIndex((i) => {
            if (i >= steps.length - 1) {
                return i
            }
            return i + 1
        })
    }

    function back() {
        setCurrentStepIndex((i) => {
            if (i <= 0) {
                return i
            }
            return i - 1
        })
    }

    function goTo(index: number, isStepValid: boolean) {
        if (!isStepValid) {
            return
        }
        setCurrentStepIndex(index)
    }

    return {
        currentStepIndex,
        step: steps[currentStepIndex],
        isFirstStep: currentStepIndex === 0,
        isLastStep: currentStepIndex === steps.length - 1,
        stepTitles: stepTitles,
        currentStepTitle: stepTitles[currentStepIndex],
        goTo,
        next,
        back,
        steps,
    }
}
