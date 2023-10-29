import SignUpForm from '../../../components/SignupForm/form'
import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'

export default async function SignUp() {
    return (
        <>
            <UserAccountNav />
            <SignUpForm />
        </>
    )
}
