import pino from 'pino'
import pretty from 'pino-pretty'

export default pino(
    {
        browser: {
            asObject: true,
            transmit: {
                send: (level, logEvent) => {
                    if (level === 'error') {
                        console.error(logEvent)
                    } else {
                        console.log(logEvent)
                    }
                },
            },
        },
    }
)
