'use client'

import styles from './SignInPage.module.css'
import { signIn } from 'next-auth/react'
require('dotenv').config()

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
        let authResponse
        try {
            authResponse = await signIn('google', {
                callbackUrl: process.env.NEXT_PUBLIC_BASE_URL,
            })
        } catch (error) {
            console.error(error)
        }

        console.log(authResponse)
    }
}

export default SignInPage
