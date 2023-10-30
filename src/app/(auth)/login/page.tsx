import LoginForm from '../../../components/LoginForm/loginForm'
import UserAccountNav from '@/components/UserAccountNav/UserAccountNav'
import { getServerSession } from 'next-auth'
import Dashboard from '@/components/Dashboard'

export default async function LoginPage() {
    const session = await getServerSession()
    return session ? (
        <Dashboard userEmail={session!.user!.email!}></Dashboard>
    ) : (
        <>
            <UserAccountNav />
            <LoginForm />
        </>
    )
}
