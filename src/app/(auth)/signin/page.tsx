'use client'

import styles from './SignInPage.module.css'
import { signIn } from 'next-auth/react'

require('dotenv').config()

const SignInPage = () => {
    return (
        <div className={styles.signInPage} id='sign-in-page'>
            <h1>Sign In Page</h1>
            <button className={styles.signInBtn} onClick={(e) => signInWithGoogle(e)} data-cy='google-sign-in-btn'>
                Sign in with Google
            </button>
        </div>
    )

    function signInWithGoogle(e: React.MouseEvent<HTMLButtonElement>): void {
        try {
            e.preventDefault()
            signIn('google').catch((error) => {
                console.error('An unexpected error occurred while log in with Google: ' + error)
            })
        } catch (error) {
            console.error('An unexpected error occurred while log in with Google: ' + error)
        }
    }
}

export default SignInPage
