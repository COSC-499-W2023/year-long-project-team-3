import pino from 'pino'

export default pino({
    browser: {
        asObject: true,
        write: (obj: any) => {
            const logWithLevel = (level: number, objStr: string) => {
                if (level >= 40) {
                    console.error(objStr)
                } else if (obj['level'] >= 30) {
                    console.warn(objStr)
                } else {
                    console.log(objStr)
                }
            }
            try {
                logWithLevel(obj['level'], JSON.stringify(obj))
            } catch (err) {
                if (err instanceof Error) {
                    logWithLevel(obj['level'], JSON.stringify(err, ['name', 'message', 'stack']))
                }
                logWithLevel(obj['level'], JSON.stringify({ message: 'Unknown error type' }))
            }
        },
    },
})
