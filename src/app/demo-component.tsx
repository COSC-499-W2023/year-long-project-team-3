import { useState } from 'react'

// TODO: delete
export default function Demo({ greetings = 'Good Morning' }) {
    const [greetingMessage] = useState(greetings)

    return (
        <div>
            <div id='message'>Hello World! {greetingMessage}</div>

            <div id='date'>
                <p>Today&apos;s date is: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    )
}
