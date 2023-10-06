'use client'

import styles from './SignInPage.module.css'
import { signIn } from 'next-auth/react'

const SignInPage = () => {
    return (
        <div className={styles.signInPage}>
            <h1>Sign In Page</h1>
            <button className={styles.signInBtn} onClick={signInWithGoogle}>
                Login with Google
            </button>
        </div>
    )

    async function signInWithGoogle(): Promise<void> {
        let authResponse
        try {
            authResponse = await signIn('google')
        } catch (error) {
            console.error(error)
        }

        console.log(authResponse)
    }
}

export default SignInPage
