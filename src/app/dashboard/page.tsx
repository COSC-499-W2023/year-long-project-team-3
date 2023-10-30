import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Dashboard from '@/components/Dashboard'

const page = async () => {
    const session = await getServerSession(authOptions)
    return <Dashboard userEmail={session!.user!.email!}></Dashboard>
}

export default page
