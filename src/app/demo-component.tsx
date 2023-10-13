import { useState } from 'react'
export default function Demo({ greetings = 'Good Morning' }) {
    // TODO: delete
    const [greetingMessage] = useState(greetings)

    return (
        <div>
            <div id='message'>Hello World! {greetingMessage}</div>

            <div id='date'>
                <p>Today's date is: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    )
}
