import { DELAY } from './constants'

export default function runWithRetry(func: () => void, attempts = 3) {
    if (attempts === 0) {
        return
    }
    try {
        func()
    } catch (e) {
        cy.wait(DELAY.EXTRA_SHORT)
        runWithRetry(func, attempts - 1)
    }
}
