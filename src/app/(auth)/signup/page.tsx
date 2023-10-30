import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'
import SignUpForm from '../../../components/SignUp/signUpForm'

export default async function SignUp() {
    // TODO: figure out what should happen if use navigates to signup while logged in
    return (
        <>
            <UserAccountNav />
            <SignUpForm />
        </>
    )
}
