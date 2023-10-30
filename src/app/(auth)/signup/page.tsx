import SignUpForm from '../../../components/SignupForm/form'
import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'

export default async function SignUp() {
    // TODO: figure out what should happen if use navigates to signup while logged in
    return (
        <>
            <UserAccountNav />
            <SignUpForm />
        </>
    )
}
