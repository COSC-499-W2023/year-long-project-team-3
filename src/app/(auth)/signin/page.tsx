'use client'

import styles from './SignInPage.module.css'
import { signIn } from 'next-auth/react'

const SignInPage = () => {
    return (
        <div className={styles.signInPage} id='sign-in-page'>
            <h1>Sign In Page</h1>
            <button className={styles.signInBtn} onClick={signInWithGoogle} id='google-log-in-btn'>
                Login with Google
            </button>
        </div>
    )

    async function signInWithGoogle(): Promise<void> {
        signIn('google').catch((error) => {
            console.error('An unexpected error occurred while log in with Google: ' + error)
        })
    }
}

export default SignInPage
